# app/routes/auth_routes.py
from fastapi import APIRouter, HTTPException
from app.models.user_models import UserRegister
from app.models.auth_models import UserLogin
from app.services.auth_service import register_user, login_user

router = APIRouter()

@router.post("/register")
def register(user: UserRegister):
    success, message = register_user(user.dict())

    if not success:
        raise HTTPException(status_code=400, detail=message)

    return {"message": message}


@router.post("/login")
def login(user: UserLogin):
    token, db_user = login_user(user.email, user.password)

    if not token:
        raise HTTPException(status_code=400, detail=db_user)

    return {
        "access_token": token,
        "token_type": "bearer",
        "fullName": db_user["fullName"],
        "role": db_user["role"]
    }