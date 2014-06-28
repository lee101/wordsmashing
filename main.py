#!/usr/bin/env python

import os
import json

from google.appengine.ext import ndb
import webapp2
import jinja2

import fixtures
from gameon import gameon
from gameon.gameon_utils import GameOnUtils
from ws import ws


FACEBOOK_APP_ID = "138831849632195"
FACEBOOK_APP_SECRET = "93986c9cdd240540f70efaea56a9e3f2"

config = {}
config['webapp2_extras.sessions'] = dict(secret_key='93986c9cdd240540f70efaea56a9e3f2')

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])


class BaseHandler(webapp2.RequestHandler):
    def render(self, view_name, extraParams={}):
        template_values = {
            'fixtures': fixtures,
            'ws': ws,
            'json': json,
            'GameOnUtils': GameOnUtils,
            # 'facebook_app_id': FACEBOOK_APP_ID,
            # 'glogin_url': users.create_login_url(self.request.uri),
            # 'glogout_url': users.create_logout_url(self.request.uri),
            'url': self.request.uri,
            'path': self.request.path,
            # 'num_levels': len(LEVELS)
        }
        template_values.update(extraParams)

        template = JINJA_ENVIRONMENT.get_template(view_name)
        self.response.write(template.render(template_values))


class MainHandler(BaseHandler):
    def get(self):
        self.render('templates/index.jinja2')


class FbHandler(BaseHandler):
    def get(self):
        self.render('templates/facebook.jinja2')


class ContactHandler(BaseHandler):
    def get(self):
        self.render('templates/contact.jinja2')


class AboutHandler(BaseHandler):
    def get(self):
        self.render('templates/about.jinja2')


class PrivacyHandler(BaseHandler):
    def get(self):
        self.render('templates/privacy-policy.jinja2')


class TermsHandler(BaseHandler):
    def get(self):
        self.render('templates/terms.jinja2')


class TimedHandler(BaseHandler):
    def get(self):
        self.render('templates/timed.jinja2')


class FriendsHandler(BaseHandler):
    def get(self):
        self.render('templates/multiplayer.jinja2')


class GameMultiplayerHandler(BaseHandler):
    def get(self):
        self.render('templates/games-multiplayer.jinja2')


class GamesHandler(BaseHandler):
    def get(self):
        self.render('templates/games.jinja2')


class LearnEnglishHandler(BaseHandler):
    def get(self):
        self.render('templates/learn-english.jinja2', {
            "learnenglishlevels": fixtures.LEARN_ENGLISH_LEVELS,
            "json": json,
        })


class EnglishLevelHandler(BaseHandler):
    def get(self, urlkey):
        self.render('templates/learn-english-level.jinja2', {
            "level": fixtures.LEARN_ENGLISH_LEVELS[urlkey],
            "json": json,
        })


class CampaignHandler(BaseHandler):
    def get(self):
        self.render('templates/campaign.jinja2')


class BuyHandler(BaseHandler):
    def get(self):
        # paymentAmount = "3.99"
        # CURRENCYCODE = "USD"
        # RETURNURL = "https://wordsmashing.appspot.com/buy"
        # CANCELURL = "https://wordsmashing.appspot.com/buy"

        self.render('templates/buy.jinja2')


class LevelHandler(BaseHandler):
    def get(self, level):
        level_num = int(level)
        self.render('templates/level.jinja2', {'level_num': level_num, 'level': fixtures.LEVELS[level_num - 1]})


class SitemapHandler(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/xml'
        template_values = {
            'learnenglishlevels': fixtures.LEARN_ENGLISH_LEVELS,
        }
        template = JINJA_ENVIRONMENT.get_template('sitemap.xml')
        self.response.write(template.render(template_values))


class SlashMurdererApp(webapp2.RequestHandler):
    def get(self, url):
        self.redirect(url)


app = ndb.toplevel(webapp2.WSGIApplication([
                                               ('/', MainHandler),
                                               ('(.*)/$', SlashMurdererApp),
                                               ('/privacy-policy', PrivacyHandler),
                                               ('/terms', TermsHandler),
                                               ('/facebook', FbHandler),
                                               ('/about', AboutHandler),
                                               ('/contact', ContactHandler),
                                               ('/timed', TimedHandler),
                                               ('/multiplayer', FriendsHandler),
                                               ('/games-multiplayer', GameMultiplayerHandler),
                                               ('/games', GamesHandler),
                                               ('/learn-english', LearnEnglishHandler),
                                               ('/learn-english/(.*)', EnglishLevelHandler),
                                               ('/campaign', CampaignHandler),
                                               (r'/campaign/level(\d+)', LevelHandler),
                                               ('/buy', BuyHandler),
                                               ('/sitemap', SitemapHandler),

                                           ] + gameon.routes, debug=ws.debug, config=config))
