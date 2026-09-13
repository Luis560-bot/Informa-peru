import uuid
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from App.Core.security import ALGORITHM, SECRET_KEY, create_access_token, hash_password, verify_password
from App.database.database import get_db
from App.Models.role import Role
from App.Models.users import User
from App.Schema.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
bearer = HTTPBearer(auto_error=False)


async def current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer), db=Depends(get_db)):
    try:
        if credentials is None:
            raise ValueError
        payload = jwt.decode(credentials.credentials,
                             SECRET_KEY, algorithms=[ALGORITHM])
        user = await db.get(User, uuid.UUID(payload["sub"]))
        if not user or not user.is_active:
            raise ValueError
        return user
    except (JWTError, ValueError, KeyError):
        raise HTTPException(401, "Inicia sesion para continuar")


async def serialize_user(user, db):
    role = await db.get(Role, user.role_id)
    return UserResponse(id=str(user.id), name=user.name, email=user.email, role=role.name)


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(data: RegisterRequest, db=Depends(get_db)):
    role = await db.scalar(select(Role).where(Role.name == "Ciudadano"))
    user = User(name=data.name.strip(), email=data.email,
                password_hash=hash_password(data.password), role_id=role.id)
    db.add(user)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(409, "Este correo ya esta registrado")
    return await serialize_user(user, db)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db=Depends(get_db)):
    user = await db.scalar(select(User).where(User.email == data.email))
    if not user or not user.is_active or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Correo o contrasena incorrectos")
    role = await db.get(Role, user.role_id)
    return TokenResponse(access_token=create_access_token(str(user.id), role.name))


@router.get("/me", response_model=UserResponse)
async def me(user=Depends(current_user), db=Depends(get_db)):
    return await serialize_user(user, db)
