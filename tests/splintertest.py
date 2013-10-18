import unittest
from splinter import Browser


class SplinterTest(unittest.TestCase):
    def setUp(self):
        pass

    def test_homepage(self):
        with Browser() as browser:
            # Visit URL
            url = "http://localhost:8080"
            browser.visit(url)
            # browser.fill('q', 'splinter - python acceptance testing for web applications')
            # # Find and click the 'search' button
            # button = browser.find_by_name('btnG')
            # # Interact with elements
            # button.click()
            if browser.is_text_present('word smashing'):
                print "Yes, home page is working!"
            else:
                print "No, it wasn't found... ERRORRRRRRRRRR"
    def tearDown(self):
        pass
if __name__ == '__main__':
        unittest.main()
