"""
Booking service for business logic related to bookings.
Handles availability checking and conflict detection.
"""

from sqlalchemy.orm import Session
from datetime import datetime, time
from typing import List, Optional
from app.models import Booking, Availability, Staff, BookingStatus


def generate_booking_reference(db: Session, year: int = None) -> str:
    """
    Generate a human-readable booking reference number.
    Format: IS-{YEAR}-{4-digit-sequence}
    Example: IS-2026-0001, IS-2026-0002
    
    Args:
        db: Database session
        year: Year to use (defaults to current year)
    
    Returns:
        Unique booking reference string
    """
    if year is None:
        year = datetime.now().year
    
    # Get the highest sequence number for this year
    from sqlalchemy import func
    latest_booking = db.query(Booking).filter(
        func.extract('year', Booking.created_at) == year
    ).order_by(Booking.id.desc()).first()
    
    if latest_booking and latest_booking.booking_reference:
        # Extract sequence number from existing reference
        try:
            parts = latest_booking.booking_reference.split('-')
            if len(parts) >= 3:
                sequence = int(parts[2])
                next_sequence = sequence + 1
            else:
                next_sequence = 1
        except (ValueError, IndexError):
            next_sequence = 1
    else:
        next_sequence = 1
    
    # Format as 4-digit sequence with leading zeros
    sequence_str = f"{next_sequence:04d}"
    
    return f"IS-{year}-{sequence_str}"


def check_availability(
    db: Session,
    counsellor_id: int,
    scheduled_at: datetime
) -> bool:
    """
    Check if a counsellor is available at a specific time.
    
    Args:
        db: Database session
        counsellor_id: ID of the counsellor
        scheduled_at: DateTime to check availability for
    
    Returns:
        True if available, False otherwise
    """
    # Get the day of the week
    day_of_week = scheduled_at.strftime("%A")
    
    # Find availability for this day
    availability = db.query(Availability).filter(
        Availability.counsellor_id == counsellor_id,
        Availability.day_of_week == day_of_week,
        Availability.is_active == True
    ).first()
    
    if not availability:
        return False
    
    # Parse time strings
    start_time = datetime.strptime(availability.start_time, "%H:%M").time()
    end_time = datetime.strptime(availability.end_time, "%H:%M").time()
    booking_time = scheduled_at.time()
    
    # Check if booking time is within availability window
    return start_time <= booking_time <= end_time


def detect_conflicts(
    db: Session,
    counsellor_id: int,
    scheduled_at: datetime,
    exclude_booking_id: Optional[int] = None
) -> List[Booking]:
    """
    Detect conflicting bookings for a counsellor at a specific time.
    
    Args:
        db: Database session
        counsellor_id: ID of the counsellor
        scheduled_at: DateTime to check for conflicts
        exclude_booking_id: Optional booking ID to exclude from conflict check
    
    Returns:
        List of conflicting bookings
    """
    query = db.query(Booking).filter(
        Booking.counsellor_id == counsellor_id,
        Booking.scheduled_at == scheduled_at,
        Booking.status.in_([BookingStatus.PENDING, BookingStatus.CONFIRMED])
    )
    
    if exclude_booking_id:
        query = query.filter(Booking.id != exclude_booking_id)
    
    return query.all()


def is_booking_time_available(
    db: Session,
    counsellor_id: int,
    scheduled_at: datetime,
    exclude_booking_id: Optional[int] = None
) -> bool:
    """
    Check if a booking time is available (no conflicts and within availability).
    
    Args:
        db: Database session
        counsellor_id: ID of the counsellor
        scheduled_at: DateTime to check
        exclude_booking_id: Optional booking ID to exclude from conflict check
    
    Returns:
        True if available, False otherwise
    """
    # Check availability
    if not check_availability(db, counsellor_id, scheduled_at):
        return False
    
    # Check for conflicts
    conflicts = detect_conflicts(db, counsellor_id, scheduled_at, exclude_booking_id)
    if conflicts:
        return False
    
    return True


def get_available_time_slots(
    db: Session,
    counsellor_id: int,
    date: datetime,
    slot_duration_minutes: int = 60
) -> List[datetime]:
    """
    Get available time slots for a counsellor on a specific date.
    
    Args:
        db: Database session
        counsellor_id: ID of the counsellor
        date: Date to get slots for
        slot_duration_minutes: Duration of each slot in minutes
    
    Returns:
        List of available datetime slots
    """
    day_of_week = date.strftime("%A")
    
    # Get availability for this day
    availability = db.query(Availability).filter(
        Availability.counsellor_id == counsellor_id,
        Availability.day_of_week == day_of_week,
        Availability.is_active == True
    ).first()
    
    if not availability:
        return []
    
    # Parse time strings
    start_time = datetime.strptime(availability.start_time, "%H:%M").time()
    end_time = datetime.strptime(availability.end_time, "%H:%M").time()
    
    # Combine with the date
    start_datetime = datetime.combine(date.date(), start_time)
    end_datetime = datetime.combine(date.date(), end_time)
    
    # Get existing bookings for this day
    existing_bookings = db.query(Booking).filter(
        Booking.counsellor_id == counsellor_id,
        Booking.scheduled_at >= start_datetime,
        Booking.scheduled_at < end_datetime,
        Booking.status.in_([BookingStatus.PENDING, BookingStatus.CONFIRMED])
    ).all()
    
    # Create a set of booked times
    booked_times = {booking.scheduled_at for booking in existing_bookings}
    
    # Generate slots
    slots = []
    current_time = start_datetime
    
    while current_time < end_datetime:
        if current_time not in booked_times:
            slots.append(current_time)
        current_time += datetime.timedelta(minutes=slot_duration_minutes)
    
    return slots
