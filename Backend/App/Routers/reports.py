import uuid
from typing import Literal
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from App.database.database import get_db
from App.Models.report import Report
from App.Models.role import Role
from App.Routers.auth import current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])


class ReportInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    title: str = Field(min_length=5, max_length=120)
    description: str = Field(min_length=10, max_length=2000)
    district: str = Field(min_length=2, max_length=100)
    address: str = Field(min_length=5, max_length=200)
    category: Literal["Residuos", "Reciclaje", "Desmonte", "Areas verdes"]


class StatusInput(BaseModel):
    status: Literal["Pendiente", "En proceso", "Resuelto"]


async def role_name(user, db):
    return (await db.get(Role, user.role_id)).name


@router.get("")
async def list_reports(user=Depends(current_user), db=Depends(get_db)):
    query = select(Report).order_by(Report.created_at.desc())
    if await role_name(user, db) == "Ciudadano":
        query = query.where(Report.user_id == user.id)
    return (await db.scalars(query)).all()


@router.post("", status_code=201)
async def create_report(data: ReportInput, user=Depends(current_user), db=Depends(get_db)):
    if await role_name(user, db) != "Ciudadano":
        raise HTTPException(403, "Solo los ciudadanos crean reportes")
    report = Report(**data.model_dump(), user_id=user.id)
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report


@router.patch("/{report_id}")
async def update_report(report_id: uuid.UUID, data: StatusInput, user=Depends(current_user), db=Depends(get_db)):
    if await role_name(user, db) not in {"Operador", "Administrador"}:
        raise HTTPException(403, "No tienes permiso para cambiar estados")
    report = await db.get(Report, report_id)
    if not report:
        raise HTTPException(404, "Reporte no encontrado")
    report.status = data.status
    await db.commit()
    return report
