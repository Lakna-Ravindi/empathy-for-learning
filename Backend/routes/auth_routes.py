from fastapi import APIRouter, HTTPException
from models import RegisterModel, LoginModel
from database import users_collection
from auth import hash_password, verify_password, create_token

router = APIRouter()



@router.post("/register")
def register(user: RegisterModel):
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        password = user.password
        
        logger.info(f"[REGISTER] Received password type: {type(password)}")
        logger.info(f"[REGISTER] Received password value: {password}")
        logger.info(f"[REGISTER] Password length (chars): {len(password)}")
        logger.info(f"[REGISTER] Password length (bytes UTF-8): {len(password.encode('utf-8'))}")
        logger.info(f"[REGISTER] Password repr: {repr(password)}")

        if len(password) > 72:
            logger.warning(f"[REGISTER] Password exceeds 72 characters")
            return {"error": "Password too long (max 72 characters)"}

        logger.info(f"[REGISTER] Attempting to hash password")
        user_dict = user.model_dump()
        user_dict["password"] = hash_password(password)
        logger.info(f"[REGISTER] Password hashed successfully")

        users_collection.insert_one(user_dict)
        logger.info(f"[REGISTER] User inserted successfully")

        return {"message": "User registered successfully"}

    except Exception as e:
        logger.error(f"[REGISTER] Exception occurred: {e}", exc_info=True)
        return {"error": str(e)}
    
@router.post("/login")
def login(user: LoginModel):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_token({"email": user.email})

    return {"access_token": token, "token_type": "bearer"}