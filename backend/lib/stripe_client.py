"""
Stripe client for Veritas subscription billing.

Handles Stripe customer creation, subscription lifecycle,
and webhook event processing.
"""
import os
import logging
from typing import Optional

import stripe
from stripe.error import StripeError

logger = logging.getLogger(__name__)

# Initialize Stripe from environment
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")

# Public key for frontend
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

# Price IDs per tier — set these via env vars after creating prices in Stripe dashboard
STRIPE_PRICE_MAP = {
    "individual": os.environ.get("STRIPE_PRICE_INDIVIDUAL", ""),
    "pastor": os.environ.get("STRIPE_PRICE_PASTOR", ""),
    "church": os.environ.get("STRIPE_PRICE_CHURCH", ""),
}


def is_configured() -> bool:
    """Check if Stripe is properly configured."""
    return bool(stripe.api_key)


def get_price_id(tier: str) -> Optional[str]:
    """Get the Stripe Price ID for a given tier."""
    return STRIPE_PRICE_MAP.get(tier) or None


def get_public_config() -> dict:
    """Return public Stripe configuration for the frontend."""
    return {
        "stripe_publishable_key": STRIPE_PUBLISHABLE_KEY,
        "stripe_configured": is_configured(),
    }


def create_customer(email: str, name: str, user_id: str) -> Optional[str]:
    """
    Create a Stripe customer for a user.
    Returns the Stripe customer ID, or None on failure.
    """
    if not is_configured():
        return None
    try:
        customer = stripe.Customer.create(
            email=email,
            name=name,
            metadata={"user_id": user_id},
        )
        return customer.id
    except StripeError as e:
        logger.error(f"Failed to create Stripe customer: {e}")
        return None


def create_checkout_session(
    customer_id: str,
    price_id: str,
    user_id: str,
    tier: str,
    success_url: str,
    cancel_url: str,
) -> Optional[dict]:
    """
    Create a Stripe Checkout Session for subscription purchase.
    Returns dict with 'url' and 'session_id', or None on failure.
    """
    if not is_configured():
        return None
    try:
        session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"user_id": user_id, "tier": tier},
        )
        return {"url": session.url, "session_id": session.id}
    except StripeError as e:
        logger.error(f"Failed to create checkout session: {e}")
        raise  # Re-raise for the API to handle


def create_billing_portal_session(customer_id: str, return_url: str) -> Optional[str]:
    """
    Create a Stripe Customer Portal session for billing management.
    Returns the portal URL, or None on failure.
    """
    if not is_configured():
        return None
    try:
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=return_url,
        )
        return session.url
    except StripeError as e:
        logger.error(f"Failed to create billing portal session: {e}")
        return None


def cancel_stripe_subscription(subscription_id: str) -> bool:
    """
    Cancel a Stripe subscription.
    Returns True if successful, False otherwise.
    """
    if not is_configured():
        return False
    try:
        stripe.Subscription.delete(subscription_id)
        return True
    except StripeError as e:
        logger.error(f"Failed to cancel Stripe subscription: {e}")
        return False


def list_active_subscriptions(customer_id: str) -> list:
    """
    List active subscriptions for a customer.
    Returns list of Stripe Subscription objects.
    """
    if not is_configured():
        return []
    try:
        subscriptions = stripe.Subscription.list(
            customer=customer_id,
            status="all",
            limit=1,
        )
        return subscriptions.data
    except StripeError as e:
        logger.error(f"Failed to list subscriptions: {e}")
        return []


def construct_webhook_event(payload: bytes, sig_header: str):
    """
    Construct a Stripe webhook event from the request payload.
    Verifies the signature if a webhook secret is configured.
    """
    if not is_configured():
        return None
    if STRIPE_WEBHOOK_SECRET:
        try:
            return stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Stripe webhook signature verification failed: {e}")
            return None
    else:
        # Unsafe fallback for dev — parse raw JSON
        import json
        try:
            data = json.loads(payload)
            if not isinstance(data, dict) or "type" not in data:
                return None
            return data
        except json.JSONDecodeError:
            return None


# Status mapping from Stripe status to internal status
STATUS_MAP = {
    "active": "active",
    "trialing": "trialing",
    "past_due": "past_due",
    "canceled": "canceled",
    "incomplete": "incomplete",
    "incomplete_expired": "canceled",
    "unpaid": "past_due",
}


def map_status(stripe_status: str) -> str:
    """Map Stripe subscription status to internal status."""
    return STATUS_MAP.get(stripe_status, "active")