from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, crud, schemas
from .database import engine, get_db

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

@app.get("/shows/watched", response_model=list[schemas.TVShow])
def read_watched_shows(db: Session = Depends(get_db)):
    shows = crud.get_watched_shows(db)
    return shows

@app.post("/shows/add", response_model=schemas.TVShow)
def create_tv_show(show: schemas.TVShowCreate, db: Session = Depends(get_db)):
    return crud.create_show(db, show)

@app.put("/shows/update/{show_id}", response_model=schemas.TVShow)
def update_tv_show(show_id: int, show: schemas.TVShowUpdate, db: Session = Depends(get_db)):
    return crud.update_show(db, show_id, show)

@app.delete("/shows/delete/{show_id}")
def delete_tv_show(show_id: int, db: Session = Depends(get_db)):
    deleted_show = crud.delete_show(db, show_id)
    if not deleted_show:
        raise HTTPException(status_code=404, detail="Show not found")
    return {"message": "Show deleted successfully"}
