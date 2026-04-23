from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Empathy for Learning API",
    description="UNESCO SEEK-based emotional support system",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint - API documentation."""
    return {
        "message": "Empathy for Learning API Gateway",
        "version": "0.1.0",
        "docs_url": "/docs",
        "health_check_url": "/health",
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "service": "api-gateway",
        "version": "0.1.0",
        "environment": os.getenv("ENVIRONMENT", "development"),
    }

@app.get("/api/v1/ping")
async def ping():
    """Simple ping endpoint for connectivity testing."""
    return {"message": "pong"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
