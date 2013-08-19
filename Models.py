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

class Level(object):

    blocked_spaces = []
    locked_spaces = []

    def __init__(self, blocked_spaces, locked_spaces =[]):
        '''
        blocked_spaces array of (x,y) pairs
        '''
        self.blocked_spaces = blocked_spaces
        self.locked_spaces = locked_spaces
        
LEVELS = [
    Level([], [(4,0), (4,1), (4,2), (4,3)]),
    Level([(0,4), (1,4), (4,4), (7,4), (8,4)]),
    Level([(3,3), (5,3), (3,5), (5,5)]),
    Level([(4,4), (1,1), (1,7), (7,1), (7,7)]),
    Level([(4,0), (4,1), (4,2), (4,3), (4,5), (4,6)]),
    Level([(6,4), (5,5), (4,6), (3,7), (2,8)]),
    Level([(0,0), (0,8), (8,0), (8,8), (0,1), (1,0), (7,8), (8,7), (7,0), (0,7), (8,1), (1,8)]),
    Level([(3,3),(3,4),(3,5),(4,3),(4,4),(4,5),(5,3),(5,4),(5,5)]),
    #lvl 9
    Level([(0,6), (1,6), (2,6), (3,6), (6,0), (6,1), (6,2), (6,3)]),
    Level([(2,2), (2,6), (6,2), (6,6), (1,2), (2,1), (6,7), (7,6), (6,1), (1,6), (7,2), (2,7)]),
    Level([(3,0), (3,1), (3,2), (3,3), (5,0), (5,1), (5,2), (5,3)]),
    Level([(2,4), (3,4), (4,4), (5,4), (6,4), (6,6), (2,6), (6,5), (2,5)]),
    Level([(0,4), (1,4), (2,4), (3,4), (4,4), (5,4), (6,4),(7,4), (7,3)]),
    Level([(4,0), (4,1), (4,2), (4,3), (2,4), (3,4), (4,4), (5,4), (6,4)]),
    Level([(0,4), (1,4), (2,4), (3,4), (4,4), (5,4), (6,4), (7,4), (8,4)]),
    Level([(0,0), (1,1), (2,2), (3,3), (4,4), (5,5), (6,6), (7,7), (8,8)]),
    Level([(0,0), (2,2), (4,4), (6,6), (8,8), (0,8), (8,0), (2,6), (6,2)]),
    #lvl 18
    Level([(0,8), (1,7), (2,6), (4,0), (4,1), (4,2), (4,3), (6,6), (7,7), (8,8)]),
    Level([(0,0), (2,0), (4,0), (6,0), (8,0), (0,8), (2,8), (4,8), (6,8), (8,8)]),
    Level([(0,4), (2,4), (4,4), (6,4), (8,4), (1,5), (3,3), (5,5), (7,3)]),
    Level([(0,6), (2,4), (4,2), (6,4), (8,2), (1,5), (3,3), (5,5), (7,3), (4,6)]),
    Level([(0,1), (1,1), (2,1), (3,1), (4,1), (0,3), (1,3), (2,3), (3,3), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    #lvl 27
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(0,4), (1,4), (4,4), (7,4), (8,4)]),
    Level([(3,3), (5,3), (3,5), (5,5)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    #lvl 40
    Level([(0,4), (1,4), (4,4), (7,4), (8,4)]),
    Level([(3,3), (5,3), (3,5), (5,5)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    #lvl 50
    Level([(0,4), (1,4), (4,4), (7,4), (8,4)]),
    Level([(3,3), (5,3), (3,5), (5,5)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    #lvl 60
    Level([(0,4), (1,4), (4,4), (7,4), (8,4)]),
    Level([(3,3), (5,3), (3,5), (5,5)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    #lvl 70
    Level([(0,4), (1,4), (4,4), (7,4), (8,4)]),
    Level([(3,3), (5,3), (3,5), (5,5)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(4,0), (4,1), (4,2), (4,3)]),
    Level([(0,4), (1,4), (4,4), (7,4), (8,4)]),
    #lvl 81
    Level([(3,3), (5,3), (3,5), (5,5)]),

]

class User(ndb.Model):
    id = ndb.StringProperty(required=True)
    cookie_user = ndb.IntegerProperty()
    gold = ndb.IntegerProperty()
    volume = ndb.FloatProperty()

    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)

    email = ndb.StringProperty()
    name = ndb.StringProperty()
    profile_url = ndb.StringProperty()
    access_token = ndb.StringProperty()
    @classmethod
    def byId(self,id):
        return self.query(self.id == id).get()
    @classmethod
    def buyFor(self,userid):
        dbuser = User.byId(userid)
        dbuser.gold = 1
        dbuser.put()
    @classmethod
    def byToken(self,token):
        return self.query(self.access_token == token).get()

class Score(ndb.Model):
    time = ndb.DateTimeProperty(auto_now_add=True)
    name = ndb.TextProperty()
    user = ndb.KeyProperty(kind=User)
    score = ndb.IntegerProperty(default=0)
    difficulty = ndb.IntegerProperty(default=2)
    timedMode = ndb.IntegerProperty(default=0)

class HighScore(ndb.Model):
    '''
    users high scores, only one per difficulty
    '''
    user = ndb.KeyProperty(kind=User)
    score = ndb.IntegerProperty(default=0)
    difficulty = ndb.IntegerProperty(default=2)
    timedMode = ndb.IntegerProperty(default=0)

    @classmethod
    def getHighScores(cls, user):
        return cls.query(cls.user == user.key).order(cls.difficulty, cls.score).fetch_async(10)

    @classmethod
    def updateHighScoreFor(cls, user, score, difficulty, timedMode):
        '''
        updates users highscore returns true if it is there high score false otherwise
        '''
        hs = cls.query(cls.user == user.key,
                       cls.difficulty == difficulty,
                       cls.timedMode == timedMode).order(-cls.score).fetch(1)
        if len(hs)>0 and hs[0].score < score:
            hs = HighScore()
            hs.user = user.key
            hs.score = score
            hs.difficulty = difficulty
            hs.timedMode = timedMode
            hs.put()
            return True
        if len(hs) == 0:
            hs = HighScore()
            hs.user = user.key
            hs.score = score
            hs.difficulty = difficulty
            hs.timedMode = timedMode
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

class Postback(ndb.Model):
    jwtPostback = ndb.TextProperty()
    orderId = ndb.StringProperty()
    price = ndb.StringProperty()
    currencyCode = ndb.StringProperty()
    time = ndb.DateTimeProperty(auto_now_add=True)
