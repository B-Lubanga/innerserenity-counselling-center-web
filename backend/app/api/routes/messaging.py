from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Optional
import uuid
from app.db.session import get_db
from app.schemas.chat import ChatRequest, ChatResponse, ChatMessage
from app.schemas.message import MessageCreate, MessageResponse
from app.models import Message, SenderType
from app.services.chat_context import get_system_prompt
from app.services.ollama_service import chat_completion, check_ollama_available
from app.core.config import settings

router = APIRouter()

# Simple in-memory conversation history cache (in production, use Redis)
_conversation_history: Dict[str, list[ChatMessage]] = {}


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Chat endpoint for the AI assistant.
    Accepts a message and returns an AI response with optional WhatsApp fallback.
    
    - **message**: User's message
    - **session_id**: Optional session ID for conversation continuity
    - **client_id**: Optional client ID for logged-in users
    """
    # Generate session ID if not provided
    session_id = request.session_id or str(uuid.uuid4())
    
    # Check if Ollama is available
    ollama_available = await check_ollama_available()
    
    if not ollama_available:
        # Fallback response if Ollama is not available
        return ChatResponse(
            response="I'm sorry, but our chat assistant is currently unavailable. Please contact us directly via WhatsApp for immediate assistance.",
            whatsapp_fallback=True,
            whatsapp_link=f"https://wa.me/{settings.WHATSAPP_NUMBER}" if settings.WHATSAPP_NUMBER else None,
            session_id=session_id
        )
    
    # Get conversation history
    history = _conversation_history.get(session_id, [])
    
    # Build messages for Ollama
    system_prompt = get_system_prompt(db)
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add conversation history
    for msg in history[-10:]:  # Keep last 10 messages for context
        messages.append({"role": msg.role, "content": msg.content})
    
    # Add current user message
    messages.append({"role": "user", "content": request.message})
    
    try:
        # Get AI response
        ai_response = await chat_completion(messages)
        
        # Store user message in database if client_id is provided
        if request.client_id:
            user_message = Message(
                client_id=request.client_id,
                sender_type=SenderType.CLIENT,
                content=request.message,
                session_id=session_id
            )
            db.add(user_message)
            
            # Store assistant response
            assistant_message = Message(
                client_id=request.client_id,
                sender_type=SenderType.BOT,
                content=ai_response,
                session_id=session_id
            )
            db.add(assistant_message)
            db.commit()
        
        # Update conversation history
        history.append(ChatMessage(role="user", content=request.message))
        history.append(ChatMessage(role="assistant", content=ai_response))
        _conversation_history[session_id] = history
        
        # Check if response indicates need for human escalation
        whatsapp_fallback = _should_escalate_to_human(request.message, ai_response)
        
        response = ChatResponse(
            response=ai_response,
            whatsapp_fallback=whatsapp_fallback,
            whatsapp_link=f"https://wa.me/{settings.WHATSAPP_NUMBER}" if whatsapp_fallback and settings.WHATSAPP_NUMBER else None,
            session_id=session_id
        )
        
        return response
        
    except Exception as e:
        print(f"Chat error: {e}")
        return ChatResponse(
            response="I apologize, but I encountered an error. Please try again or contact us via WhatsApp for assistance.",
            whatsapp_fallback=True,
            whatsapp_link=f"https://wa.me/{settings.WHATSAPP_NUMBER}" if settings.WHATSAPP_NUMBER else None,
            session_id=session_id
        )


def _should_escalate_to_human(user_message: str, ai_response: str) -> bool:
    """
    Determine if the conversation should be escalated to a human.
    
    Args:
        user_message: The user's message
        ai_response: The AI's response
    
    Returns:
        True if should escalate, False otherwise
    """
    # Keywords that indicate need for human escalation
    escalation_keywords = [
        "speak to a person",
        "talk to someone",
        "human",
        "real person",
        "speak with someone",
        "agent",
        "representative"
    ]
    
    # Check user message for escalation request
    user_lower = user_message.lower()
    for keyword in escalation_keywords:
        if keyword in user_lower:
            return True
    
    # Check if AI response indicates escalation
    ai_lower = ai_response.lower()
    escalation_indicators = [
        "i recommend speaking with",
        "please contact us directly",
        "i'd suggest reaching out",
        "let me connect you"
    ]
    
    for indicator in escalation_indicators:
        if indicator in ai_lower:
            return True
    
    return False


@router.post("/", response_model=MessageResponse)
async def create_message(message: MessageCreate, db: Session = Depends(get_db)):
    """Create a new message"""
    new_message = Message(**message.model_dump())
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return MessageResponse.model_validate(new_message)


@router.get("/{message_id}", response_model=MessageResponse)
async def get_message(message_id: int, db: Session = Depends(get_db)):
    """Get a specific message by ID"""
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return MessageResponse.model_validate(message)


@router.get("/conversation/{session_id}", response_model=list[MessageResponse])
async def get_conversation(session_id: str, db: Session = Depends(get_db)):
    """Get all messages in a conversation by session_id"""
    messages = db.query(Message).filter(Message.session_id == session_id).order_by(Message.timestamp).all()
    return [MessageResponse.model_validate(m) for m in messages]


@router.delete("/{message_id}")
async def delete_message(message_id: int, db: Session = Depends(get_db)):
    """Delete a message"""
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(message)
    db.commit()
    return {"message": "Message deleted successfully"}

