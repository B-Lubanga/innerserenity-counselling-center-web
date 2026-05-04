"""
Chat context service for building dynamic system prompts.
Pulls live data from the database and caches it for 30 minutes.
"""

from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from app.models import ServiceType, Availability, Staff
from app.core.config import settings


# Cache for the system prompt
_cached_prompt: Optional[str] = None
_cache_timestamp: Optional[datetime] = None
CACHE_DURATION = timedelta(minutes=30)


def get_system_prompt(db: Session) -> str:
    """
    Get the system prompt for the chat assistant.
    Caches the prompt for 30 minutes to avoid frequent DB queries.
    
    Args:
        db: Database session
    
    Returns:
        System prompt string with context about the counselling centre
    """
    global _cached_prompt, _cache_timestamp
    
    # Check if cache is still valid
    if _cached_prompt and _cache_timestamp:
        if datetime.utcnow() - _cache_timestamp < CACHE_DURATION:
            return _cached_prompt
    
    # Build fresh prompt from database
    prompt = _build_system_prompt(db)
    
    # Update cache
    _cached_prompt = prompt
    _cache_timestamp = datetime.utcnow()
    
    return prompt


def _build_system_prompt(db: Session) -> str:
    """
    Build the system prompt by pulling live data from the database.
    """
    # Get service types and pricing
    service_types = db.query(ServiceType).all()
    services_text = "\n".join([
        f"- {s.name.value}: {s.duration_minutes} minutes, ${s.base_price}"
        for s in service_types
    ])
    
    # Get availability days
    availabilities = db.query(Availability).filter(Availability.is_active == True).all()
    days = set(a.day_of_week for a in availabilities)
    availability_text = ", ".join(sorted(days)) if days else "Contact us for availability"
    
    # Get counsellor names
    counsellors = db.query(Staff).filter(Staff.role == "counsellor").all()
    counsellor_names = ", ".join([c.name for c in counsellors]) if counsellors else "Our team"
    
    # WhatsApp fallback number
    whatsapp_number = settings.WHATSAPP_NUMBER or "contact us"
    
    prompt = f"""You are a helpful assistant for Inner Serenity Counselling Centre. You help potential and existing clients with information about our services, booking appointments, and general mental wellness queries.

**Services:**
Individual Counselling, Couples Counselling, Group Counselling, Online Sessions.

**Office Hours:**
Monday-Friday 10am-7pm. Closed weekends.

**Your Role:**
You are warm, professional and non-judgmental. For emergencies, always refer to crisis helplines. If someone wants to book, guide them to the /booking page.

**WhatsApp Fallback:**
When needed, provide WhatsApp: {whatsapp_number}
Link: https://wa.me/{whatsapp_number}

**Guidelines:**
- Be helpful and concise
- Guide users to booking page when appropriate
- Escalate to human for complex issues
- Always include crisis helpline info for emergencies"""
    
    return prompt


def invalidate_cache():
    """
    Invalidate the cached system prompt.
    Call this after updating service types, availability, or staff.
    """
    global _cached_prompt, _cache_timestamp
    _cached_prompt = None
    _cache_timestamp = None
