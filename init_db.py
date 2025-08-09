"""Initialize the SQLite database."""
import database

if __name__ == '__main__':
    database.init_db()
    print('Database initialized at', database.DB_PATH)
