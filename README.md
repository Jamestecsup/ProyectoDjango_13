# Laboratorio 13 — Catálogo de comercio electrónico (Django + React)

Implementación del laboratorio: API de catálogo en Django REST Framework y cliente React que consume la API exclusivamente a través de una capa de servicios.

## Estructura

```
backend/                 API (Django + DRF)
├── config/              settings, urls, asgi, wsgi
├── catalog/             models, admin, serializers, views, urls, tests
│   └── management/commands/seed_catalog.py
└── requirements.txt
frontend/                Cliente (React + Vite)
├── src/services/        apiClient, productService, categoryService
├── src/components/      ProductCard, CategoryFilter, ProductForm
└── src/pages/           CatalogPage, ProductFormPage
```

## Requisitos

Python 3.12+, Node.js 20+ y Git.

## Arranque

**Backend** (desde `backend/`):

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
copy .env.example .env
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py seed_catalog
.\.venv\Scripts\python.exe manage.py runserver
```

Edita `DJANGO_SECRET_KEY` en `.env` antes de usar el servidor fuera de local. `seed_catalog` crea 3 categorías y 9 productos con imagen. El administrador está en `http://localhost:8000/admin/` (crea un superusuario con `createsuperuser`).

**Frontend** (desde `frontend/`):

```powershell
npm install
copy .env.example .env
npm run dev
```

Abre `http://localhost:5173`. La URL base de la API se define solo en `frontend/src/services/apiClient.js` (variable de entorno `VITE_API_BASE_URL`).

## API

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/categories/` | Lista de categorías |
| POST | `/api/categories/` | Alta de categoría |
| GET/PATCH/DELETE | `/api/categories/<id>/` | Detalle, edición y borrado |
| GET | `/api/products/` | Lista de productos con categoría anidada |
| GET | `/api/products/?category=<id>` | Lista filtrada por categoría |
| POST | `/api/products/` | Alta de producto (JSON o `multipart/form-data`) |
| GET/PATCH/DELETE | `/api/products/<id>/` | Detalle, edición y borrado |

Respuesta de ejemplo (una sola petición para pintar la tarjeta):

```json
{
  "id": 1,
  "name": "Espresso Coffee",
  "price": "12.50",
  "stock": 40,
  "image": "/media/products/espresso-coffee.png",
  "image_url": "http://localhost:8000/media/products/espresso-coffee.png",
  "category": {
    "id": 1,
    "name": "Beverages",
    "description": "Coffee, tea and juices"
  }
}
```

Para escribir se envía `category_id` (numérico) y, si se quiere imagen, el campo `image` en `multipart/form-data`. El serializador anida `category` solo en lectura, por lo que el listado trae nombre y descripción de la categoría sin exigir una segunda petición.

## Observaciones de arquitectura

- **Servidor**: una aplicación por responsabilidad (`catalog`), modelos en singular, migraciones versionadas y secretos leídos del entorno (`.env` no se versiona).
- **Cliente**: ningún componente importa Axios; todos usan `productService` o `categoryService`, y estos usan el `apiClient` con la URL base centralizada.
- **Catálogo**: carga por servicio dentro de `useEffect`, con estados de carga, error y datos (incluido el estado vacío). El filtro se alimenta de las categorías devueltas por la API.
- **CRUD**: alta, edición y borrado reutilizan los mismos servicios; tras guardar o borrar se recarga el listado sin recargar la página.

## Verificación

```powershell
# backend
.\.venv\Scripts\python.exe manage.py test catalog

# frontend
npm run build
```
