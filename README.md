# 🎬 TV/Movies Tracker

A full-stack web application that allows you to track TV series you’ve watched, rate them, filter and sort your collection, and visualize statistics — all in a modern, responsive interface.

## 🌐 Tech Stack

### Frontend

- **Next.js (App Router)** — React-based framework for routing & rendering
- **React** + **TypeScript** — Component-based UI with type safety
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Prebuilt accessible components using Radix + Tailwind
- **Zod + React Hook Form** — Schema validation and forms

### Backend

- **FastAPI** — High-performance API backend
- **SQLite** — Lightweight database
- **SQLAlchemy** — ORM for database modeling

---

## ⚙️ Features

- ✅ Add, edit, delete TV series
- 🔍 Search, filter, sort by status, title, or rating
- 📊 Dashboard with real-time stats (average rating, series by status)
- 🔁 Mark as watched or rewatched
- 📶 Backend connection status indicator
- 📱 Fully responsive and mobile-friendly UI

---

## 📁 Project Structure

Tv_Movies-Tracker/

├── backend/               # FastAPI app

│   └── app/

│       ├── main.py        # API entrypoint

│       ├── models.py      # SQLAlchemy models

│       ├── schemas.py     # Pydantic schemas

│       └── crud.py        # CRUD operations

├── frontend/              # Next.js frontend

│   ├── app/               # App Router pages

│   ├── components/        # Reusable UI components

│   ├── lib/               # API clients and utilities

│   └── tailwind.config.ts

└── README.md

## 🚀 Getting Started

### 1️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

> Your backend will be available at: [http://localhost:8000](http://localhost:8000/)

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000/)

---

## 📡 API Endpoints (FastAPI)

| Method | Endpoint                             | Description                |
| ------ | ------------------------------------ | -------------------------- |
| GET    | `/series/`                         | List all series            |
| GET    | `/series/{id}`                     | Get a specific series      |
| POST   | `/series/`                         | Add a new series           |
| PUT    | `/series/{id}`                     | Update a series            |
| DELETE | `/series/{id}`                     | Delete a series            |
| PUT    | `/series/{id}/watch?rating=x`      | Mark as watched            |
| PUT    | `/series/{id}/rewatch`             | Increment rewatch count    |
| GET    | `/series/search?query=title`       | Search by title            |
| GET    | `/series/status/{status}`          | Filter by status           |
| GET    | `/series/rating/range?min=x&max=y` | Filter by rating           |
| GET    | `/series/sorted?sort_by=x&desc=y`  | Sorted results             |
| GET    | `/stats/average-rating`            | Get average rating         |
| GET    | `/stats/count-by-status`           | Get count by series status |

## 📦 Future Improvements

* 🔐 User authentication (multi-user support)
* 🌍 Integrate external APIs like TVMaze or TMDB
* 📥 Data import/export (e.g., JSON or CSV)
* 📈 Advanced analytics and charts
* 🔁 Offline support with caching

---

## 👨‍💻 Author

**Kamal Dehbi**

Student in Data Science, AI & Digital Health Engineering

GitHub: [@kamaLc73](https://github.com/kamaLc73)
