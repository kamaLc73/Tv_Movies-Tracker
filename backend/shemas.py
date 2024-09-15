from pydantic import BaseModel
from typing import Optional

class TVShowCreate(BaseModel):
    title: str
    rating: Optional[float] = None
    note: Optional[str] = None
    status: str  
    progress: Optional[str] = None

class TVShowUpdate(BaseModel):
    title: Optional[str] = None
    rating: Optional[float] = None
    note: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[str] = None

class TVShow(BaseModel):
    id: int
    title: str
    rating: Optional[float]
    note: Optional[str]
    status: str
    progress: Optional[str]

    class Config:
        orm_mode = True
