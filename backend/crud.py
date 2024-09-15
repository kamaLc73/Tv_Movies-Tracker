from sqlalchemy.orm import Session
from . import models, schemas

# Create a new show
def create_show(db: Session, show: schemas.TVShowCreate):
    db_show = models.TVShow(**show.dict())
    db.add(db_show)
    db.commit()
    db.refresh(db_show)
    return db_show

# Get all watched shows
def get_watched_shows(db: Session):
    return db.query(models.TVShow).filter(models.TVShow.status == 'watched').all()

# Update a show
def update_show(db: Session, show_id: int, show: schemas.TVShowUpdate):
    db_show = db.query(models.TVShow).filter(models.TVShow.id == show_id).first()
    if db_show:
        for key, value in show.dict(exclude_unset=True).items():
            setattr(db_show, key, value)
        db.commit()
        db.refresh(db_show)
    return db_show

# Delete a show
def delete_show(db: Session, show_id: int):
    db_show = db.query(models.TVShow).filter(models.TVShow.id == show_id).first()
    if db_show:
        db.delete(db_show)
        db.commit()
    return db_show
