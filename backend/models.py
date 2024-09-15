from sqlalchemy import Column, Integer, String, Float, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class TVShow(Base):
    __tablename__ = "tv_shows"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    rating = Column(Float)
    note = Column(String, nullable=True)
    status = Column(String) 
    progress = Column(String, nullable=True)  
    
    def __init__(self, id, title, rating, note=None, status="pending", progress=None):
        self.id = id 
        self.note = note
        self.title = title
        self.rating = rating 
        self.progress = progress
        self.status = status

    def __repr__(self):
        return f"({self.id} {self.title} {self.rating} {self.note} {self.status} {self.progress})"
    


engine = create_engine("sqlite:///./tv_shows.db", echo=True)
Base.metadata.create_all(bind=engine)
Session = sessionmaker(bind=engine)
session = Session()

tvShow = TVShow(id=1, title="Breaking Bad", rating=9.9, status="watched")
session.add(tvShow)
session.commit()
