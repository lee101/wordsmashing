import os
import sqlite3
from contextlib import contextmanager

DB_PATH = os.environ.get('DATABASE_URL', os.path.join(os.path.dirname(__file__), 'wordsmashing.db'))


def init_db():
    """Create required tables if they do not exist."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            'CREATE TABLE IF NOT EXISTS page_views (path TEXT PRIMARY KEY, count INTEGER NOT NULL)'
        )
        conn.commit()


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    try:
        yield conn
    finally:
        conn.close()


def record_page_view(path):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO page_views(path, count) VALUES(?, 1) '
            'ON CONFLICT(path) DO UPDATE SET count=count+1',
            (path,),
        )
        conn.commit()


def get_page_views():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute('SELECT path, count FROM page_views')
        return dict(cur.fetchall())


def get_page_view(path):
    return get_page_views().get(path, 0)

