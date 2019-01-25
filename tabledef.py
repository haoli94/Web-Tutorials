from sqlalchemy import *
from sqlalchemy import create_engine, ForeignKey, Column, Date, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref

engine = create_engine('sqlite:///hust.db', echo=True)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id          = Column(Integer, primary_key=True)
    username    = Column(String)
    password    = Column(String)
    todos       = relationship('Todo', backref='user', lazy='dynamic')

class Todo(Base):
    __tablename__ = "todos"

    id          = Column(Integer, primary_key=True)
    user_id     = Column(Integer, ForeignKey('users.id'))
    content     = Column(String)

Base.metadata.create_all(engine)
