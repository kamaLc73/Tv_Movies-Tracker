from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SeriesCreate(BaseModel):
    title: str
    status: str
    rating: Optional[float] = None
    seasons: Optional[int] = None
    episodes: Optional[int] = None
    current_season: Optional[int] = None
    current_episode: Optional[int] = None
    rewatch_count: int = 0
    last_watched_date: Optional[datetime] = None

class SeriesResponse(SeriesCreate):
    id: int

    class Config:
        from_attributes = True  # Enable ORM mode