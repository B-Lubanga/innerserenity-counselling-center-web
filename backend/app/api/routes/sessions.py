from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.session import (
    SessionReportCreate, SessionReportUpdate, SessionReportResponse, SessionReportWithDetails
)
from app.models import SessionReport, Booking, Client, Staff
from app.core.security import get_current_user
from app.models import Staff as StaffModel

router = APIRouter()


@router.post("/", response_model=SessionReportResponse, status_code=status.HTTP_201_CREATED)
async def create_session_report(
    report_data: SessionReportCreate,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new session report.
    Requires authentication.
    """
    # Verify booking exists
    booking = db.query(Booking).filter(Booking.id == report_data.booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Verify client exists
    client = db.query(Client).filter(Client.id == report_data.client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Verify counsellor exists
    counsellor = db.query(Staff).filter(Staff.id == report_data.counsellor_id).first()
    if not counsellor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Counsellor not found"
        )
    
    # Check if report already exists for this booking
    existing = db.query(SessionReport).filter(
        SessionReport.booking_id == report_data.booking_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session report already exists for this booking"
        )
    
    new_report = SessionReport(**report_data.model_dump())
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return SessionReportResponse.model_validate(new_report)


@router.get("/{report_id}", response_model=SessionReportWithDetails)
async def get_session_report(
    report_id: int,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific session report by ID with related details.
    Requires authentication.
    """
    report = db.query(SessionReport).filter(SessionReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session report not found"
        )
    
    client = db.query(Client).filter(Client.id == report.client_id).first()
    counsellor = db.query(Staff).filter(Staff.id == report.counsellor_id).first()
    
    return SessionReportWithDetails(
        id=report.id,
        booking_id=report.booking_id,
        counsellor_id=report.counsellor_id,
        client_id=report.client_id,
        session_date=report.session_date,
        notes=report.notes,
        goals=report.goals,
        progress=report.progress,
        next_steps=report.next_steps,
        created_at=report.created_at,
        client_name=f"{client.first_name} {client.last_name}" if client else "Unknown",
        counsellor_name=counsellor.name if counsellor else "Unknown"
    )


@router.get("/", response_model=list[SessionReportWithDetails])
async def list_session_reports(
    client_id: int = Query(None),
    counsellor_id: int = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List session reports with optional filters by client or counsellor.
    Requires authentication.
    
    - **client_id**: Filter by specific client
    - **counsellor_id**: Filter by specific counsellor
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    """
    query = db.query(SessionReport)
    
    if client_id:
        query = query.filter(SessionReport.client_id == client_id)
    
    if counsellor_id:
        query = query.filter(SessionReport.counsellor_id == counsellor_id)
    
    reports = query.order_by(SessionReport.session_date.desc()).offset(skip).limit(limit).all()
    
    result = []
    for report in reports:
        client = db.query(Client).filter(Client.id == report.client_id).first()
        counsellor = db.query(Staff).filter(Staff.id == report.counsellor_id).first()
        
        result.append(SessionReportWithDetails(
            id=report.id,
            booking_id=report.booking_id,
            counsellor_id=report.counsellor_id,
            client_id=report.client_id,
            session_date=report.session_date,
            notes=report.notes,
            goals=report.goals,
            progress=report.progress,
            next_steps=report.next_steps,
            created_at=report.created_at,
            client_name=f"{client.first_name} {client.last_name}" if client else "Unknown",
            counsellor_name=counsellor.name if counsellor else "Unknown"
        ))
    
    return result


@router.put("/{report_id}", response_model=SessionReportResponse)
async def update_session_report(
    report_id: int,
    report_data: SessionReportUpdate,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a session report.
    Requires authentication.
    """
    report = db.query(SessionReport).filter(SessionReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session report not found"
        )
    
    update_data = report_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(report, field, value)
    
    db.commit()
    db.refresh(report)
    
    return SessionReportResponse.model_validate(report)


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session_report(
    report_id: int,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a session report permanently.
    Requires authentication.
    """
    report = db.query(SessionReport).filter(SessionReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session report not found"
        )
    
    db.delete(report)
    db.commit()

