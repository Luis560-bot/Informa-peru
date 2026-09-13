# Limpio Perú

Aplicación web para registrar y gestionar reportes ambientales. Incluye tres perfiles con permisos independientes:

- **Ciudadano:** registra y consulta sus reportes.
- **Operador:** consulta todos los reportes y actualiza su estado.
- **Administrador:** gestiona reportes, usuarios y roles.

## Estructura

- `Backend/`: API FastAPI, autenticación JWT, SQLAlchemy y PostgreSQL.
- `Frontend/`: interfaz React con Vite.

## Backend

```bash
cd Backend
python -m venv venv
pip install -r requirements.txt
```

Crea `.env` a partir de `.env.example` y configura `DATABASE_URL`, `SECRET_KEY` y `CORS_ORIGINS`. Después inicia la API:

```bash
uvicorn App.main:app --reload
```

## Frontend

```bash
cd Frontend
npm install
npm run dev
```

Para producción, define `VITE_API_URL` con la URL pública del backend.

## Verificación

```bash
cd Backend && python -m unittest tests.test_roles -v
cd Frontend && npm run lint && npm run build
```
