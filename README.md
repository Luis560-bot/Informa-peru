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

## Verificación

```bash
cd Backend && python -m unittest tests.test_roles -v
cd Frontend && npm run lint && npm run build
```
