#!/usr/bin/env python

import os
import json
import urllib

from google.appengine.ext import ndb
import logging
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
            'urlencode': urllib.quote_plus,
            # 'num_levels': len(LEVELS)
        }
        template_values.update(extraParams)

        template = JINJA_ENVIRONMENT.get_template(view_name)
        self.response.write(template.render(template_values))


class MainHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', False)
        self.render('templates/index.jinja2', {'noads': noads})


class TestsHandler(BaseHandler):
    def get(self):
        self.render('templates/tests.jinja2')


class FbHandler(BaseHandler):
    def get(self):
        # redirect to home
        noads = self.request.get('noads', False)
        self.render('templates/index.jinja2', {'noads': noads})


class ContactHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', False)
        self.render('templates/contact.jinja2', {'noads': noads})


class AboutHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', False)
        self.render('templates/about.jinja2', {'noads': noads})


class PrivacyHandler(BaseHandler):
    def get(self):
        if 'privacy-policy' in self.request.path:
            self.redirect('/privacy', True)

        noads = self.request.get('noads', False)
        self.render('templates/privacy.jinja2', {'noads': noads})


class TermsHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', False)
        self.render('templates/terms.jinja2', {'noads': noads})

class VersusHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', False)
        self.render('templates/versus.jinja2', {'noads': noads})


class TimedHandler(BaseHandler):
    def get(self):

        # self.redirect('/', True)
        noads = self.request.get('noads', False)
        self.render('templates/index.jinja2', {'noads': noads})


class FriendsHandler(BaseHandler):
    def get(self):
        # self.redirect('/versus', True)
        noads = self.request.get('noads', False)
        self.render('templates/versus.jinja2', {'noads': noads})


class GameMultiplayerHandler(BaseHandler):
    def get(self):
        # redirect home
        noads = self.request.get('noads', False)
        self.render('templates/index.jinja2', {'noads': noads})


class GamesHandler(BaseHandler):
    def get(self):
        self.render('templates/index.jinja2', {'noads': True})


class LearnEnglishHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', False)
        self.render('templates/learn-english.jinja2', {
            'noads': noads,
            "json": json,
            'LEARN_ENGLISH_LEVELS': ((key, level) for key, level in fixtures.LEARN_ENGLISH_LEVELS.iteritems())
        })


class EnglishLevelHandler(BaseHandler):
    def get(self, urlkey):
        noads = self.request.get('noads', False)
        if urlkey == 'undefined':
            logging.error('learn english key is undefined??')
            return self.redirect('/learn-english/girls-names')
        self.render('templates/learn-english-level.jinja2', {
            'noads': noads,
            'level': fixtures.LEARN_ENGLISH_LEVELS[urlkey],
            'urlkey': urlkey,
        })


class CampaignHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', False)
        self.render('templates/campaign.jinja2', {'noads': noads})


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
        noads = self.request.get('noads', False)
        self.render('templates/level.jinja2', {'noads': noads, 'level_num': level_num, 'level': fixtures.LEVELS[level_num - 1]})


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

                                               ('/privacy', PrivacyHandler),
                                               ('/privacy-policy', PrivacyHandler),
                                               ('/terms', TermsHandler),
                                               ('/facebook', FbHandler),
                                               ('/about', AboutHandler),
                                               ('/contact', ContactHandler),
                                               ('/versus', VersusHandler),
                                               ('/timed', TimedHandler),
                                               ('/multiplayer', FriendsHandler),
                                               ('/games-multiplayer', GameMultiplayerHandler),
                                               ('/games', GamesHandler),
                                               ('/learn-english', LearnEnglishHandler),
                                               ('/learn-english/(.*)', EnglishLevelHandler),

                                               ('/campaign', CampaignHandler),

                                               # need js rendering
                                               (r'/campaign/..*', MainHandler),
                                               (r'/campaign/..*/..*', MainHandler),
                                               (r'/versus/..*', MainHandler),

                                               (r'/tests', TestsHandler),

                                               ('/buy', BuyHandler),
                                               ('/sitemap', SitemapHandler),

                                           ] + gameon.routes, debug=ws.debug, config=config))
