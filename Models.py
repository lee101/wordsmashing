import os
import datetime
import logging
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db
from google.appengine.api import users



class Score(db.Model):
    time = db.DateTimeProperty(auto_now_add=True)
    name = db.TextProperty()
    user = db.UserProperty()
    score = db.IntegerProperty(default=0, required=True)
    
    ##title = db.StringProperty(required=True)

class Acheivement(db.Model):
    time = db.DateTimeProperty(auto_now_add=True)
    name = db.TextProperty()
    user = db.UserProperty()

