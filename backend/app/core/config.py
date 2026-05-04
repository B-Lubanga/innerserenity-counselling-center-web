from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/innerserenity"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    PRODUCTION_DOMAIN: Optional[str] = None
    
    # Notifications
    WHATSAPP_NUMBER: Optional[str] = None
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # API
    API_V1_PREFIX: str = "/api"
    
    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    
    # Legacy Email Configuration (for auth.py)
    SMTP_SERVER: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    FROM_EMAIL: Optional[str] = None
    
    # Email Configuration (FastAPI Mail)
    MAIL_USERNAME: Optional[str] = None
    MAIL_PASSWORD: Optional[str] = None
    MAIL_FROM: str = "noreply@innerserenity.co.ke"
    MAIL_FROM_NAME: str = "Inner Serenity Counselling Centre"
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_PORT: int = 587
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    
    # Logo Configuration
    LOGO_PATH: Optional[str] = None
    LOGO_URL: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

