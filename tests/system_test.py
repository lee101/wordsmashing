'''
Run the tests using testrunner.py script in the project root directory.

Usage: testrunner.py SDK_PATH TEST_PATH
Run unit tests for App Engine apps.

SDK_PATH    Path to the SDK installation
TEST_PATH   Path to package containing test modules

Options:
  -h, --help  show this help message and exit

'''
import unittest
import os

import yaml
import main
import webtest
import database
import json

# setting HTTP_HOST in extra_environ parameter for TestApp is not enough for taskqueue stub
os.environ['HTTP_HOST'] = 'localhost'

# globals
network = False


class AppTest(unittest.TestCase):
    def setUp(self):
        # webapp2_config = boilerplate_config.config

        # # create a WSGI application.
        # self.app = webapp2.WSGIApplication(config=webapp2_config)
        # routes.add_routes(self.app)
        # boilerplate_routes.add_routes(self.app)
        # self.testapp = webtest.TestApp(self.app, extra_environ={'REMOTE_ADDR' : '127.0.0.1'})

        os.environ['DATABASE_URL'] = ':memory:'
        database.init_db()
        self.headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) Version/6.0 Safari/536.25',
                        'Accept-Language': 'en_US'}
        self.app = webtest.TestApp(main.app)

        # fix configuration if this is still a raw boilerplate code - required by test with mails
        # if not utils.is_email_valid(self.app.config.get('contact_sender')):
        # self.app.config['contact_sender'] = "noreply-testapp@example.com"
        # if not utils.is_email_valid(self.app.config.get('contact_recipient')):
        #     self.app.config['contact_recipient'] = "support-testapp@example.com"

    def tearDown(self):
        pass


class WebsiteUnitTest(AppTest):
    def test_levels(self):
        response = self.app.get('/versus')
        self.assertEqual(response.status_int, 200)
        self.assertTrue(response.html())

    # def test_robots(self):
    #     response = self.app.get('/robots.txt')
    #     self.assertEqual(response.status_int, 200)
    #     robots = yaml.load(response.unicode_normal_body())
    #     self.assertEqual(robots['User-agent'], '*')
    #     self.assertTrue(isinstance(robots['Sitemap'], str))

    def test_homepage(self):
        response = self.app.get('/')
        self.assertEqual(response.status_int, 200)
        self.assertTrue(response.html())

    def test_stats_endpoint(self):
        self.app.get('/')
        response = self.app.get('/stats')
        data = json.loads(response.body)
        self.assertEqual(data.get('/'), 1)
