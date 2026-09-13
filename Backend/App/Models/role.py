# Importamos uuid para generar identificadores únicos y las clases necesarias de SQLAlchemy para definir el modelo de datos.
import uuid

# Importamos String de SQLAlchemy para definir el tipo de datos de las columnas de texto.

from sqlalchemy import String, Uuid

# Importamos sqlalchemy.dialects.postgresql para utilizar el tipo de datos UUID específico de PostgreSQL, que nos permite almacenar identificadores únicos en la base de datos.


# Importamos Mapped y mapped_column de sqlalchemy.orm para definir las columnas del modelo de datos y mapearlas a la base de datos.

from sqlalchemy.orm import Mapped, mapped_column

# Importamos Base desde App.database.database, que es la clase base para todos los modelos de datos en nuestra aplicación. Esto nos permite definir nuestras tablas en la base de datos utilizando SQLAlchemy.

from App.database.database import Base

# Definimos la clase Role que hereda de Base, lo que significa que esta clase representa una tabla en la base de datos. La tabla se llamará "roles".


class Role(Base):
    __tablename__ = "roles"

    # Definimos la columna 'id' como un UUID único que se genera automáticamente al crear un nuevo registro.
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4)

    # Definimos la columna 'name' como un campo de texto de hasta 50 caracteres, único y no nulo.
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
