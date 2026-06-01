# 📝 NoteStack — MERN Notes App

A full-stack Notes App built with the **MERN Stack**:
- **M**ongoDB — Database
- **E**xpress.js — Backend Framework
- **R**eact.js — Frontend UI
- **N**ode.js — Runtime

---

## 📁 Project Structure

```
notes-app/
├── backend/
│   ├── models/
│   │   └── Note.js          ← Mongoose schema
│   ├── routes/
│   │   └── notes.js         ← CRUD API routes
│   ├── server.js            ← Express server
│   ├── .env                 ← Environment variables
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── NoteCard.js   ← Individual note card
    │   │   └── NoteModal.js  ← Create/Edit modal
    │   ├── App.js            ← Main app logic
    │   ├── App.css           ← App styles
    │   ├── index.js          ← React entry point
    │   ├── index.css         ← Global styles
    │   └── api.js            ← Axios API calls
    └── package.json
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js (v16+)
- MongoDB installed and running locally
- npm or yarn

---

### 1️⃣ Start MongoDB
```bash
# On macOS/Linux
mongod

# On Windows (if installed as service, it may already be running)
net start MongoDB
```

---

### 2️⃣ Run the Backend

```bash
cd backend
npm install
npm run dev
```

Server starts at: **http://localhost:5000**

---

### 3️⃣ Run the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

App opens at: **http://localhost:3000**

---

## 🔗 API Endpoints

| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| GET    | /api/notes        | Get all notes       |
| GET    | /api/notes/:id    | Get single note     |
| POST   | /api/notes        | Create a note       |
| PUT    | /api/notes/:id    | Update a note       |
| DELETE | /api/notes/:id    | Delete a note       |

---

## ✨ Features

- ✅ Create, Read, Update, Delete notes
- 📌 Pin/unpin important notes
- 🎨 Color-code notes (8 colors)
- 🔍 Live search/filter
- 📱 Responsive design (mobile friendly)
- 🌙 Dark theme UI

---

## 🛠️ Tech Stack

| Layer     | Technology         |
|-----------|--------------------|
| Database  | MongoDB + Mongoose |
| Backend   | Node.js + Express  |
| Frontend  | React 18           |
| HTTP      | Axios              |
| Styling   | Plain CSS          |