from sqlalchemy import Column, Integer, String, Float
from .database import Base

class TVShow(Base):
    __tablename__ = "tv_shows"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    rating = Column(Float)
    note = Column(String, nullable=True)
    status = Column(String) 
    progress = Column(String, nullable=True)  
