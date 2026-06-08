"""SQLAlchemy models for Veritas."""
import uuid
from datetime import datetime, timedelta

from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship

from database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    subscription_tier = Column(String, default="free")  # free, individual, pastor, church
    queries_remaining = Column(Integer, default=5)  # free tier gets 5 queries
    queries_limit = Column(Integer, default=5)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    stripe_customer_id = Column(String, nullable=True)
    subscription_status = Column(String, default="inactive")  # inactive, active, trialing, past_due, canceled
    period_end = Column(DateTime, nullable=True)


class Query(Base):
    __tablename__ = "queries"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    sources_cited = Column(Text, nullable=True)  # JSON string of sources
    translation_preference = Column(String, default="NASB")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="queries")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    tier = Column(String, nullable=False)  # individual, pastor, church
    status = Column(String, default="active")  # active, trialing, past_due, canceled, incomplete
    stripe_subscription_id = Column(String, nullable=True)
    stripe_customer_id = Column(String, nullable=True)
    period_start = Column(DateTime, nullable=True)
    period_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="subscriptions")


# Plan definitions
PLANS = {
    "free": {
        "name": "Free",
        "queries_per_month": 5,
        "price": 0,
        "features": [
            "5 queries per month",
            "Basic sourced answers",
            "NASB/ESV translations",
        ],
    },
    "individual": {
        "name": "Individual",
        "queries_per_month": 50,
        "price": 19,
        "price_label": "$19/mo",
        "features": [
            "50 queries per month",
            "Full sourced answers with citations",
            "All Bible translations",
            "Original language insights",
            "Historical background context",
            "Cross-reference suggestions",
        ],
    },
    "pastor": {
        "name": "Pastor/Teacher",
        "queries_per_month": 999999,  # unlimited
        "price": 49,
        "price_label": "$49/mo",
        "features": [
            "Unlimited queries",
            "Priority sourcing from top commentaries",
            "Full sourced answers with citations",
            "All Bible translations",
            "Original language insights",
            "Historical background context",
            "Cross-reference suggestions",
            "Sermon outline assistance",
            "Priority support",
        ],
    },
    "church": {
        "name": "Church Plan",
        "queries_per_month": 999999,  # unlimited
        "price": 149,
        "price_label": "$149/mo",
        "features": [
            "Up to 5 team accounts",
            "Unlimited queries per account",
            "Priority sourcing from top commentaries",
            "Full sourced answers with citations",
            "All Bible translations",
            "Original language insights",
            "Historical background context",
            "Cross-reference suggestions",
            "Sermon prep workspace",
            "Shared team library",
            "Priority support",
        ],
    },
}