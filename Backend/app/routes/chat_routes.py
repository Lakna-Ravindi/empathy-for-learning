from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag_service import get_seek_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    emotion: str = "General"

@router.post("/chat")
def chat(req: ChatRequest):
    print("REQUEST RECEIVED")  # DEBUG 1

    result = get_seek_response(
        req.message,
        req.emotion
    )

    print("RESPONSE READY")     # DEBUG 2

    return result