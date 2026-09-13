import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, update
from App.Core.security import hash_password
from App.database.database import AsyncSessionLocal, Base, engine
from App.Models.role import Role
from App.Models.users import User
from App.Models.report import Report  # noqa: F401
from App.Routers.auth import router as auth_router
from App.Routers.reports import router as reports_router
from App.Routers.users import router as users_router

DEMO_USERS = [
    ("Ciudadana Demo", "ciudadano@limpioperu.pe", "Ciudadano"),
    ("Operador Municipal", "operador@limpioperu.pe", "Operador"),
    ("Administradora", "admin@limpioperu.pe", "Administrador"),
]


@asynccontextmanager
async def lifespan(app):
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as db:
        legacy_role = await db.scalar(select(Role).where(Role.name == "Citizen"))
        citizen_role = await db.scalar(select(Role).where(Role.name == "Ciudadano"))
        if legacy_role and citizen_role:
            await db.execute(update(User).where(User.role_id == legacy_role.id).values(role_id=citizen_role.id))
        elif legacy_role:
            legacy_role.name = "Ciudadano"
        roles = {}
        for name in ("Ciudadano", "Operador", "Administrador"):
            role = await db.scalar(select(Role).where(Role.name == name))
            if not role:
                role = Role(name=name)
                db.add(role)
                await db.flush()
            roles[name] = role
        for name, email, role_name in DEMO_USERS:
            if not await db.scalar(select(User).where(User.email == email)):
                db.add(User(name=name, email=email, password_hash=hash_password(
                    "Eco2026!"), role_id=roles[role_name].id))
        await db.commit()
    yield
    await engine.dispose()

app = FastAPI(title="Limpio Perú", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware,
                   allow_origins=os.getenv(
                       "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(","),
                   allow_methods=["GET", "POST", "PATCH"], allow_headers=["Authorization", "Content-Type"])
app.include_router(auth_router)
app.include_router(reports_router)
app.include_router(users_router)


@app.get("/")
async def root():
    return {"status": "ok", "name": "Limpio Perú", "roles": 3}
