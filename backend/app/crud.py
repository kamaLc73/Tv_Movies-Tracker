from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from . import models
from datetime import datetime

# Basic CRUD
def create_series(db: Session, series_data: dict):
    db_series = models.Series(**series_data)
    db.add(db_series)
    db.commit()
    db.refresh(db_series)
    return db_series

def get_series(db: Session, series_id: int):
    return db.query(models.Series).filter(models.Series.id == series_id).first()

def get_all_series(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Series).offset(skip).limit(limit).all()

def update_series(db: Session, series_id: int, update_data: dict):
    db_series = db.query(models.Series).filter(models.Series.id == series_id).first()
    if not db_series:
        return None
    for key, value in update_data.items():
        setattr(db_series, key, value)
    db.commit()
    db.refresh(db_series)
    return db_series

def delete_series(db: Session, series_id: int):
    db_series = db.query(models.Series).filter(models.Series.id == series_id).first()
    if not db_series:
        return False
    db.delete(db_series)
    db.commit()
    return True

# Filtering
def get_series_by_status(db: Session, status: str):
    return db.query(models.Series).filter(models.Series.status == status).all()

def get_series_by_rating_range(db: Session, min_rating: float, max_rating: float):
    return db.query(models.Series).filter(
        models.Series.rating >= min_rating,
        models.Series.rating <= max_rating
    ).all()

def search_series(db: Session, search_term: str):
    return db.query(models.Series).filter(
        models.Series.title.ilike(f"%{search_term}%")
    ).all()

# Sorting
def get_series_sorted(db: Session, sort_by: str = "title", descending: bool = False):
    column = getattr(models.Series, sort_by, None)
    if not column:
        return None
    if descending:
        return db.query(models.Series).order_by(desc(column)).all()
    return db.query(models.Series).order_by(column).all()

# Special Actions
def increment_rewatch_count(db: Session, series_id: int):
    db_series = db.query(models.Series).filter(models.Series.id == series_id).first()
    if not db_series:
        return None
    db_series.rewatch_count += 1
    db.commit()
    db.refresh(db_series)
    return db_series

def mark_as_watched(db: Session, series_id: int, rating: float = None):
    db_series = db.query(models.Series).filter(models.Series.id == series_id).first()
    if not db_series:
        return None
    db_series.status = "Watched"
    db_series.last_watched_date = datetime.now()
    if rating:
        db_series.rating = rating
    db.commit()
    db.refresh(db_series)
    return db_series

# Statistics
def get_average_rating(db: Session):
    return db.query(func.avg(models.Series.rating)).scalar()

def count_series_by_status(db: Session):
    return db.query(
        models.Series.status,
        func.count(models.Series.id)
    ).group_by(models.Series.status).all()