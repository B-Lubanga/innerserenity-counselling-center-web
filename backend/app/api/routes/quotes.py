from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.quote import QuoteCreate, QuoteUpdate, QuoteResponse, QuoteWithDetails
from app.models import Quote, QuoteStatus, Client, ServiceType
from app.core.security import get_current_user
from app.models import Staff as StaffModel
from app.services.invoice_service import calculate_invoice_amount

router = APIRouter()


@router.post("/", response_model=QuoteResponse, status_code=status.HTTP_201_CREATED)
async def create_quote(
    quote_data: QuoteCreate,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit a quote request with estimated price based on service type.
    Requires authentication.
    """
    # Verify service type exists
    service_type = db.query(ServiceType).filter(ServiceType.id == quote_data.service_type_id).first()
    if not service_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service type not found"
        )
    
    # Verify client exists if provided
    if quote_data.client_id:
        client = db.query(Client).filter(Client.id == quote_data.client_id).first()
        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found"
            )
    
    # Calculate estimated price if not provided
    if not quote_data.estimated_price or quote_data.estimated_price == 0:
        estimated_price = service_type.base_price
    else:
        estimated_price = quote_data.estimated_price
    
    new_quote = Quote(
        client_id=quote_data.client_id,
        service_type_id=quote_data.service_type_id,
        details=quote_data.details,
        estimated_price=estimated_price,
        status=QuoteStatus.DRAFT
    )
    db.add(new_quote)
    db.commit()
    db.refresh(new_quote)
    
    return QuoteResponse.model_validate(new_quote)


@router.get("/{quote_id}", response_model=QuoteWithDetails)
async def get_quote(
    quote_id: int,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific quote by ID with related details.
    Requires authentication.
    """
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found"
        )
    
    client = db.query(Client).filter(Client.id == quote.client_id).first() if quote.client_id else None
    service_type = db.query(ServiceType).filter(ServiceType.id == quote.service_type_id).first()
    
    return QuoteWithDetails(
        id=quote.id,
        client_id=quote.client_id,
        service_type_id=quote.service_type_id,
        details=quote.details,
        estimated_price=quote.estimated_price,
        status=quote.status,
        created_at=quote.created_at,
        client_name=f"{client.first_name} {client.last_name}" if client else None,
        service_type_name=service_type.name if service_type else "Unknown"
    )


@router.get("/", response_model=list[QuoteWithDetails])
async def list_quotes(
    client_id: int = Query(None),
    status_filter: QuoteStatus = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List quotes with optional filters by client and status.
    Requires authentication.
    
    - **client_id**: Filter by specific client
    - **status_filter**: Filter by quote status
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    """
    query = db.query(Quote)
    
    if client_id:
        query = query.filter(Quote.client_id == client_id)
    
    if status_filter:
        query = query.filter(Quote.status == status_filter)
    
    quotes = query.order_by(Quote.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for quote in quotes:
        client = db.query(Client).filter(Client.id == quote.client_id).first() if quote.client_id else None
        service_type = db.query(ServiceType).filter(ServiceType.id == quote.service_type_id).first()
        
        result.append(QuoteWithDetails(
            id=quote.id,
            client_id=quote.client_id,
            service_type_id=quote.service_type_id,
            details=quote.details,
            estimated_price=quote.estimated_price,
            status=quote.status,
            created_at=quote.created_at,
            client_name=f"{client.first_name} {client.last_name}" if client else None,
            service_type_name=service_type.name if service_type else "Unknown"
        ))
    
    return result


@router.put("/{quote_id}", response_model=QuoteResponse)
async def update_quote(
    quote_id: int,
    quote_data: QuoteUpdate,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a quote (price, status, or details).
    Requires authentication.
    """
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found"
        )
    
    update_data = quote_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(quote, field, value)
    
    db.commit()
    db.refresh(quote)
    
    return QuoteResponse.model_validate(quote)


@router.delete("/{quote_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_quote(
    quote_id: int,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a quote permanently.
    Requires authentication.
    """
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found"
        )
    
    db.delete(quote)
    db.commit()

