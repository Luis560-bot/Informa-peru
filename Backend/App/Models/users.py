# Importamos el módulo uuid para generar identificadores únicos universales (UUID) para nuestras entidades en la base de datos.

import uuid

# Importamos String, Boolean y ForeignKey de SQLAlchemy para definir los tipos de datos de las columnas en nuestras tablas de la base de datos.

from sqlalchemy import String, Boolean, ForeignKey, Uuid

# Importamos sqlalchemy.dialects.postgresql para utilizar el tipo de datos UUID específico de PostgreSQL, que nos permite almacenar identificadores únicos en la base de datos.


# Importamos Mapped y mapped_column de sqlalchemy.orm para definir las columnas del modelo de datos y mapearlas a la base de datos.

from sqlalchemy.orm import Mapped, mapped_column

# Importamos Base desde App.database.database, que es la clase base para todos los modelos de datos en nuestra aplicación. Esto nos permite definir nuestras tablas en la base de datos utilizando SQLAlchemy.

from App.database.database import Base

# Definimos la clase User, que representa la tabla "users" en la base de datos. Esta clase hereda de Base, lo que nos permite mapearla a la base de datos utilizando SQLAlchemy.


class User(Base):
    # Definimos el nombre de la tabla en la base de datos como "users". Esto nos permite referirnos a esta tabla en consultas y operaciones de la base de datos.
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4)

    name: Mapped[str] = mapped_column(String(100), nullable=False)

    email: Mapped[str] = mapped_column(
        String(150), unique=True, nullable=False)

    password_hash: Mapped[str] = mapped_column(nullable=False)

    role_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("roles.id"), nullable=False)

    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False)
