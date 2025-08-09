import os
import database


def setup_function(_):
    os.environ['DATABASE_URL'] = ':memory:'
    database.init_db()


def test_record_page_view():
    database.record_page_view('/test')
    database.record_page_view('/test')
    assert database.get_page_view('/test') == 2
