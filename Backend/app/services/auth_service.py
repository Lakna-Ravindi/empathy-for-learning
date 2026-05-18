# app/services/auth_service.py
from app.db.database import users_collection
from app.core.security import hash_password, verify_password, create_token

def register_user(user_data: dict):
    existing = users_collection.find_one({"email": user_data["email"]})
    if existing:
        return None, "User already exists"

    user_data["password"] = hash_password(user_data["password"])
    user_data["role"] = "student"

    users_collection.insert_one(user_data)
    return True, "Student registered successfully"


def login_user(email: str, password: str):
    db_user = users_collection.find_one({"email": email})

    if not db_user:
        return None, "Invalid credentials"

    if not verify_password(password, db_user["password"]):
        return None, "Invalid credentials"

    token = create_token({
        "email": db_user["email"],
        "role": db_user["role"]
    })

    return token, db_user