from sqlalchemy import Column, Integer, String
from app.database.db import Base

class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True)
    student_name = Column(String)
    subject = Column(String)
    marks = Column(Integer)