"""
Ollama service for local LLM inference.
Connects to Ollama running locally for chat completions.
"""

import httpx
from typing import List, Dict, Any, Optional
from app.core.config import settings


OLLAMA_BASE_URL = getattr(settings, "OLLAMA_BASE_URL", "http://ollama:11434")
OLLAMA_MODEL = getattr(settings, "OLLAMA_MODEL", "phi3")


async def get_available_models() -> List[str]:
    """
    Get available Ollama models.
    
    Returns:
        List of model names
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if response.status_code == 200:
                data = response.json()
                return [m["name"] for m in data.get("models", [])]
    except Exception as e:
        print(f"Error fetching Ollama models: {e}")
    
    return [OLLAMA_MODEL]


async def chat_completion(
    messages: List[Dict[str, str]],
    model: Optional[str] = None,
    temperature: float = 0.7
) -> str:
    """
    Get a chat completion from Ollama.
    
    Args:
        messages: List of message dicts with 'role' and 'content'
        model: Model to use (defaults to OLLAMA_MODEL)
        temperature: Temperature for generation
    
    Returns:
        Generated response text
    """
    if model is None:
        model = OLLAMA_MODEL
    
    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
        "temperature": temperature
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json=payload
            )
            
            if response.status_code != 200:
                raise Exception(f"Ollama API error: {response.status_code}")
            
            data = response.json()
            return data.get("message", {}).get("content", "")
            
    except Exception as e:
        print(f"Ollama chat error: {e}")
        raise


async def check_ollama_available() -> bool:
    """
    Check if Ollama service is available.
    
    Returns:
        True if Ollama is responding, False otherwise
    """
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            return response.status_code == 200
    except Exception:
        return False
