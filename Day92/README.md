# TaskFlow — MERN To-Do App

A full-stack to-do dashboard: Express + MongoDB REST API with JWT auth on the
backend, React + Vite + Tailwind on the frontend. Supports priorities,
categories, due dates, filtering, search, and sorting.

## Project structure

```
mern-todo-app/
├── backend/          Express API (JWT auth, MongoDB via Mongoose)
└── frontend/          React + Vite + Tailwind dashboard
```

## Features

- Email/password auth with JWT (register, login, `/me`)
- Protected API routes and a protected React route wrapper
- Create / edit / delete / toggle-complete tasks
- Priority (low/medium/high), free-text category, and due date per task
- Filter by status, priority, category; full-text search on title; sorting
- Live stats (total, active, completed, high priority)

## Requirements

- Node.js 18+
- A MongoDB instance (local `mongod` or a connection string from MongoDB Atlas)

## Backend setup

```bash
cd backend
cp .env.example .env    # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev              # nodemon, or `npm start` for plain node
```

Environment variables (`backend/.env`):

| Variable         | Description                              |
|------------------|-------------------------------------------|
| `PORT`           | API port (default 5000)                   |
| `MONGO_URI`      | MongoDB connection string                 |
| `JWT_SECRET`     | Long random string used to sign JWTs      |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d`                 |
| `CLIENT_URL`     | Frontend origin, for CORS                 |

## Frontend setup

```bash
cd frontend
cp .env.example .env    # VITE_API_URL, defaults to http://localhost:5000/api
npm install
npm run dev              # http://localhost:5173
```

The Vite dev server also proxies `/api` to `http://localhost:5000`, so the
frontend works even if `VITE_API_URL` is left at its default during local dev.

## API overview

| Method | Route                       | Auth | Description              |
|--------|------------------------------|------|---------------------------|
| POST   | `/api/auth/register`         | No   | Create account            |
| POST   | `/api/auth/login`            | No   | Log in, get JWT           |
| GET    | `/api/auth/me`                | Yes  | Current user              |
| GET    | `/api/todos`                  | Yes  | List tasks (with filters) |
| POST   | `/api/todos`                  | Yes  | Create task               |
| GET    | `/api/todos/:id`               | Yes  | Get one task              |
| PUT    | `/api/todos/:id`               | Yes  | Update task               |
| PATCH  | `/api/todos/:id/toggle`        | Yes  | Toggle completed          |
| DELETE | `/api/todos/:id`               | Yes  | Delete task                |
| GET    | `/api/todos/stats/summary`     | Yes  | Task counts                |

`GET /api/todos` accepts query params: `status` (all/active/completed),
`priority`, `category`, `search`, `sort` (newest/oldest/dueDate/priority).

## Notes

- Passwords are hashed with bcrypt before storage.
- Every todo route is scoped to `req.user`, so users only ever see their own tasks.
- The backend was boot-tested (Express app + route/middleware loading) without
  a live MongoDB connection; you'll need a real Mongo instance for the API
  calls that touch the database to succeed.
