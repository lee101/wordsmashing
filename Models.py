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
    Level([], [(0,4), (1,4), (4,4), (7,4), (8,4)]),
    Level([], [(3,3), (5,3), (3,5), (5,5)]),
    Level([], [(4,4), (1,1), (1,7), (7,1), (7,7)]),
    Level([], [(4,0), (4,1), (4,2), (4,3), (4,5), (4,6)]),
    Level([], [(6,4), (5,5), (4,6), (3,7), (2,8)]),
    Level([], [(0,0), (0,8), (8,0), (8,8), (0,1), (1,0), (7,8), (8,7), (7,0), (0,7), (8,1), (1,8)]),
    Level([], [(3,3),(3,4),(3,5),(4,3),(4,4),(4,5),(5,3),(5,4),(5,5)]),
    #lvl 9
    Level([], [(0,6), (1,6), (2,6), (3,6), (6,0), (6,1), (6,2), (6,3)]),
    Level([], [(2,2), (2,6), (6,2), (6,6), (1,2), (2,1), (6,7), (7,6), (6,1), (1,6), (7,2), (2,7)]),
    Level([], [(3,0), (3,1), (3,2), (3,3), (5,0), (5,1), (5,2), (5,3)]),
    Level([], [(2,4), (3,4), (4,4), (5,4), (6,4), (6,6), (2,6), (6,5), (2,5)]),
    Level([], [(0,4), (1,4), (2,4), (3,4), (4,4), (5,4), (6,4),(7,4), (7,3)]),
    Level([], [(4,0), (4,1), (4,2), (4,3), (2,4), (3,4), (4,4), (5,4), (6,4)]),
    Level([], [(0,4), (1,4), (2,4), (3,4), (4,4), (5,4), (6,4), (7,4), (8,4)]),
    Level([], [(0,0), (1,1), (2,2), (3,3), (4,4), (5,5), (6,6), (7,7), (8,8)]),
    Level([], [(0,0), (2,2), (4,4), (6,6), (8,8), (0,8), (8,0), (2,6), (6,2)]),
    #lvl 18
    Level([], [(0,8), (1,7), (2,6), (4,0), (4,1), (4,2), (4,3), (6,6), (7,7), (8,8)]),
    Level([], [(0,0), (2,0), (4,0), (6,0), (8,0), (0,8), (2,8), (4,8), (6,8), (8,8)]),
    Level([], [(0,4), (2,4), (4,4), (6,4), (8,4), (1,5), (3,3), (5,5), (7,3)]),
    Level([], [(0,6), (2,4), (4,2), (6,4), (8,2), (1,5), (3,3), (5,5), (7,3), (4,6)]),
    Level([], [(0,1), (1,1), (2,1), (3,1), (4,1), (0,3), (1,3), (2,3), (3,3), (4,3)]),
    Level([], [(0,0), (1,0), (2,0), (3,0), (0,1), (1,1), (2,1), (0,2), (1,2), (0,3)]),
    Level([], [(0,0), (1,0), (2,0), (5,2), (0,1), (1,1), (4,3), (0,2), (3,4), (2,5)]),
    Level([], [(0,0), (1,0), (3,1), (5,2), (0,1), (2,2), (4,3), (1,3), (3,4), (2,5)]),
    Level([], [(0,0), (2,1), (4,2), (6,3), (1,2), (3,3), (5,4), (2,4), (4,5), (3,6)]),
    #lvl 27
    Level([], [(7,1), (8,1), (7,0), (5,0), (5,1), (5,2), (5,3), (6,3), (7,3), (8,3)]),
    Level([], [(2,0), (3,1), (4,2), (5,3), (6,4), (5,5), (4,6), (3,7), (2,8), (5,4)]),
    Level([], [(0,4), (1,4), (2,4), (3,4), (4,4), (5,4), (6,4), (7,4), (8,4), (1,0), (1,1), (1,2), (1,3)]),
    Level([], [(0,0), (1,0), (2,0), (3,0), (4,0), (5,0), (6,0), (7,0), (8,0), (0,8), (1,8), (2,8), (3,8), (4,8), (5,8), (6,8), (7,8), (8,8)]),
    Level([], [(1,1), (3,1), (5,1), (7,1), (1,7), (3,7), (5,7), (7,7), (5,4), (3,4)]),
    Level([], [(0,3), (1,3), (2,3), (3,3), (4,3), (5,3), (8,5), (7,5), (6,5), (5,5), (4,5), (3,5)]),
    Level([], [(3,2), (4,2), (5,2), (2,3), (2,4), (2,5), (3,6), (4,6), (5,6), (6,3), (6,5)]),
    Level([], [(3,5), (2,1), (5,2), (5,4), (4,6), (2,6), (3,3), (4,2), (6,6), (7,3)]),
    ## Gets TO HARD
    Level([], [(4,7), (4,6), (3,8), (5,8), (2,7), (6,7), (2,6), (6,6), (1,5), (7,5), (1,4), (7,4), (0,3), (8,3), (0,2), (8,2)]),
    Level([], [(3,1), (2,2), (1,3), (1,4), (4,1), (5,1), (1,5), (3,7), (7,3), (7,4), (4,7), (7,5), (5,7), (6,6),(6,2),(2,6)]),
    Level([], [(3,3), (5,5), (3,5), (5,3), (3,4), (4,3), (5,4), (4,5), (3,6), (3,7), (3,8), (4,6), (5,7), (6,8)]),
    Level([], [(3,1), (3,2), (3,3), (3,4), (3,5), (3,6), (3,7), (4,7), (4,1), (5,7), (5,1), (6,6), (6,2), (7,3), (7,4), (7,5)]),
    Level([], [(2,1), (2,2), (2,5), (3,0), (4,0), (5,0), (3,3), (4,3), (5,3), (3,6), (4,6), (5,6), (6,1), (6,4), (6,5)]),
    Level([], [(2,3), (2,4), (2,5), (2,6), (2,7), (2,8), (6,3), (6,4), (6,5), (6,6), (6,7), (6,8), (4,5), (3,4), (5,4)]),
    Level([], [(4,2), (3,3), (5,3), (3,4), (5,4), (2,5), (6,5), (2,6), (6,6), (1,7), (7,7), (1,8), (7,8), (3,6), (4,6), (5,6)]),
    Level([], [(2,2), (3,2), (4,2), (2,3), (2,4), (3,4), (4,4), (4,5), (4,6), (3,6), (2,6), (5,3), (5,4), (5,5), (6,4), (7,4), (7,3), (7,5)]),
    Level([], [(1,1), (2,1), (3,1), (4,1), (5,1), (6,1), (7,1), (1,7), (2,7), (3,7), (4,7), (5,7), (6,7), (7,7), (4,2), (4,3), (4,4), (4,5), (4,6)]),
    Level([], [(1,1), (2,2), (3,3), (4,4), (5,5), (6,6), (7,7), (1,2), (1,3), (1,4), (1,5), (1,6), (1,7), (7,1), (7,2), (7,3), (7,4), (7,5), (7,6)]),
    #lvl 60
    Level([], [(3,1), (2,2), (1,3), (1,4), (4,1), (5,1), (1,5), (3,7), (5,4), (7,4), (6,4), (4,7), (6,5), (5,7), (6,6),(6,2),(2,6)]),
    Level([], [(1,1), (2,2), (3,0), (4,0), (4,1), (4,3), (7,0), (6,1), (6,4), (7,3), (7,5), (8,8), (7,7), (7,8), (0,6), (2,6), (1,7), (0,8), (4,6), (4,7), (4,8), (0,3), (1,4)])

    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # #lvl 
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # #lvl  --16 pcs
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # #lvl 
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # Level([], []),
    # #lvl 
    # Level([], []),

]
class EnglishLevel(object):

    urlkey = ""
    name = ""
    required_words = []

    def __init__(self, urlkey, required_words):
        '''
        urlkey is the name in the url
        '''
        self.urlkey = urlkey
        self.name = urlkey.replace('-', ' ').title()
        self.required_words = required_words
LEARN_ENGLISH_LEVELS = {
    "colors": EnglishLevel("colors", [
        "red",
        "green",
        "blue",
        "yellow",
        "orange",
        "purple",
        "pink",
        "white",
        "black",
    ]),
    "animals": EnglishLevel("animals", [
        "cat",
        "dog",
        "mouse",
        "lion",
        "spider",
        "cow",
        "pig",
        "horse",
        "fox",
        "bunny",
    ]),
    "mammals": EnglishLevel("mammals", [
        "whale",
        "lion",
        "deer",
        "rabit",
        "human",
        "dolphin",
        "seal",
        "bear",
        "rhino",
        "beaver",
    ]),
    "fish": EnglishLevel("fish", [
        "cod",
        "snapper",
        "salmon",
        "shrimp",
        "flounder",
        "carp",
        "trout",
        "shark",
        "eel",
    ]),
    "birds": EnglishLevel("birds", [
        "pidgion",
        "seagull",
        "tui",
        "sparrow",
        "robin",
        "crow",
        "parrot",
        "chicken",
        "turkey",
    ]),
    "foods": EnglishLevel("foods", [
        "pie",
        "chips",
        "salad",
        "milk",
        "eggs",
        "bread",
        "cereal",
        "cheese",
        "water",
    ]),
    "household-items": EnglishLevel("household-items", [
        "lamp",
        "door",
        "window",
        "carpet",
        "deck",
        "bed",
        "chair",
        "table",
        "desk",
    ]),
    "kitchen": EnglishLevel("kitchen", [
        "blender",
        "bowl",
        "fork",
        "knife",
        "spoon",
        "kettle",
        "stove",
        "oven",
        "plate",
    ]),
    "bedroom-furniture": EnglishLevel("bedroom-furniture", [
        "picture",
        "chest",
        "light",
        "pillow",
        "blanket",
        "sheet",
        "curtain",
    ]),
    "drinks": EnglishLevel("drinks", [
        "water",
        "milk",
        "coke",
        "pepsi",
        "tea",
        "coffee",
        "juice",
        "beer",
        "wine",
    ]),
    "fruit": EnglishLevel("fruit", [
        "apple",
        "orange",
        "pear",
        "melon",
        "banana",
        "berry",
        "mandarin",
        "grape",
        "tomato",
    ]),
    "vegetables": EnglishLevel("vegetables", [
        "onion",
        "potato",
        "beans",
        "broccoli",
        "carrots",
        "pumpkin",
        "celery",
        "eggplant",
    ]),
    "vehicles": EnglishLevel("vehicles", [
        "car",
        "tram",
        "train",
        "bike",
        "tank",
        "plane",
        "jet",
        "rocket",
        "trike",
    ]),
    "boys-names": EnglishLevel("boys-names", [
        "john",
        "barry",
        "dave",
        "luke",
        "bob",
        "neil",
        "shane",
        "jack",
        "joe",
    ]),
    "girls-names": EnglishLevel("girls-names", [
        "mary",
        "sally",
        "nicole",
        "ann",
        "may",
        "april",
        "nikki",
        "jane",
    ]),
    "unisex-names": EnglishLevel("unisex-names", [
        "lee",
        "riley",
        "cameron",
        "jordan",
        "taylor",
        "tyler",
        "jamie",
        "ryan",
        "perry",
        "reese",
    ]),
    "months": EnglishLevel("months", [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
    ])
}

class User(ndb.Model):
    id = ndb.StringProperty(required=True)
    cookie_user = ndb.IntegerProperty()
    name = ndb.StringProperty()
    email = ndb.StringProperty()

    gold = ndb.IntegerProperty()
    muted = ndb.IntegerProperty()
    difficulty = ndb.IntegerProperty()
    volume = ndb.FloatProperty()
    levels_unlocked = ndb.IntegerProperty(default=0)


    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)

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
