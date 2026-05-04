import os
import base64
from typing import Optional
from app.core.config import settings

def get_logo_base64() -> str:
    """
    Get the company logo as a base64 encoded string for email embedding.
    Falls back to a text-based SVG logo if no image file is found.
    
    Returns:
        str: Base64 encoded image data (data:image/svg+xml;base64,XXXXX)
    """
    # Try to load logo file from configured path
    logo_path = getattr(settings, 'LOGO_PATH', None)
    
    if logo_path and os.path.exists(logo_path):
        try:
            with open(logo_path, 'rb') as f:
                # Determine file type
                file_ext = os.path.splitext(logo_path)[1].lower()
                if file_ext == '.png':
                    mime_type = 'image/png'
                elif file_ext in ['.jpg', '.jpeg']:
                    mime_type = 'image/jpeg'
                elif file_ext == '.svg':
                    mime_type = 'image/svg+xml'
                else:
                    mime_type = 'image/png'  # Default to PNG
                
                # Read and encode file
                image_data = f.read()
                base64_data = base64.b64encode(image_data).decode('utf-8')
                return f"data:{mime_type};base64,{base64_data}"
        except Exception as e:
            print(f"Error loading logo file: {e}")
    
    # Fallback to SVG text logo
    return get_text_logo_base64()

def get_text_logo_base64() -> str:
    """
    Generate a text-based SVG logo as base64 string.
    
    Returns:
        str: Base64 encoded SVG logo
    """
    svg_logo = """
    <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="60" fill="#424530"/>
        <text x="100" y="35" font-family="Playfair Display, Georgia, serif" font-size="24" fill="#FFFFFF" text-anchor="middle" font-weight="bold">Inner Serenity</text>
        <text x="100" y="45" font-family="Arial, sans-serif" font-size="10" fill="#FFFFFF" text-anchor="middle" opacity="0.9">Counselling Centre</text>
    </svg>
    """
    
    # Remove extra whitespace and newlines
    svg_logo = ''.join(svg_logo.split())
    
    # Encode to base64
    base64_data = base64.b64encode(svg_logo.encode('utf-8')).decode('utf-8')
    return f"data:image/svg+xml;base64,{base64_data}"

def get_logo_url() -> Optional[str]:
    """
    Get the public URL for the company logo.
    
    Returns:
        Optional[str]: Public URL if configured, None otherwise
    """
    # Try to get logo URL from environment or settings
    logo_url = getattr(settings, 'LOGO_URL', None)
    
    if logo_url:
        return logo_url
    
    # Default placeholder URL (can be replaced with actual logo URL)
    return "https://innerserenity.co.ke/logo.png"

def get_email_logo_data() -> dict:
    """
    Get logo data for email templates.
    
    Returns:
        dict: Contains both base64 and URL versions of the logo
    """
    return {
        'logo_base64': get_logo_base64(),
        'logo_url': get_logo_url()
    }
