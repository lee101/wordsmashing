import os

class ws(object):
    debug = os.environ.get('SERVER_SOFTWARE', '').startswith('Development/')

