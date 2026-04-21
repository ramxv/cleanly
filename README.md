# Cleanly

Plataforma para gestionar reservas de servicios de limpieza.

## Stack

- **Frontend:** Vue 3 + Vite + TypeScript, servido en producción con nginx.
- **Backend:** Hono sobre Node.js 22, TypeScript, Prisma 7 (driver adapter `@prisma/adapter-pg`).
- **Base de datos:** PostgreSQL 17.
- **Orquestación:** Docker Compose.

## Estructura

```
cleanly/
├── .env                    variables para docker-compose
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── prisma/
│   │   └── schema.prisma
│   ├── prisma.config.ts
│   └── src/
│       ├── index.ts        entry point Hono
│       ├── lib/
│       │   └── prisma.ts   singleton del cliente Prisma
│       ├── routes/         auth, workers, bookings, payments
│       └── middlewares/    auth (JWT), rbac
└── frontend/
    ├── Dockerfile
    ├── nginx.conf          sirve SPA y proxea /api/ al backend
    └── src/                app Vue
```

## Requisitos

- Docker + Docker Compose

## Variables de entorno

Todas viven en el `.env` de la raíz (lo lee Compose):

| Variable            | Ejemplo                                              |
| ------------------- | ---------------------------------------------------- |
| `POSTGRES_USER`     | `user`                                               |
| `POSTGRES_PASSWORD` | `password`                                           |
| `POSTGRES_DB`       | `cleanly_db`                                         |
| `POSTGRES_PORT`     | `5439` (puerto expuesto al host)                     |
| `DATABASE_URL`      | `postgresql://user:password@db:5432/cleanly_db`      |
| `JWT_SECRET`        | cadena larga y aleatoria                             |
| `FRONTEND_URL`      | `http://localhost`                                   |
| `NODE_ENV`          | `production`                                         |
| `BACKEND_PORT`      | `3000`                                               |
| `FRONTEND_PORT`     | `80`                                                 |

## Inicialización (primera vez)

### 1. Clonar el repo

```bash
git clone <url-del-repo> cleanly
cd cleanly
```

### 2. Crear el `.env` de la raíz

```env
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=cleanly_db
POSTGRES_PORT=5439

DATABASE_URL=postgresql://user:password@db:5432/cleanly_db
JWT_SECRET=cambia-esto-por-algo-largo-y-aleatorio
FRONTEND_URL=http://localhost
NODE_ENV=production
BACKEND_PORT=3000

FRONTEND_PORT=80
```

### 3. Levantar el stack

```bash
docker compose up -d --build
```

Compose construye las imágenes de `backend` y `frontend`, arranca Postgres y
espera a que esté sano antes de iniciar el backend.

## Ejecución

```bash
docker compose up -d --build   # arranca todo (rebuild si cambió algo)
docker compose up -d           # arranca sin rebuild
docker compose down            # para todo (conserva datos)
docker compose down -v         # para todo y borra el volumen de la DB
```

Servicios expuestos:

- Frontend → http://localhost
- Backend → http://localhost:3000
- Postgres → `localhost:5439`

### Comandos útiles

```bash
docker compose ps                                   # estado de los servicios
docker compose logs -f                              # logs de todos
docker compose logs -f backend                      # logs de uno
docker compose up -d --build backend                # rebuild de un servicio
docker compose exec backend sh                      # shell en el backend
docker compose exec db psql -U user -d cleanly_db   # shell de Postgres
```

## Migraciones de Prisma

Las migraciones se ejecutan dentro del contenedor del backend:

```bash
# crear una nueva migración (desarrollo)
docker compose exec backend pnpm prisma migrate dev --name <nombre>

# aplicar migraciones pendientes (producción)
docker compose exec backend pnpm prisma migrate deploy

# regenerar el cliente
docker compose exec backend pnpm prisma generate
```

## Notas

- El `Dockerfile` del backend no ejecuta `prisma migrate deploy` al arrancar;
  en producción conviene añadirlo a un entrypoint antes de `node dist/index.js`.
- nginx del frontend usa el resolver DNS interno de Docker (`127.0.0.11`) para
  no crashear si `backend` aún no está arriba cuando arranca.
