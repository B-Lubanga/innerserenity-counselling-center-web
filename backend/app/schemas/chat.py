from pydantic import BaseModel, Field
from typing import Optional, List


class ChatRequest(BaseModel):
    """Request schema for chat endpoint."""
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None
    client_id: Optional[int] = None


class ChatMessage(BaseModel):
    """Schema for a chat message in history."""
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str


class ChatResponse(BaseModel):
    """Response schema for chat endpoint."""
    response: str
    action: Optional[str] = None
    whatsapp_fallback: bool = False
    whatsapp_link: Optional[str] = None
    session_id: str


class ChatHistoryResponse(BaseModel):
    """Response schema for chat history."""
    messages: List[ChatMessage]
    session_id: str
