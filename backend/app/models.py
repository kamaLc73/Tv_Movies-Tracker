from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base

class Series(Base):
    __tablename__ = "series"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, unique=True)
    status = Column(String)
    rating = Column(Float, nullable=True)
    seasons = Column(Integer, nullable=True)
    episodes = Column(Integer, nullable=True)
    current_season = Column(Integer, nullable=True)
    current_episode = Column(Integer, nullable=True)
    rewatch_count = Column(Integer, default=0)
    last_watched_date = Column(DateTime, nullable=True)