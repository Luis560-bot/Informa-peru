import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from jose import jwt
from passlib.context import CryptContext

load_dotenv()
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv(
    "SECRET_KEY", "dev-only-change-this-secret-in-production")
ALGORITHM = "HS256"


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)


def create_access_token(user_id: str, role: str):
    expires = datetime.now(timezone.utc) + timedelta(hours=8)
    return jwt.encode({"sub": user_id, "role": role, "exp": expires}, SECRET_KEY, algorithm=ALGORITHM)
