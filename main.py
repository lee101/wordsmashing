#!/usr/bin/env python

from Models import Score, Acheivement
from google.appengine.api import users
from google.appengine.ext.webapp import template
from ws import ws
import json
import os
import webapp2


class MainHandler(webapp2.RequestHandler):
    def get(self):
        
        user = users.get_current_user()
        if not user:
            userloginurl = users.create_login_url(self.request.uri)
        template_values = {
            'ws': ws,
            'user': user,
            'userloginurl': userloginurl
        }
        
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, template_values))
    def post(self):
        user = users.get_current_user()
        if not user:
            userloginurl = users.create_login_url(self.request.uri)
        template_values = {
            'ws': ws,
            'user': user,
            'userloginurl': userloginurl
        }
        
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, template_values))

class ScoresHandler(webapp2.RequestHandler):
    def post(self):
        score = Score()
        #score.score = self.request.get('score')
        
        if users.get_current_user():
            score.user = users.get_current_user()
        score.put()
        template_values = {
            'ws': ws
        }
        self.response.out.write('succcess')


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/scores', ScoresHandler)
], debug=True)
