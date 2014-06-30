
import unittest
import fixtures


class FixturesTestCase(unittest.TestCase):
    def test_fixtures(self):
        for level in fixtures.EASY_LEVELS:
            self.assertGreater(level.star_rating[0], 0)
            self.assertGreater(level.star_rating[1], 0)
            self.assertGreater(level.star_rating[2], 0)
            self.assertGreater(level.star_rating[3], 0)

            self.assertGreater(level.id, 0)


if __name__ == '__main__':
    unittest.main()
