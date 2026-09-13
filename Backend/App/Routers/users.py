import uuid
from typing import Literal
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from App.database.database import get_db
from App.Models.role import Role
from App.Models.users import User
from App.Routers.auth import current_user, serialize_user

router = APIRouter(prefix="/api/users", tags=["Users"])


class RoleInput(BaseModel):
    role: Literal["Ciudadano", "Operador", "Administrador"]


async def require_admin(user, db):
    role = await db.get(Role, user.role_id)
    if role.name != "Administrador":
        raise HTTPException(
            403, "Solo el administrador puede gestionar usuarios")


@router.get("")
async def list_users(user=Depends(current_user), db=Depends(get_db)):
    await require_admin(user, db)
    users = (await db.scalars(select(User).order_by(User.name))).all()
    return [await serialize_user(item, db) for item in users]


@router.patch("/{user_id}/role")
async def change_role(user_id: uuid.UUID, data: RoleInput, user=Depends(current_user), db=Depends(get_db)):
    await require_admin(user, db)
    target = await db.get(User, user_id)
    if not target:
        raise HTTPException(404, "Usuario no encontrado")
    role = await db.scalar(select(Role).where(Role.name == data.role))
    target.role_id = role.id
    await db.commit()
    return await serialize_user(target, db)
