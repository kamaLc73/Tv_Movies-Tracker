from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from .database import engine, get_db
from . import models, schemas, crud

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

@app.get("/series/search", response_model=list[schemas.SeriesResponse])
def search_series(
    query: str = Query(..., min_length=2),
    db: Session = Depends(get_db)
):
    return crud.search_series(db, query)

# Sorting Endpoint
@app.get("/series/sorted", response_model=list[schemas.SeriesResponse])
def sorted_series(
    sort_by: str = Query("title", description="Field to sort by"),
    descending: bool = Query(False),
    db: Session = Depends(get_db)
):
    result = crud.get_series_sorted(db, sort_by, descending)
    if not result:
        raise HTTPException(status_code=400, detail="Invalid sort field")
    return result

# Basic CRUD Endpoints
@app.post("/series/", response_model=schemas.SeriesResponse)
def create_series(series: schemas.SeriesCreate, db: Session = Depends(get_db)):
    return crud.create_series(db, series.model_dump())

@app.get("/series/{series_id}", response_model=schemas.SeriesResponse)
def read_series(series_id: int, db: Session = Depends(get_db)):
    series = crud.get_series(db, series_id)
    if not series:
        raise HTTPException(status_code=404, detail="Series not found")
    return series

@app.get("/series/", response_model=list[schemas.SeriesResponse])
def read_all_series(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    return crud.get_all_series(db, skip=skip, limit=limit)

@app.put("/series/{series_id}", response_model=schemas.SeriesResponse)
def update_series(
    series_id: int,
    series: schemas.SeriesCreate,
    db: Session = Depends(get_db)
):
    db_series = crud.update_series(db, series_id, series.model_dump())
    if not db_series:
        raise HTTPException(status_code=404, detail="Series not found")
    return db_series

@app.delete("/series/{series_id}")
def delete_series(series_id: int, db: Session = Depends(get_db)):
    success = crud.delete_series(db, series_id)
    if not success:
        raise HTTPException(status_code=404, detail="Series not found")
    return {"message": "Series deleted"}

# Filtering Endpoints
@app.get("/series/status/{status}", response_model=list[schemas.SeriesResponse])
def get_by_status(status: str, db: Session = Depends(get_db)):
    return crud.get_series_by_status(db, status)

@app.get("/series/rating/range", response_model=list[schemas.SeriesResponse])
def get_by_rating_range(
    min_rating: float = Query(0, ge=0),
    max_rating: float = Query(10, le=10),
    db: Session = Depends(get_db)
):
    return crud.get_series_by_rating_range(db, min_rating, max_rating)

# Special Actions
@app.put("/series/{series_id}/watch", response_model=schemas.SeriesResponse)
def mark_as_watched(
    series_id: int,
    rating: float = Query(None, ge=0, le=10),
    db: Session = Depends(get_db)
):
    db_series = crud.mark_as_watched(db, series_id, rating)
    if not db_series:
        raise HTTPException(status_code=404, detail="Series not found")
    return db_series

@app.put("/series/{series_id}/rewatch", response_model=schemas.SeriesResponse)
def increment_rewatch(series_id: int, db: Session = Depends(get_db)):
    db_series = crud.increment_rewatch_count(db, series_id)
    if not db_series:
        raise HTTPException(status_code=404, detail="Series not found")
    return db_series

# Statistics Endpoints
@app.get("/stats/average-rating")
def get_average_rating(db: Session = Depends(get_db)):
    avg = crud.get_average_rating(db)
    return {"average_rating": round(avg, 2) if avg else None}

@app.get("/stats/count-by-status")
def count_by_status(db: Session = Depends(get_db)):
    counts = crud.count_series_by_status(db)
    return {status: count for status, count in counts}