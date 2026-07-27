# LinkTrim

![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

A full-stack URL shortener with a React frontend and a Laravel 13 REST API backend. Paste a long URL, get a short link instantly, and copy it to your clipboard. The app remembers your last 5 shortened links via a browser cookie and features an animated bubble background with customizable color and count. Trilingual — English, Spanish, and Chinese, auto-detected from the browser.

---

## Features

- Shorten any URL to a compact 6-character alphanumeric code
- Deduplication — submitting the same URL always returns the same short link
- Resolves LinkTrim short URLs passed as input, returning the existing record
- Last 5 links persisted in a browser cookie
- Animated bubble background with customizable color and count (persisted in `localStorage`)
- Trilingual UI (English / Spanish / Chinese), auto-detected from browser language
- Race condition on concurrent inserts handled gracefully
- Free-tier hosting notice displayed in the UI (backend may spin down on inactivity)
- Scheduled cleanup of URLs unused for over a year (token-protected endpoint)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Browser                         │
│                                                     │
│   React 19 + Vite 8 + Tailwind CSS 4               │
│   ├── Bubble background (localStorage settings)    │
│   ├── Shorten form + copy button                   │
│   └── Last 5 links (cookie)                        │
└───────────────────┬─────────────────────────────────┘
                    │ HTTPS (VITE_API_URL)
┌───────────────────▼─────────────────────────────────┐
│              Laravel 13 REST API                    │
│              PHP 8.3 · Laravel Sanctum              │
│                                                     │
│   POST /api/shorten                                 │
│   GET  /{short_code}  →  302 redirect               │
│   GET  /api/ping                                    │
│   GET  /api/scheduler/run?token=                    │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│                   MySQL                             │
│              short_urls table                       │
└─────────────────────────────────────────────────────┘
```

---

## Monorepo Structure

```
linktrim/               ← monorepo root
├── linktrim/           ← Laravel backend
├── linktrimfront/      ← React frontend
├── render.yaml         ← Render deployment config
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/shorten` | Receives `{ url }`, returns `{ original_url, short_code, short_url }` |
| `GET` | `/{short_code}` | Redirects (302) to the original URL |
| `GET` | `/api/ping` | Health check — returns `{ status, db }` |
| `GET` | `/api/scheduler/run?token=` | Cleans up URLs unused for over a year (token-protected) |

---

## Database

### `short_urls`

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint | Primary key |
| `original_url` | text | Unique index on first 191 chars |
| `short_code` | varchar(8) | Random alphanumeric, unique |
| `last_used_at` | timestamp | Nullable, updated on each redirect |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### `sessions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | varchar(255) | Primary key, session identifier |
| `user_id` | bigint unsigned | Nullable, linked to the authenticated user |
| `ip_address` | varchar(45) | Nullable client IP address |
| `user_agent` | text | Nullable browser/device metadata |
| `payload` | longtext | Serialized session payload |
| `last_activity` | int | Unix timestamp used for session expiration |

This table is used by Laravel's database session driver and is created by the session migration included in the backend.

---

## Local Setup

### Backend

```bash
cd linktrim
composer run setup   # installs deps, copies .env, generates key, runs migrations, builds assets
composer run dev     # starts Laravel server + queue + Vite concurrently
```

#### Backend Environment Variables (`.env`)

| Variable | Description |
|----------|-------------|
| `APP_URL` | Backend base URL (e.g. `http://localhost:8000`) |
| `FRONTEND_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port (default `3306`) |
| `DB_DATABASE` | Database name |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `APP_SCHEDULER_TOKEN` | Secret token for the scheduler cleanup endpoint |
| `MYSQL_ATTR_SSL_CA` | Path to SSL CA certificate (required for SSL-enabled MySQL hosts) |

---

### Frontend

```bash
cd linktrimfront
npm install
cp .env.example .env   # set VITE_API_URL to the backend URL
npm run dev
```

#### Frontend Environment Variables (`.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Full URL of the Laravel backend (e.g. `http://localhost:8000`) |

---

## Deployment

### Backend — Render

The repository includes a `render.yaml` for one-click deployment via Render's Docker runtime.

The following environment variables must be set manually in the Render dashboard (marked `sync: false`):

| Variable | Description |
|----------|-------------|
| `FRONTEND_URL` | Deployed Vercel frontend URL |
| `DB_HOST` | MySQL host |
| `DB_DATABASE` | Database name |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
`APP_KEY` is auto-generated by Render. `APP_URL` is automatically set to the service's host.

### Frontend — Vercel

Import the `linktrimfront` folder into Vercel and set the following environment variable:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Render backend URL (e.g. `https://linktrim-backend.onrender.com`) |

---

## Author

Built by **Eddy Conejo**.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
