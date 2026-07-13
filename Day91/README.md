# Day 92 — Build a Simple REST API

A complete REST API built with **Express** and **MongoDB (Mongoose)** for managing tasks.

## Features

- Full CRUD: Create, Read, Update, Delete tasks
- Mongoose schema validation (required fields, enums, max length)
- Filter tasks by status: `GET /api/tasks?status=pending`
- Proper REST status codes (200, 201, 400, 404, 500)
- Clean MVC-style folder structure (routes → controllers → models)
- Centralized DB connection and error handling

## Folder Structure

```
day92-rest-api/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── taskController.js  # CRUD logic
├── models/
│   └── Task.js             # Mongoose schema
├── routes/
│   └── taskRoutes.js       # API routes
├── .env.example
├── package.json
└── server.js                # App entry point
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file (copy `.env.example`) and set your MongoDB URI:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/day92_tasks
   ```
   (Use a MongoDB Atlas URI if you don't have MongoDB installed locally.)

3. Run the server:
   ```
   npm run dev
   ```
   (or `npm start` if you don't have nodemon)

4. Server runs at: `http://localhost:5000`

## API Endpoints

| Method | Endpoint          | Description                     |
|--------|-------------------|----------------------------------|
| GET    | /api/tasks        | Get all tasks                   |
| GET    | /api/tasks/:id    | Get a single task                |
| POST   | /api/tasks        | Create a new task                |
| PUT    | /api/tasks/:id    | Update a task                    |
| DELETE | /api/tasks/:id    | Delete a task                    |

### Example: Create a task (POST /api/tasks)

Request body:
```json
{
  "title": "Finish Day 92 lesson",
  "description": "Build and test the REST API",
  "status": "pending",
  "priority": "high"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "_id": "66aef...",
    "title": "Finish Day 92 lesson",
    "description": "Build and test the REST API",
    "status": "pending",
    "priority": "high",
    "createdAt": "2026-07-13T10:00:00.000Z",
    "updatedAt": "2026-07-13T10:00:00.000Z"
  }
}
```

## Testing

Use **Postman**, **Thunder Client** (VS Code extension), or `curl`:

```
curl http://localhost:5000/api/tasks
curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d "{\"title\":\"Test task\"}"
```

## Next Steps (Day 93+)

- Connect this API to a React frontend (Day 93: "Connect frontend with backend")
- Add authentication (Day 94: JWT login/register)
- Build the full-stack to-do app (Day 95)
