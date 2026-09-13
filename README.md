# Limpio Perú

Aplicación web para registrar y gestionar reportes ambientales con perfiles de Ciudadano, Operador y Administrador.

## Estructura

- `Backend/`: API FastAPI, autenticación JWT, SQLAlchemy y PostgreSQL.
- `Frontend/`: interfaz React con Vite.

## Backend

```bash
cd Backend
python -m venv venv
pip install -r requirements.txt
```

Configura `DATABASE_URL`, `SECRET_KEY` y `CORS_ORIGINS` como variables de entorno. Para desarrollo local puedes definirlas en un archivo `.env` no versionado.

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

## Despliegue en Render

### Backend: Web Service

```text
Root Directory: Backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn App.main:app --host 0.0.0.0 --port $PORT
Health Check Path: /
```

Variables de entorno del backend:

```env
DATABASE_URL=postgresql+asyncpg://usuario:contrasena@host/base
SECRET_KEY=clave-aleatoria-privada
CORS_ORIGINS=https://limpio-peru.onrender.com
```

Para `DATABASE_URL`, copia la **Internal Database URL** de PostgreSQL y cambia únicamente `postgresql://` por `postgresql+asyncpg://`.

### Frontend: Static Site

```text
Root Directory: Frontend
Build Command: npm ci && npm run build
Publish Directory: dist
```

Variable de entorno del frontend:

```env
VITE_API_URL=https://limpio-peru-api.onrender.com
```

Las URLs de `CORS_ORIGINS` y `VITE_API_URL` deben escribirse sin comillas y sin `/` al final. Después de cambiar una variable, ejecuta un nuevo despliegue en Render.

## Verificación

```bash
cd Backend && python -m unittest tests.test_roles -v
cd Frontend && npm run lint && npm run build
```
