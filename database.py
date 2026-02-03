import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from gameon.models.models import Base

DATABASE_PATH = os.environ.get('DATABASE_PATH', 'wordsmashing.db')
DATABASE_URL = f'sqlite:///{DATABASE_PATH}'

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
