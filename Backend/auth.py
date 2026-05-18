from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

def hash_password(password: str):
    logger.info(f"[HASH] Input password type: {type(password)}")
    logger.info(f"[HASH] Input password: {password}")
    logger.info(f"[HASH] Input length (chars): {len(password)}")
    
    password_str = str(password)
    logger.info(f"[HASH] After str() conversion: {password_str}")
    logger.info(f"[HASH] After str() length (chars): {len(password_str)}")
    logger.info(f"[HASH] After str() length (bytes): {len(password_str.encode('utf-8'))}")
    
    try:
        result = pwd_context.hash(password_str)
        logger.info(f"[HASH] Successfully hashed")
        return result
    except Exception as e:
        logger.error(f"[HASH] Error during hashing: {e}")
        raise

def verify_password(plain, hashed):
    logger.info(f"[VERIFY] Input password type: {type(plain)}")
    logger.info(f"[VERIFY] Input length: {len(str(plain))}")
    return pwd_context.verify(str(plain), hashed)

def create_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)