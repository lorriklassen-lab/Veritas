"""Veritas — AI Biblical Research Assistant API."""
import json
import os
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import Base, engine, get_db, SessionLocal
from models import User, Query, Subscription, PLANS, generate_uuid
from auth import (
    verify_password, get_password_hash, create_access_token,
    get_current_user,
)

import stripe
# Initialize Stripe from environment
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY", "")

# Stripe price IDs per tier (set these in env or use defaults for dev)
STRIPE_PRICE_MAP = {
    "individual": os.environ.get("STRIPE_PRICE_INDIVIDUAL", "price_individual"),
    "pastor": os.environ.get("STRIPE_PRICE_PASTOR", "price_pastor"),
    "church": os.environ.get("STRIPE_PRICE_CHURCH", "price_church"),
}

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Veritas API",
    description="AI Biblical Research Assistant",
    version="0.1.0",
)

# CORS — allow all origins for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Pydantic Schemas
# ============================================================

class SignupRequest(BaseModel):
    email: EmailStr
    name: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class QueryRequest(BaseModel):
    question: str
    translation_preference: Optional[str] = "NASB"

class QueryResponse(BaseModel):
    id: str
    question: str
    answer: str
    sources_cited: list
    created_at: str

class SubscriptionCreate(BaseModel):
    tier: str  # individual, pastor, church
    stripe_payment_method_id: Optional[str] = None

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    translation_preference: Optional[str] = None

# ============================================================
# Helper: Deduct query count
# ============================================================

def deduct_query(user: User, db: Session):
    """Deduct one query from the user's remaining count."""
    if user.subscription_tier in ("pastor", "church"):
        return  # unlimited
    if user.queries_remaining <= 0:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Query limit reached. Please upgrade your subscription.",
        )
    user.queries_remaining -= 1
    db.commit()

# ============================================================
# Auth Routes
# ============================================================

@app.post("/api/auth/signup", response_model=TokenResponse)
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    """Create a new user account."""
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
        id=generate_uuid(),
        email=req.email,
        name=req.name,
        hashed_password=get_password_hash(req.password),
        subscription_tier="free",
        queries_remaining=PLANS["free"]["queries_per_month"],
        queries_limit=PLANS["free"]["queries_per_month"],
    )

    # Create Stripe customer if Stripe is configured
    if stripe.api_key:
        try:
            customer = stripe.Customer.create(
                email=req.email,
                name=req.name,
                metadata={"user_id": user.id},
            )
            user.stripe_customer_id = customer.id
        except stripe.error.StripeError:
            pass  # Non-fatal if Stripe fails

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": user.id})
    return TokenResponse(
        access_token=token,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "subscription_tier": user.subscription_tier,
            "queries_remaining": user.queries_remaining,
            "queries_limit": user.queries_limit,
        },
    )


@app.post("/api/auth/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate and return a JWT token."""
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )

    token = create_access_token(data={"sub": user.id})
    return TokenResponse(
        access_token=token,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "subscription_tier": user.subscription_tier,
            "queries_remaining": user.queries_remaining,
            "queries_limit": user.queries_limit,
        },
    )

# ============================================================
# User Routes
# ============================================================

@app.get("/api/user/me")
@app.get("/api/user/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    """Get the current user's profile. Alias at /api/user/me."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "subscription_tier": current_user.subscription_tier,
        "queries_remaining": current_user.queries_remaining,
        "queries_limit": current_user.queries_limit,
        "subscription_status": current_user.subscription_status,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
    }


@app.put("/api/user/profile")
def update_profile(
    req: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update user profile."""
    if req.name is not None:
        current_user.name = req.name
    db.commit()
    return {"status": "ok", "name": current_user.name}


@app.get("/api/user/queries")
def get_user_queries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the user's query history."""
    queries = (
        db.query(Query)
        .filter(Query.user_id == current_user.id)
        .order_by(Query.created_at.desc())
        .limit(50)
        .all()
    )
    return [
        {
            "id": q.id,
            "question": q.question,
            "answer": q.answer,
            "sources_cited": json.loads(q.sources_cited) if q.sources_cited else [],
            "translation_preference": q.translation_preference,
            "created_at": q.created_at.isoformat() if q.created_at else None,
        }
        for q in queries
    ]

# ============================================================
# Query Route (the core AI-powered endpoint)
# ============================================================

@app.post("/api/query", response_model=QueryResponse)
async def ask_question(
    req: QueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Ask a biblical research question and get a sourced answer."""
    # Check query limit
    deduct_query(current_user, db)

    # Determine answer complexity tier based on question length and depth
    question = req.question.strip()

    # Build the prompt with source injection (Phase 2 integration)
    translation = req.translation_preference or "NASB"

    system_prompt = f"""You are Veritas, an AI biblical research and study assistant. You provide clear, accurate, well-sourced answers to biblical questions.

## Core Rules
1. **Every factual claim gets a citation.** Use proper citation format per our standards.
2. **Prefer primary sources** (NASB, ESV, BDAG, NICNT/NICOT) over lower-tier sources.
3. **Be specific in citations** — not "see BDAG" but "BDAG, s.v. 'ἀγάπη,' meaning 1b".
4. **Present scholarly views fairly** — majority and notable minority views.
5. **No fluff, no prosperity gospel, no speculation presented as fact.**
6. **When scholars disagree, cite both positions fairly.**
7. **Match answer depth to question complexity.**
8. **Use {translation} as default translation** but you may reference others for comparison.

## Answer Structure
Organize your answer with these sections as appropriate:
- **Direct Answer** (1-2 sentences)
- **Biblical Context** (key passages, literary context, canonical connections)
- **Original Language Insights** (Greek/Hebrew terms with transliteration, lexical range)
- **Scholarly Perspectives** (majority view, notable minority views)
- **Practical Significance** (application, homiletical notes)
- **Sources & Further Reading** (full citations per our citation standards)

## Citation Format
- Bible: Book Chapter:Verse (Translation) — e.g., John 3:16 (NASB)
- Lexicon: [Lexicon], s.v. "[Word]," [definition ref] — e.g., BDAG, s.v. "λόγος," meaning 1b
- Commentary: [Author], *Title* ([Series]), [Page] — e.g., Fee, *1 Corinthians* (NICNT), 123
- Book: [Author], *Title* ([Publisher], [Year]), [Page]
- Include Greek/Hebrew script with transliteration on first use

## Question
{question}"""

    # In MVP, we use a structured response without an actual LLM call
    # (the /api/key endpoint provides the API key; for now we demonstrate the schema)
    # We'll try to use OpenAI if a key is set, otherwise return a thoughtful response

    openai_api_key = os.environ.get("OPENAI_API_KEY")

    if openai_api_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai_api_key)
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question},
                ],
                temperature=0.3,
                max_tokens=2000,
            )
            answer_text = response.choices[0].message.content
            # For now, simulate source extraction from the answer
            sources_cited = _extract_sources(answer_text)
        except Exception as e:
            # Fallback if API call fails
            answer_text = _generate_fallback_answer(question, translation)
            sources_cited = _extract_sources(answer_text)
    else:
        # No API key — use fallback for MVP demo
        answer_text = _generate_fallback_answer(question, translation)
        sources_cited = _extract_sources(answer_text)

    # Store the query
    query = Query(
        id=generate_uuid(),
        user_id=current_user.id,
        question=question,
        answer=answer_text,
        sources_cited=json.dumps(sources_cited),
        translation_preference=translation,
    )
    db.add(query)
    db.commit()
    db.refresh(query)

    return QueryResponse(
        id=query.id,
        question=query.question,
        answer=query.answer,
        sources_cited=sources_cited,
        created_at=query.created_at.isoformat() if query.created_at else None,
    )


def _extract_sources(text: str) -> list:
    """Extract source citations from answer text."""
    import re
    sources = []
    # Look for parenthetical citations like (NASB), (BDAG, s.v. ...)
    citation_patterns = re.findall(r'\([^)]*(?:NASB|ESV|NIV|CSB|KJV|NKJV|NRSV|BDAG|HALOT|BDB|NICNT|NICOT|BECNT|PNTC|WBC|NAC|TOTC|TNTC|NIDNTTE|NIDOTTE|IVP)[^)]*\)', text)
    for c in citation_patterns:
        if c not in sources:
            sources.append(c)
    # Also look for "Sources:" section at end
    sources_section = re.search(r'(?:Sources|Key Sources|Further Reading)[:\s]*([^\n]*(?:\n[^\n]*)*)', text)
    if sources_section:
        for line in sources_section.group(1).strip().split('\n'):
            line = line.strip()
            if line and line not in sources:
                sources.append(line)
    return sources[:10]  # limit


def _generate_fallback_answer(question: str, translation: str) -> str:
    """Generate a thoughtful fallback answer when no AI API key is configured.
    
    This provides a meaningful demo experience while clearly noting it's a template.
    """
    question_lower = question.lower()

    # Detect common question types
    is_word_study = any(w in question_lower for w in [
        "what does", "meaning", "definition", "greek word", "hebrew word",
        "original language", "strong's", "word study"
    ])
    is_passage = any(w in question_lower for w in [
        "what does", "mean", "interpretation", "explain", "passage",
        "verse", "chapter"
    ]) and not is_word_study
    is_background = any(w in question_lower for w in [
        "background", "history", "historical", "culture", "context"
    ])
    is_theological = any(w in question_lower for w in [
        "trinity", "predestination", "salvation", "atonement", "resurrection",
        "end times", "eschatology", "theology", "doctrine"
    ])
    is_comparison = any(w in question_lower for w in [
        "compare", "difference between", "translation", "version"
    ])

    if is_word_study:
        return _fallback_word_study(question, translation)
    elif is_background:
        return _fallback_background(question, translation)
    elif is_theological:
        return _fallback_theological(question, translation)
    elif is_comparison:
        return _fallback_comparison(question, translation)
    elif is_passage:
        return _fallback_passage(question, translation)
    else:
        return _fallback_general(question, translation)


def _fallback_word_study(question: str, translation: str) -> str:
    return f"""### Direct Answer
This word study requires careful examination of the original language term in its context.

### Original Language Insights
The key term in this passage merits examination across its usage in the New Testament. A proper word study would consult BDAG (the standard Greek lexicon) for the lexical range, examine usage across the corpus of the author, and consider how the term functions in this specific context.

### Scholarly Perspectives
Commentators offer various nuanced interpretations depending on the precise contextual force of the term here.

**Key Sources:**
- BDAG (primary lexicon for NT Greek)
- NIDNTTE (theological dictionary for word studies)
- Relevant commentary on the book (NICNT, BECNT, or PNTC series)

*Note: This is a template response. To receive a fully researched, AI-powered answer with exact citations from BDAG, HALOT, commentaries, and scholarly sources, please set the OPENAI_API_KEY environment variable and restart the server.*"""


def _fallback_passage(question: str, translation: str) -> str:
    return f"""### Direct Answer
The interpretation of this passage requires careful attention to its literary context, original language features, and the range of scholarly perspectives.

### Biblical Context
This passage occurs within the broader literary structure of its book. The immediate context — what comes before and after — shapes the meaning significantly.

### Original Language Insights
Key terms in the original Greek/Hebrew text carry nuances that may not be fully captured in English translation. A careful word study of these terms reveals the writer's theological emphasis.

### Scholarly Perspectives
Commentators offer a range of views on this passage. The majority interpretation focuses on [consensus view], while notable alternatives include [minority views].

### Practical Significance
This passage speaks to [theological/practical application], reminding readers of [key takeaway].

**Key Sources:**
- The passage in {translation}, ESV, NIV, and CSB for comparison
- Relevant commentary in NICNT/NICOT or BECNT series
- Background sources (Keener, *IVP Bible Background Commentary*)

*Note: This is a template response. To receive a fully researched, AI-powered answer with exact citations from commentaries, lexicons, and scholarly sources, please set the OPENAI_API_KEY environment variable and restart the server.*"""


def _fallback_background(question: str, translation: str) -> str:
    return f"""### Historical & Cultural Context
This topic involves understanding the historical, cultural, and social background of the biblical world.

### Biblical Evidence
The biblical text provides several key references that inform our understanding.

### Scholarly Reconstruction
Scholars draw on several sources to reconstruct this background: biblical texts, archaeological discoveries, contemporaneous ancient Near Eastern/Greco-Roman literature, and works of Second Temple Judaism.

**Key Sources:**
- Keener, *IVP Bible Background Commentary: New Testament*
- Walton, Matthews & Chavalas, *IVP Bible Background Commentary: Old Testament*
- Relevant entries in *Eerdmans Dictionary of the Bible*
- Josephus, *Antiquities* / *Jewish Wars* (for Second Temple period)

*Note: This is a template response. To receive a fully researched, AI-powered answer with exact citations from background sources, please set the OPENAI_API_KEY environment variable and restart the server.*"""


def _fallback_theological(question: str, translation: str) -> str:
    return f"""### Direct Answer
This is an important theological question that deserves careful, nuanced treatment.

### Biblical Data
Several key passages inform this doctrine. Each must be interpreted in its context before systematic conclusions are drawn.

### Scholarly Perspectives
There is a range of views on this topic within orthodox Christianity:

1. **View One** — Supported by [key scholars], based on [key passages].
2. **View Two** — Supported by [key scholars], based on [key passages].
3. **View Three (if applicable)** — Supported by [key scholars], based on [key passages].

### Historical Development
This doctrine was refined over church history, with key contributions from [historical figures/councils].

### Practical Significance
This doctrine matters for Christian living because [application].

**Key Sources:**
- Relevant systematic theologies (Grudem, Erickson, Berkhof)
- Biblical theology works (Beale, Schreiner, Goldsworthy)
- Key monographs on this specific topic

*Note: This is a template response. To receive a fully researched, AI-powered answer with exact citations from theological sources, please set the OPENAI_API_KEY environment variable and restart the server.*"""


def _fallback_comparison(question: str, translation: str) -> str:
    return f"""### Translation Comparison
Different Bible translations take different approaches to rendering the original text:

| Translation | Approach | Example Rendering |
|---|---|---|
| NASB | Formal equivalence (word-for-word) | Most literal |
| ESV | Essentially literal | Formal but readable |
| CSB | Optimal equivalence | Balance of formal and dynamic |
| NIV | Dynamic equivalence (thought-for-thought) | Most readable |

### Significance of Differences
Translation differences arise from textual variants, lexical choices, and philosophical approach to translation. A key Hebrew/Greek term here [term] can be translated as [options], and different translators weigh the contextual factors differently.

**Key Sources:**
- {translation}, ESV, NIV, CSB for direct comparison
- Metzger, *The Text of the New Testament* (textual criticism)
- Carson, *The King James Version Debate* (translation philosophy)

*Note: This is a template response. To receive a fully researched, AI-powered answer with exact citations, please set the OPENAI_API_KEY environment variable and restart the server.*"""


def _fallback_general(question: str, translation: str) -> str:
    return f"""### Direct Answer
This is an important biblical question that deserves careful study grounded in the text and credible scholarship.

### Biblical Context
The relevant biblical passages address this topic across multiple books and genres of Scripture. Understanding the broader canonical context helps clarify the biblical teaching.

### Original Language Insights
Key Hebrew and Greek terms illuminate the meaning of the original text in ways that English translations cannot fully capture.

### Scholarly Perspectives
The scholarly consensus and points of debate on this question include...

### Practical Significance
This biblical teaching carries significant implications for faith and practice.

**Key Sources:**
- {translation} (primary translation)
- Relevant lexicons (BDAG for NT Greek, HALOT for OT Hebrew)
- Commentaries on the relevant books (NICNT/NICOT, BECNT, PNTC)
- Theological reference works as appropriate

*Note: This is a template response. To receive a fully researched, AI-powered answer with exact citations from commentaries, lexicons, and scholarly sources, please set the OPENAI_API_KEY environment variable and restart the server.*"""


# ============================================================
# Subscription Routes (Stripe Integration)
# ============================================================

@app.get("/api/plans")
def get_plans():
    """List available subscription plans."""
    return {tier: info for tier, info in PLANS.items() if tier != "free"}


@app.get("/api/config")
def get_config():
    """Return public configuration (Stripe publishable key, etc.)."""
    return {
        "stripe_publishable_key": STRIPE_PUBLISHABLE_KEY,
        "stripe_configured": bool(stripe.api_key),
    }


@app.get("/api/subscription")
def get_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current user's subscription details."""
    sub = (
        db.query(Subscription)
        .filter(Subscription.user_id == current_user.id)
        .order_by(Subscription.created_at.desc())
        .first()
    )
    if not sub:
        return {
            "tier": current_user.subscription_tier,
            "status": current_user.subscription_status or "none",
            "queries_remaining": current_user.queries_remaining,
            "queries_limit": current_user.queries_limit,
        }
    return {
        "id": sub.id,
        "tier": sub.tier,
        "status": sub.status,
        "period_start": sub.period_start.isoformat() if sub.period_start else None,
        "period_end": sub.period_end.isoformat() if sub.period_end else None,
        "created_at": sub.created_at.isoformat() if sub.created_at else None,
        "queries_remaining": current_user.queries_remaining,
        "queries_limit": current_user.queries_limit,
    }


class StripeCheckoutRequest(BaseModel):
    tier: str  # individual, pastor, church
    success_url: str = ""
    cancel_url: str = ""


@app.post("/api/subscription/create-checkout")
def create_checkout_session(
    req: StripeCheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a Stripe Checkout Session for subscription."""
    if not stripe.api_key:
        raise HTTPException(status_code=503, detail="Stripe is not configured")

    if req.tier not in PLANS or req.tier == "free":
        raise HTTPException(status_code=400, detail=f"Invalid tier: {req.tier}")

    price_id = STRIPE_PRICE_MAP.get(req.tier)
    if not price_id or price_id.startswith("price_"):
        raise HTTPException(status_code=503, detail="Stripe price ID not configured for this tier")

    try:
        # Create or retrieve Stripe customer
        customer_id = current_user.stripe_customer_id
        if not customer_id:
            customer = stripe.Customer.create(
                email=current_user.email,
                name=current_user.name,
                metadata={"user_id": current_user.id},
            )
            customer_id = customer.id
            current_user.stripe_customer_id = customer_id
            db.commit()

        # Create checkout session
        base_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
        session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=req.success_url or f"{base_url}/subscription?success=true&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=req.cancel_url or f"{base_url}/subscription?canceled=true",
            metadata={"user_id": current_user.id, "tier": req.tier},
        )

        return {"url": session.url, "session_id": session.id}

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")


@app.post("/api/subscription/portal")
def create_billing_portal(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a Stripe Customer Portal session for managing billing."""
    if not stripe.api_key:
        raise HTTPException(status_code=503, detail="Stripe is not configured")

    customer_id = current_user.stripe_customer_id
    if not customer_id:
        raise HTTPException(status_code=400, detail="No Stripe customer found")

    try:
        base_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=f"{base_url}/subscription",
        )
        return {"url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")


@app.post("/api/subscription/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events for subscription lifecycle."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    if not stripe.api_key:
        return {"status": "ignored", "reason": "Stripe not configured"}

    # Verify webhook signature if secret is configured
    if STRIPE_WEBHOOK_SECRET:
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")
    else:
        # If no webhook secret, parse payload directly (not secure for production)
        try:
            event = json.loads(payload)
            if isinstance(event, dict) and "type" not in event:
                raise ValueError("Not a Stripe event")
        except (json.JSONDecodeError, ValueError):
            raise HTTPException(status_code=400, detail="Invalid payload")

    event_type = event.get("type") if isinstance(event, dict) else event.type
    event_data = event.get("data", {}).get("object", {}) if isinstance(event, dict) else event.data.object

    # Handle subscription lifecycle events
    if event_type.startswith("customer.subscription."):
        subscription_id = event_data.get("id") if isinstance(event_data, dict) else event_data.id
        customer_id = event_data.get("customer") if isinstance(event_data, dict) else event_data.customer
        status = event_data.get("status") if isinstance(event_data, dict) else event_data.status

        # Find user by Stripe customer ID
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if not user:
            return {"status": "ignored", "reason": "User not found"}

        # Map Stripe status to our status
        status_map = {
            "active": "active",
            "trialing": "trialing",
            "past_due": "past_due",
            "canceled": "canceled",
            "incomplete": "incomplete",
            "incomplete_expired": "canceled",
            "unpaid": "past_due",
        }
        mapped_status = status_map.get(status, "active")

        # Update user subscription status
        if event_type in ("customer.subscription.created", "customer.subscription.updated"):
            items = event_data.get("items", {}).get("data", []) if isinstance(event_data, dict) else event_data.items.data
            price_id = items[0].price.id if items else None
            current_period_end = event_data.get("current_period_end") if isinstance(event_data, dict) else event_data.current_period_end

            # Determine tier from price ID (reverse lookup)
            tier = "individual"
            for t, pid in STRIPE_PRICE_MAP.items():
                if price_id == pid:
                    tier = t
                    break

            plan = PLANS.get(tier, PLANS["individual"])
            user.subscription_tier = tier
            user.queries_remaining = plan["queries_per_month"]
            user.queries_limit = plan["queries_per_month"]
            user.subscription_status = mapped_status

            # Create/update subscription record
            sub = (
                db.query(Subscription)
                .filter(
                    Subscription.stripe_subscription_id == subscription_id,
                )
                .first()
            )
            if not sub:
                sub = Subscription(
                    user_id=user.id,
                    tier=tier,
                    status=mapped_status,
                    stripe_subscription_id=subscription_id,
                    stripe_customer_id=customer_id,
                    period_start=datetime.utcnow(),
                )
                db.add(sub)
            else:
                sub.status = mapped_status
                sub.tier = tier

            if current_period_end:
                sub.period_end = datetime.fromtimestamp(
                    current_period_end if isinstance(current_period_end, (int, float)) else current_period_end.timestamp()
                )

        elif event_type == "customer.subscription.deleted":
            user.subscription_tier = "free"
            user.queries_remaining = PLANS["free"]["queries_per_month"]
            user.queries_limit = PLANS["free"]["queries_per_month"]
            user.subscription_status = "canceled"

            sub = (
                db.query(Subscription)
                .filter(Subscription.stripe_subscription_id == subscription_id)
                .first()
            )
            if sub:
                sub.status = "canceled"

        db.commit()

    return {"status": "received"}


@app.get("/api/subscription/check")
def check_subscription_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Check and sync subscription status with Stripe."""
    if not stripe.api_key or not current_user.stripe_customer_id:
        return {"status": current_user.subscription_status or "inactive"}

    try:
        # List active subscriptions from Stripe
        subscriptions = stripe.Subscription.list(
            customer=current_user.stripe_customer_id,
            status="all",
            limit=1,
        )
        if subscriptions.data:
            sub_data = subscriptions.data[0]
            status_map = {
                "active": "active",
                "trialing": "trialing",
                "past_due": "past_due",
                "canceled": "canceled",
                "incomplete": "incomplete",
            }
            mapped = status_map.get(sub_data.status, "active")

            # Update local status if different
            if current_user.subscription_status != mapped:
                current_user.subscription_status = mapped
                if mapped in ("canceled", "incomplete", "past_due") and current_user.subscription_tier != "free":
                    pass  # Don't auto-downgrade; let webhook handle it
                db.commit()

            return {"status": mapped, "stripe_status": sub_data.status}
        else:
            return {"status": current_user.subscription_status or "none"}

    except stripe.error.StripeError:
        return {"status": current_user.subscription_status or "unknown"}


@app.post("/api/subscription/create")
def create_subscription(
    req: SubscriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create or update a subscription directly (for dev/test without Stripe)."""
    if req.tier not in PLANS:
        raise HTTPException(status_code=400, detail=f"Invalid tier: {req.tier}")
    if req.tier == "free":
        raise HTTPException(status_code=400, detail="Free tier is the default")

    plan = PLANS[req.tier]

    current_user.subscription_tier = req.tier
    current_user.queries_remaining = plan["queries_per_month"]
    current_user.queries_limit = plan["queries_per_month"]
    current_user.subscription_status = "active"

    # Create subscription record
    sub = Subscription(
        user_id=current_user.id,
        tier=req.tier,
        status="active",
        period_start=datetime.utcnow(),
    )
    db.add(sub)
    db.commit()

    return {
        "status": "active",
        "tier": req.tier,
        "queries_remaining": current_user.queries_remaining,
        "note": "Direct subscription created (not via Stripe). Use /create-checkout for Stripe billing.",
    }


@app.post("/api/subscription/cancel")
def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel the current subscription and revert to free tier."""
    # Cancel in Stripe if there's a customer
    if stripe.api_key and current_user.stripe_customer_id:
        try:
            subscriptions = stripe.Subscription.list(
                customer=current_user.stripe_customer_id,
                status="active",
                limit=1,
            )
            for sub in subscriptions.data:
                stripe.Subscription.delete(sub.id)
        except stripe.error.StripeError:
            pass  # Fall through to local cancellation

    current_user.subscription_tier = "free"
    current_user.queries_remaining = PLANS["free"]["queries_per_month"]
    current_user.queries_limit = PLANS["free"]["queries_per_month"]
    current_user.subscription_status = "canceled"

    local_sub = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == current_user.id,
            Subscription.status == "active",
        )
        .first()
    )
    if local_sub:
        local_sub.status = "canceled"

    db.commit()
    return {"status": "canceled", "tier": "free"}


# ============================================================
# Health Check & Debug
# ============================================================

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "veritas-api", "version": "0.1.0"}


@app.get("/api/key/check")
def check_api_key():
    """Check if an OpenAI API key is configured."""
    has_key = bool(os.environ.get("OPENAI_API_KEY"))
    return {
        "configured": has_key,
        "note": "Without an API key, fallback template responses will be used."
    }


# ============================================================
# Entry point
# ============================================================

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)