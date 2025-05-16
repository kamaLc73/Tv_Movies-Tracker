# 🎬 TV/Movies Tracker Backend


This is the backend of the **TV/Movies Tracker** application, built with **FastAPI**, **SQLAlchemy**, and **SQLite**.

It provides a REST API to manage your series, including CRUD operations, search, sorting, filtering, statistics, and status updates (e.g., watched, rewatched).

---

## 📦 Project Structure

backend/

├── app/

│   ├──  **init** .py

│   ├── main.py          # FastAPI entry point

│   ├── models.py        # SQLAlchemy models

│   ├── schemas.py       # Pydantic schemas

│   ├── crud.py          # DB logic

│   └── database.py      # DB connection & session

├── .gitignore 

├── README.md # This file

└── series.db            # SQLite database

## 🚀 How to Run

### 1. 📥 Install dependencies

Make sure you have Python 3.10+ and install the required packages:

```bash
pip install fastapi uvicorn sqlalchemy
```

### 2. ▶️ Run the server

From the `backend` directory, launch the FastAPI server with:

```bash
uvicorn app.main:app --reload
```

This will start the backend at:

```
http://127.0.0.1:8000
```

---

## 🔍 Explore the API

You can use the **interactive documentation** to explore and test endpoints:

* Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 📚 Available Endpoints

### 🔧 CRUD for Series

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| GET    | `/series/`     | List all series (paginated) |
| POST   | `/series/`     | Create a new series         |
| GET    | `/series/{id}` | Get a series by ID          |
| PUT    | `/series/{id}` | Update a series by ID       |
| DELETE | `/series/{id}` | Delete a series by ID       |

### 🔎 Search & Sort

* `/series/search?query=title`
* `/series/sorted?sort_by=title&descending=true`

### 🔢 Filters

* `/series/status/{status}`
* `/series/rating/range?min_rating=5&max_rating=9`

### ✅ Actions

* `/series/{id}/watch?rating=8.5`
* `/series/{id}/rewatch`

### 📊 Statistics

* `/stats/average-rating`
* `/stats/count-by-status`

---

## 💾 Notes

* All data is stored in `series.db` (SQLite).
* The database and tables are created automatically when you run the app.

---

## ✅ To Do (optional)

* Add authentication
* Add unit tests
* Connect frontend (React or Angular)
* Dockerize the app

---

## 🧑‍💻 Author

Kamal Dehbi

Student in Data Science, AI & Digital Health Engineering
