#!/usr/bin/python
import optparse
import sys
# Install the Python unittest2 package before you run this script.
import unittest2
USAGE = "runs tests"
# USAGE = """%prog SDK_PATH TEST_PATH
# Run unit tests for App Engine apps.

# SDK_PATH    Path to the SDK installation
# TEST_PATH   Path to package containing test modules"""
SDK_PATH = "/usr/local/google_appengine"
# TEST_PATH = "/Users/lee/Downloads/projects/PycharmProjects/wordsmashing/tests/"
TEST_PATH = "."
def main(SDK_PATH, TEST_PATH):
    sys.path.insert(0, SDK_PATH)
    import dev_appserver
    dev_appserver.fix_sys_path()
    suite = unittest2.loader.TestLoader().discover(TEST_PATH)
    unittest2.TextTestRunner(verbosity=2).run(suite)


if __name__ == '__main__':
    parser = optparse.OptionParser(USAGE)
    options, args = parser.parse_args()
    # if len(args) != 2:
    #     print 'Error: Exactly 2 arguments required.'
    #     parser.print_help()
    #     sys.exit(1)
    # SDK_PATH = args[0]
    # TEST_PATH = args[1]
    main(SDK_PATH, TEST_PATH)