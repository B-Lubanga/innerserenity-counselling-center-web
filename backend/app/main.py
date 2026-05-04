from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import bookings, clients, invoices, sessions, quotes, messaging, admin, availability, auth

app = FastAPI(
    title="Inner Serenity Counselling Center API",
    description="Backend API for counselling center management",
    version="1.0.0"
)

# CORS middleware - allow localhost:3000 and production domain
allowed_origins = ["http://localhost:3000"]
if settings.PRODUCTION_DOMAIN:
    allowed_origins.append(settings.PRODUCTION_DOMAIN)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])
app.include_router(clients.router, prefix="/api/clients", tags=["clients"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["invoices"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["sessions"])
app.include_router(quotes.router, prefix="/api/quotes", tags=["quotes"])
app.include_router(messaging.router, prefix="/api/messaging", tags=["messaging"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(availability.router, prefix="/api/availability", tags=["availability"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Inner Serenity Counselling Center API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT
    }

