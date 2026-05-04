from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime, date
import secrets
import string
from app.db.session import get_db
from app.schemas.booking import BookingCreate, BookingUpdate, BookingResponse, BookingWithDetails
from app.models import Booking, BookingStatus, Client, Staff, ServiceType
from app.core.security import get_current_user, get_current_client
from app.models import Staff as StaffModel
from app.services.email_service import send_booking_confirmation

router = APIRouter()


def generate_jitsi_url(booking_id: int) -> str:
    """Generate a unique Jitsi Meet URL for a booking."""
    # Generate a random string for uniqueness
    random_suffix = ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(8))
    return f"https://meet.jit.si/innerserenity-{booking_id}-{random_suffix}"


@router.post("/", response_model=dict)
async def create_booking(
    booking_data: dict,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Create a new booking.
    Public endpoint for booking page.
    """
    try:
        # Extract booking data
        name = booking_data.get("name")
        email = booking_data.get("email")
        phone = booking_data.get("phone")
        session_type = booking_data.get("session_type")
        concerns = booking_data.get("concerns")
        date_str = booking_data.get("date")
        time_slot = booking_data.get("time")
        
        if not all([name, email, phone, date_str, time_slot]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing required fields"
            )
        
        # Parse date and time
        booking_date = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        hours, minutes = map(int, time_slot.split(':'))
        booking_date = booking_date.replace(hour=hours, minute=minutes, second=0, microsecond=0)
        
        # Get or create client
        client = db.query(Client).filter(Client.email == email).first()
        if not client:
            # Split name into first and last
            name_parts = name.split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ""
            
            client = Client(
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=phone
            )
            db.add(client)
            db.flush()  # Get the ID
        
        # Get default counsellor (first available)
        counsellor = db.query(Staff).filter(Staff.role == "counsellor").first()
        if not counsellor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No counsellors available"
            )
        
        # Get service type
        service_type = db.query(ServiceType).filter(
            ServiceType.name == ("Individual Counselling" if session_type == "in-person" else "Virtual Counselling")
        ).first()
        if not service_type:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service type not found"
            )
        
        # Check for conflicts
        conflict = db.query(Booking).filter(
            and_(
                Booking.counsellor_id == counsellor.id,
                Booking.scheduled_at == booking_date,
                Booking.status.in_([BookingStatus.PENDING, BookingStatus.CONFIRMED])
            )
        ).first()
        
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Time slot already booked"
            )
        
        # Generate booking reference
        from app.services.booking_service import generate_booking_reference
        booking_reference = generate_booking_reference(db)
        
        # Generate meeting URL for online sessions
        meeting_url = None
        if session_type == "virtual":
            meeting_url = generate_jitsi_url(0)  # Will update after booking is created
        
        new_booking = Booking(
            client_id=client.id,
            counsellor_id=counsellor.id,
            service_type_id=service_type.id,
            scheduled_at=booking_date,
            status=BookingStatus.PENDING,
            notes=concerns,
            meeting_url=meeting_url,
            booking_reference=booking_reference
        )
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        
        # Update meeting URL with actual booking ID if it's an online session
        if session_type == "virtual" and meeting_url:
            new_booking.meeting_url = generate_jitsi_url(new_booking.id)
            db.commit()
            db.refresh(new_booking)
        
        # Send booking confirmation email in background
        if not new_booking.sent_confirmation_email:
            service_type_display = "in-person" if session_type == "in-person" else "online"
            background_tasks.add_task(
                send_booking_confirmation,
                booking=new_booking,
                client=client,
                service_type=service_type_display,
                counsellor="Caroline"
            )
            
            # Mark email as sent
            new_booking.sent_confirmation_email = True
            db.commit()
        
        return {
            "success": True,
            "booking_reference": booking_reference,
            "booking_id": new_booking.id,
            "scheduled_at": new_booking.scheduled_at.isoformat(),
            "status": new_booking.status.value,
            "meeting_url": new_booking.meeting_url
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Booking creation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create booking"
        )


@router.get("/{booking_id}", response_model=BookingWithDetails)
async def get_booking(
    booking_id: int,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific booking by ID with related details.
    Requires authentication.
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    client = db.query(Client).filter(Client.id == booking.client_id).first()
    counsellor = db.query(Staff).filter(Staff.id == booking.counsellor_id).first()
    service_type = db.query(ServiceType).filter(ServiceType.id == booking.service_type_id).first()
    
    return BookingWithDetails(
        id=booking.id,
        client_id=booking.client_id,
        counsellor_id=booking.counsellor_id,
        service_type_id=booking.service_type_id,
        scheduled_at=booking.scheduled_at,
        status=booking.status,
        notes=booking.notes,
        created_at=booking.created_at,
        client_name=f"{client.first_name} {client.last_name}" if client else "Unknown",
        client_email=client.email if client else "",
        counsellor_name=counsellor.name if counsellor else "Unknown",
        service_type_name=service_type.name if service_type else "Unknown",
        meeting_url=booking.meeting_url
    )


@router.get("/{booking_id}/meeting-link")
async def get_meeting_link(
    booking_id: int,
    db: Session = Depends(get_db)
):
    """
    Get the meeting URL for a booking.
    Public endpoint for clients to access their meeting link.
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if not booking.meeting_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No meeting link available for this booking"
        )
    
    return {
        "booking_id": booking.id,
        "meeting_url": booking.meeting_url,
        "scheduled_at": booking.scheduled_at.isoformat()
    }


@router.get("/", response_model=list[BookingWithDetails])
async def list_bookings(
    counsellor_id: int = Query(None),
    date_from: date = Query(None),
    date_to: date = Query(None),
    date: date = Query(None),
    month: str = Query(None),
    status_filter: BookingStatus = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    List bookings with optional filters by counsellor, date range, and status.
    Public endpoint for admin calendar.
    
    - **counsellor_id**: Filter by specific counsellor
    - **date_from**: Filter bookings from this date onwards
    - **date_to**: Filter bookings up to this date
    - **date**: Filter bookings for specific date
    - **month**: Filter bookings by month (YYYY-MM format)
    - **status_filter**: Filter by booking status
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    """
    query = db.query(Booking)
    
    if counsellor_id:
        query = query.filter(Booking.counsellor_id == counsellor_id)
    
    if date:
        # Filter for specific date
        start_of_day = datetime.combine(date, datetime.min.time())
        end_of_day = datetime.combine(date, datetime.max.time())
        query = query.filter(Booking.scheduled_at >= start_of_day, Booking.scheduled_at <= end_of_day)
    elif month:
        # Filter for month (YYYY-MM format)
        try:
            year, month_num = map(int, month.split('-'))
            start_of_month = datetime(year, month_num, 1)
            if month_num == 12:
                end_of_month = datetime(year + 1, 1, 1) - datetime.timedelta(seconds=1)
            else:
                end_of_month = datetime(year, month_num + 1, 1) - datetime.timedelta(seconds=1)
            query = query.filter(Booking.scheduled_at >= start_of_month, Booking.scheduled_at <= end_of_month)
        except ValueError:
            pass  # Invalid month format, ignore filter
    else:
        if date_from:
            query = query.filter(Booking.scheduled_at >= datetime.combine(date_from, datetime.min.time()))
        
        if date_to:
            query = query.filter(Booking.scheduled_at <= datetime.combine(date_to, datetime.max.time()))
    
    if status_filter:
        query = query.filter(Booking.status == status_filter)
    
    bookings = query.order_by(Booking.scheduled_at).offset(skip).limit(limit).all()
    
    result = []
    for booking in bookings:
        client = db.query(Client).filter(Client.id == booking.client_id).first()
        counsellor = db.query(Staff).filter(Staff.id == booking.counsellor_id).first()
        service_type = db.query(ServiceType).filter(ServiceType.id == booking.service_type_id).first()
        
        result.append(BookingWithDetails(
            id=booking.id,
            client_id=booking.client_id,
            counsellor_id=booking.counsellor_id,
            service_type_id=booking.service_type_id,
            scheduled_at=booking.scheduled_at,
            status=booking.status,
            notes=booking.notes,
            created_at=booking.created_at,
            client_name=f"{client.first_name} {client.last_name}" if client else "Unknown",
            client_email=client.email if client else "",
            counsellor_name=counsellor.name if counsellor else "Unknown",
            service_type_name=service_type.name if service_type else "Unknown"
        ))
    
    return result


@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: int,
    booking_data: BookingUpdate,
    background_tasks: BackgroundTasks,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a booking (schedule, status, or notes).
    Requires authentication.
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # If updating scheduled time, check for conflicts
    if booking_data.scheduled_at and booking_data.scheduled_at != booking.scheduled_at:
        conflict = db.query(Booking).filter(
            and_(
                Booking.counsellor_id == booking.counsellor_id,
                Booking.scheduled_at == booking_data.scheduled_at,
                Booking.status.in_([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
                Booking.id != booking_id
            )
        ).first()
        
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Counsellor already has a booking at this time"
            )
        booking.scheduled_at = booking_data.scheduled_at
    
    if booking_data.status:
        booking.status = booking_data.status
        
        # Send confirmation email when status changes to confirmed
        if (booking_data.status == BookingStatus.CONFIRMED and 
            not booking.sent_confirmation_email):
            client = db.query(Client).filter(Client.id == booking.client_id).first()
            service_type = db.query(ServiceType).filter(ServiceType.id == booking.service_type_id).first()
            
            if client and service_type:
                service_type_display = "in-person" if "in-person" in service_type.name.lower() else "online"
                background_tasks.add_task(
                    send_booking_confirmation,
                    booking=booking,
                    client=client,
                    service_type=service_type_display,
                    counsellor="Caroline"
                )
                
                # Mark email as sent
                booking.sent_confirmation_email = True
    
    if booking_data.notes is not None:
        booking.notes = booking_data.notes
    
    db.commit()
    db.refresh(booking)
    
    return BookingResponse.model_validate(booking)


@router.get("/my-bookings")
async def get_my_bookings(
    current_client: Client = Depends(get_current_client),
    db: Session = Depends(get_db)
):
    """
    Get all bookings for the authenticated client.
    Requires client authentication.
    """
    bookings = db.query(Booking).filter(Booking.client_id == current_client.id).all()
    
    result = []
    for booking in bookings:
        # Get related data
        service_type = db.query(ServiceType).filter(ServiceType.id == booking.service_type_id).first()
        counsellor = db.query(Staff).filter(Staff.id == booking.counsellor_id).first()
        
        booking_data = {
            "id": booking.id,
            "scheduled_at": booking.scheduled_at.isoformat(),
            "status": booking.status.value,
            "service_type_name": service_type.name if service_type else "Unknown",
            "counsellor_name": counsellor.name if counsellor else "Unknown",
            "meeting_url": booking.meeting_url,
            "notes": booking.notes
        }
        
        result.append(booking_data)
    
    return result


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
async def cancel_booking(
    booking_id: int,
    current_client: Client = Depends(get_current_client),
    db: Session = Depends(get_db)
):
    """
    Cancel a booking.
    Requires client authentication.
    """
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.client_id == current_client.id
    ).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if booking.status == BookingStatus.CANCELLED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled"
        )
    
    if booking.status == BookingStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel a completed booking"
        )
    
    booking.status = BookingStatus.CANCELLED
    db.commit()
    db.refresh(booking)
    
    return BookingResponse.model_validate(booking)


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_booking(
    booking_id: int,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a booking permanently.
    Requires authentication.
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    db.delete(booking)
    db.commit()

