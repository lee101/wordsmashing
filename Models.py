import os
import datetime
import logging
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import ndb
from google.appengine.api import users

EASY = 2
MEDIUM = 3
HARD = 4
DIFFICULTIES = set([EASY, MEDIUM, HARD])

UNLOCKED_MEDIUM = 1
UNLOCKED_HARD = 2
ACHEIVEMENTS = set([UNLOCKED_MEDIUM, UNLOCKED_HARD])

class User(ndb.Model):
    id = ndb.StringProperty(required=True)
    cookie_user = ndb.IntegerProperty()

    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)

    name = ndb.StringProperty()
    profile_url = ndb.StringProperty()
    access_token = ndb.StringProperty()
    @classmethod
    def byId(self,id):
        return self.query(self.id == id).get()

class Score(ndb.Model):
    time = ndb.DateTimeProperty(auto_now_add=True)
    name = ndb.TextProperty()
    user = ndb.KeyProperty(kind=User)
    score = ndb.IntegerProperty(default=0)
    difficulty = ndb.IntegerProperty(default=2)

class HighScore(ndb.Model):
    '''
    users high scores, only one per difficulty
    '''
    user = ndb.KeyProperty(kind=User)
    score = ndb.IntegerProperty(default=0)
    difficulty = ndb.IntegerProperty(default=2)

    @classmethod
    def getHighScores(cls, user):
        return cls.query(cls.user == user.key).order(-cls.difficulty).fetch_async(10)

    @classmethod
    def updateHighScoreFor(cls, user, score, difficulty):
        '''
        updates users highscore returns true if it is there high score false otherwise
        '''
        hs = cls.query(cls.user == user.key,
                       cls.difficulty == difficulty).order(-cls.score).fetch(1)
        if len(hs)>0 and hs[0].score < score:
            hs = HighScore()
            hs.user = user.key
            hs.score = score
            hs.difficulty = difficulty
            hs.put()
            return True
        if len(hs) == 0:
            hs = HighScore()
            hs.user = user.key
            hs.score = score
            hs.difficulty = difficulty
            hs.put()
            return True
        return False


    
    
    #title = ndb.StringProperty(required=True)

class Achievement(ndb.Model):
    '''
    provides a many to many relationship between achievments and users
    '''
    time = ndb.DateTimeProperty(auto_now_add=True)
    type = ndb.IntegerProperty()
    user = ndb.KeyProperty(kind=User)

    @classmethod
    def getUserAchievements(cls, user):
        '''
        user a User object
        '''
        achievements = cls.query(cls.user == user.key).fetch_async(10)#.all()?
        # if len(achievements) == 0:
        #     achievements = Acheivement.all().filter("cookie_user = ?", self.current_user["id"]).fetch(len(ACHEIVEMENTS))
        return achievements;

    

