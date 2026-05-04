from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime, date, time
from app.db.session import get_db
from app.schemas.availability import AvailabilityCreate, AvailabilityUpdate, AvailabilityResponse, AvailabilitySlot
from app.models import Availability, Staff
from app.core.security import get_current_user
from app.models import Staff as StaffModel

router = APIRouter()


@router.post("/", response_model=AvailabilityResponse, status_code=status.HTTP_201_CREATED)
async def create_availability(
    availability_data: AvailabilityCreate,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Set counsellor availability for a specific day.
    Requires authentication.
    """
    # Verify counsellor exists
    counsellor = db.query(Staff).filter(Staff.id == availability_data.counsellor_id).first()
    if not counsellor or counsellor.role != "counsellor":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Counsellor not found"
        )
    
    # Check if availability already exists for this day
    existing = db.query(Availability).filter(
        Availability.counsellor_id == availability_data.counsellor_id,
        Availability.day_of_week == availability_data.day_of_week
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Availability already exists for this day. Use PUT to update."
        )
    
    new_availability = Availability(**availability_data.model_dump())
    db.add(new_availability)
    db.commit()
    db.refresh(new_availability)
    
    return AvailabilityResponse.model_validate(new_availability)


@router.get("/slots", response_model=list[str])
async def get_available_slots(
    date: date = Query(...),
    db: Session = Depends(get_db)
):
    """
    Get available time slots for a specific date.
    Public endpoint (no authentication required).
    
    - **date**: The date to get slots for (YYYY-MM-DD)
    """
    # Get weekday name
    weekday_name = date.strftime("%A")
    
    # Get availability for this weekday (all counsellors)
    availabilities = db.query(Availability).filter(
        Availability.day_of_week == weekday_name,
        Availability.is_active == True
    ).all()
    
    if not availabilities:
        return []
    
    # Generate time slots from earliest start to latest end
    all_slots = []
    for avail in availabilities:
        start_time = datetime.strptime(avail.start_time, "%H:%M")
        end_time = datetime.strptime(avail.end_time, "%H:%M")
        
        # Generate hourly slots
        current_time = start_time
        while current_time + datetime.timedelta(hours=1) <= end_time:
            slot_time = current_time.strftime("%H:%M")
            all_slots.append(slot_time)
            current_time += datetime.timedelta(hours=1)
    
    # Remove duplicates and sort
    unique_slots = sorted(list(set(all_slots)))
    
    # TODO: Filter out already booked slots from bookings table
    # For now, return all available slots
    
    return unique_slots


@router.get("/{availability_id}", response_model=AvailabilityResponse)
async def get_availability(
    availability_id: int,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific availability record by ID.
    Requires authentication.
    """
    availability = db.query(Availability).filter(Availability.id == availability_id).first()
    if not availability:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Availability not found"
        )
    
    return AvailabilityResponse.model_validate(availability)


@router.get("/", response_model=list[AvailabilityResponse])
async def list_availability(
    counsellor_id: int = Query(None),
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all availability records, optionally filtered by counsellor.
    Requires authentication.
    
    - **counsellor_id**: Filter by specific counsellor
    """
    query = db.query(Availability)
    
    if counsellor_id:
        query = query.filter(Availability.counsellor_id == counsellor_id)
    
    availabilities = query.order_by(Availability.day_of_week).all()
    return [AvailabilityResponse.model_validate(a) for a in availabilities]


@router.put("/{availability_id}", response_model=AvailabilityResponse)
async def update_availability(
    availability_id: int,
    availability_data: AvailabilityUpdate,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update an availability record.
    Requires authentication.
    """
    availability = db.query(Availability).filter(Availability.id == availability_id).first()
    if not availability:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Availability not found"
        )
    
    update_data = availability_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(availability, field, value)
    
    db.commit()
    db.refresh(availability)
    
    return AvailabilityResponse.model_validate(availability)


@router.delete("/{availability_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_availability(
    availability_id: int,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete an availability record.
    Requires authentication.
    """
    availability = db.query(Availability).filter(Availability.id == availability_id).first()
    if not availability:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Availability not found"
        )
    
    db.delete(availability)
    db.commit()
