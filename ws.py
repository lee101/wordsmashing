import os

class ws(object):
    debug = os.environ.get('DEV', 'false').lower() in ('true', '1', 'yes')

