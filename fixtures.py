import json

EASY = 2
MEDIUM = 3
HARD = 4
EXPERT = 5
DIFFICULTIES = {EASY, MEDIUM, HARD, EXPERT}

UNLOCKED_MEDIUM = 1
UNLOCKED_HARD = 2
ACHIEVEMENTS = {UNLOCKED_MEDIUM, UNLOCKED_HARD}


class Fixture(object):
    def __init__(self):
        super(Fixture, self).__init__()

    def to_JSON(self):
        # todo compress by removing nulls
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)


class Level(Fixture):
    blocked_spaces = []
    locked_spaces = []

    def __init__(self, height=9, width=9, blocked_spaces=[], locked_spaces=[], growth_rate=3, difficulty=EASY,
                 moves=None, time_left=None, star_rating=None, num_start_letters=14, min_num_letters_in_a_word=3):
        '''
        blocked_spaces/locked_spaces array of (x,y) pairs
        '''
        self.height = height
        self.width = width

        self.blocked_spaces = blocked_spaces
        self.locked_spaces = locked_spaces

        self.growth_rate = growth_rate
        self.difficulty = difficulty

        self.moves = moves
        self.time_left = time_left

        self.star_rating = star_rating
        self.num_start_letters = num_start_letters
        self.min_num_letters_in_a_word = min_num_letters_in_a_word

    def set_hardness(self, h):
        if self.star_rating:
            return
        if h == 0:
            self.star_rating = [1, 1, 1, 1]
            return
        if h < 4:
            self.star_rating = [
                5 * int(h / 4.0 * (7 * 4)),
                5 * int(h / 4.0 * (8 * 4)),
                5 * int(h / 4.0 * (9 * 4)),
                5 * int(h / 4.0 * (10 * 4)),
            ]
            return
        self.star_rating = [
            80,
            90,
            100,
            110,
        ]


EASY_LEVELS = [
    Level(min_num_letters_in_a_word=2, height=4, width=4, growth_rate=0, moves=1),
    Level(min_num_letters_in_a_word=2, height=8, width=8, moves=15, num_start_letters=8),
    Level(min_num_letters_in_a_word=2, time_left=60 * 3),
    Level(min_num_letters_in_a_word=2, locked_spaces=[(4, 0), (4, 1), (4, 2), (4, 3)], moves=20),
    Level(min_num_letters_in_a_word=2, locked_spaces=[(0, 4), (1, 4), (4, 4), (7, 4), (8, 4)], moves=20),
    Level(min_num_letters_in_a_word=3, moves=25),
    Level(min_num_letters_in_a_word=2, locked_spaces=[(3, 3), (5, 3), (3, 5), (5, 5)], moves=20),
    Level(min_num_letters_in_a_word=2, locked_spaces=[(4, 4), (1, 1), (1, 7), (7, 1), (7, 7)], time_left=60 * 3),
    Level(min_num_letters_in_a_word=2, locked_spaces=[(4, 0), (4, 1), (4, 2), (4, 3), (4, 5), (4, 6)], moves=20),
    Level(min_num_letters_in_a_word=2, locked_spaces=[(6, 4), (5, 5), (4, 6), (3, 7), (2, 8)], moves=25),
    Level(min_num_letters_in_a_word=4, moves=25, growth_rate=2),

    Level(min_num_letters_in_a_word=2,
          locked_spaces=[(0, 0), (0, 8), (8, 0), (8, 8), (0, 1), (1, 0), (7, 8), (8, 7), (7, 0), (0, 7), (8, 1),
                         (1, 8)]),
    Level(min_num_letters_in_a_word=2,
          locked_spaces=[(3, 3), (3, 4), (3, 5), (4, 3), (4, 4), (4, 5), (5, 3), (5, 4), (5, 5)], time_left=60 * 3),
    Level(min_num_letters_in_a_word=2, locked_spaces=[(0, 6), (1, 6), (2, 6), (3, 6), (6, 0), (6, 1), (6, 2), (6, 3)]),
    Level(min_num_letters_in_a_word=2,
          locked_spaces=[(2, 2), (2, 6), (6, 2), (6, 6), (1, 2), (2, 1), (6, 7), (7, 6), (6, 1), (1, 6), (7, 2),
                         (2, 7)], time_left=60 * 3),
    Level(min_num_letters_in_a_word=2, locked_spaces=[(3, 0), (3, 1), (3, 2), (3, 3), (5, 0), (5, 1), (5, 2), (5, 3)]),
]

MEDIUM_LEVELS = [
    Level(min_num_letters_in_a_word=2,
          locked_spaces=[(2, 4), (3, 4), (4, 4), (5, 4), (6, 4), (6, 6), (2, 6), (6, 5), (2, 5)]),

    Level(min_num_letters_in_a_word=2,
          locked_spaces=[(0, 4), (1, 4), (2, 4), (3, 4), (4, 4), (5, 4), (6, 4), (7, 4), (7, 3)]),

    Level(locked_spaces=[(4, 0), (4, 1), (4, 2), (4, 3), (2, 4), (3, 4), (4, 4), (5, 4), (6, 4)]),
    Level(locked_spaces=[(0, 4), (1, 4), (2, 4), (3, 4), (4, 4), (5, 4), (6, 4), (7, 4), (8, 4)]),
    Level(locked_spaces=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8)]),
    Level(locked_spaces=[(0, 0), (2, 2), (4, 4), (6, 6), (8, 8), (0, 8), (8, 0), (2, 6), (6, 2)]),
    Level(locked_spaces=[(0, 8), (1, 7), (2, 6), (4, 0), (4, 1), (4, 2), (4, 3), (6, 6), (7, 7), (8, 8)]),
    Level(locked_spaces=[(0, 0), (2, 0), (4, 0), (6, 0), (8, 0), (0, 8), (2, 8), (4, 8), (6, 8), (8, 8)]),
    Level(locked_spaces=[(0, 4), (2, 4), (4, 4), (6, 4), (8, 4), (1, 5), (3, 3), (5, 5), (7, 3)]),
    Level(locked_spaces=[(0, 6), (2, 4), (4, 2), (6, 4), (8, 2), (1, 5), (3, 3), (5, 5), (7, 3), (4, 6)]),
    Level(locked_spaces=[(0, 1), (1, 1), (2, 1), (3, 1), (4, 1), (0, 3), (1, 3), (2, 3), (3, 3), (4, 3)]),
    Level(locked_spaces=[(0, 0), (1, 0), (2, 0), (3, 0), (0, 1), (1, 1), (2, 1), (0, 2), (1, 2), (0, 3)]),
    Level(locked_spaces=[(0, 0), (1, 0), (2, 0), (5, 2), (0, 1), (1, 1), (4, 3), (0, 2), (3, 4), (2, 5)]),
    Level(locked_spaces=[(0, 0), (1, 0), (3, 1), (5, 2), (0, 1), (2, 2), (4, 3), (1, 3), (3, 4), (2, 5)]),
    Level(locked_spaces=[(0, 0), (2, 1), (4, 2), (6, 3), (1, 2), (3, 3), (5, 4), (2, 4), (4, 5), (3, 6)]),
    Level(locked_spaces=[(7, 1), (8, 1), (7, 0), (5, 0), (5, 1), (5, 2), (5, 3), (6, 3), (7, 3), (8, 3)]),
]

HARD_LEVELS = [
    Level(locked_spaces=[(2, 0), (3, 1), (4, 2), (5, 3), (6, 4), (5, 5), (4, 6), (3, 7), (2, 8), (5, 4)]),
    Level(locked_spaces=[(0, 4), (1, 4), (2, 4), (3, 4), (4, 4), (5, 4), (6, 4), (7, 4), (8, 4), (1, 0), (1, 1), (1, 2),
                         (1, 3)]),
    Level(locked_spaces=[(0, 0), (1, 0), (2, 0), (3, 0), (4, 0), (5, 0), (6, 0), (7, 0), (8, 0), (0, 8), (1, 8), (2, 8),
                         (3, 8),
                         (4, 8), (5, 8), (6, 8), (7, 8), (8, 8)]),
    Level(locked_spaces=[(1, 1), (3, 1), (5, 1), (7, 1), (1, 7), (3, 7), (5, 7), (7, 7), (5, 4), (3, 4)]),
    Level(
        locked_spaces=[(0, 3), (1, 3), (2, 3), (3, 3), (4, 3), (5, 3), (8, 5), (7, 5), (6, 5), (5, 5), (4, 5), (3, 5)]),
    Level(locked_spaces=[(3, 2), (4, 2), (5, 2), (2, 3), (2, 4), (2, 5), (3, 6), (4, 6), (5, 6), (6, 3), (6, 5)]),
    Level(locked_spaces=[(3, 5), (2, 1), (5, 2), (5, 4), (4, 6), (2, 6), (3, 3), (4, 2), (6, 6), (7, 3)]),
    # # Gets TO HARD
]

EXPERT_LEVELS = [

    Level(locked_spaces=[(4, 7), (4, 6), (3, 8), (5, 8), (2, 7), (6, 7), (2, 6), (6, 6), (1, 5), (7, 5), (1, 4), (7, 4),
                         (0, 3),
                         (8, 3), (0, 2), (8, 2)]),
    Level(locked_spaces=[(3, 1), (2, 2), (1, 3), (1, 4), (4, 1), (5, 1), (1, 5), (3, 7), (7, 3), (7, 4), (4, 7), (7, 5),
                         (5, 7),
                         (6, 6), (6, 2), (2, 6)]),
    Level(locked_spaces=[(3, 3), (5, 5), (3, 5), (5, 3), (3, 4), (4, 3), (5, 4), (4, 5), (3, 6), (3, 7), (3, 8), (4, 6),
                         (5, 7),
                         (6, 8)]),
    Level(locked_spaces=[(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (4, 7), (4, 1), (5, 7), (5, 1), (6, 6),
                         (6, 2),
                         (7, 3), (7, 4), (7, 5)]),


    Level(locked_spaces=[(2, 1), (2, 2), (2, 5), (3, 0), (4, 0), (5, 0), (3, 3), (4, 3), (5, 3), (3, 6), (4, 6), (5, 6),
                         (6, 1),
                         (6, 4), (6, 5)]),
    Level(locked_spaces=[(2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (6, 3), (6, 4), (6, 5), (6, 6), (6, 7), (6, 8),
                         (4, 5),
                         (3, 4), (5, 4)]),
    Level(locked_spaces=[(4, 2), (3, 3), (5, 3), (3, 4), (5, 4), (2, 5), (6, 5), (2, 6), (6, 6), (1, 7), (7, 7), (1, 8),
                         (7, 8),
                         (3, 6), (4, 6), (5, 6)]),
    Level(locked_spaces=[(2, 2), (3, 2), (4, 2), (2, 3), (2, 4), (3, 4), (4, 4), (4, 5), (4, 6), (3, 6), (2, 6), (5, 3),
                         (5, 4),
                         (5, 5), (6, 4), (7, 4), (7, 3), (7, 5)]),


    Level(locked_spaces=[(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (1, 7), (2, 7), (3, 7), (4, 7), (5, 7),
                         (6, 7),
                         (7, 7), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6)]),
    Level(locked_spaces=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
                         (1, 7),
                         (7, 1), (7, 2), (7, 3), (7, 4), (7, 5), (7, 6)]),
    Level(locked_spaces=[(3, 1), (2, 2), (1, 3), (1, 4), (4, 1), (5, 1), (1, 5), (3, 7), (5, 4), (7, 4), (6, 4), (4, 7),
                         (6, 5),
                         (5, 7), (6, 6), (6, 2), (2, 6)]),


    Level(locked_spaces=[(1, 1), (2, 2), (3, 0), (4, 0), (4, 1), (4, 3), (7, 0), (6, 1), (6, 4), (7, 3), (7, 5), (8, 8),
                         (7, 7),
                         (7, 8), (0, 6), (2, 6), (1, 7), (0, 8), (4, 6), (4, 7), (4, 8), (0, 3), (1, 4)])
]

for i in xrange(len(EASY_LEVELS)):
    EASY_LEVELS[i].set_hardness(i)

for i in xrange(len(MEDIUM_LEVELS)):
    MEDIUM_LEVELS[i].set_hardness(i + len(EASY_LEVELS))
    MEDIUM_LEVELS[i].difficulty = MEDIUM

for i in xrange(len(HARD_LEVELS)):
    HARD_LEVELS[i].set_hardness(i + len(EASY_LEVELS) + len(MEDIUM_LEVELS))
    HARD_LEVELS[i].difficulty = HARD

for i in xrange(len(EXPERT_LEVELS)):
    EXPERT_LEVELS[i].set_hardness(i + len(EASY_LEVELS) + len(MEDIUM_LEVELS) + len(HARD_LEVELS))
    EXPERT_LEVELS[i].difficulty = EXPERT

LEVELS = EASY_LEVELS + MEDIUM_LEVELS + HARD_LEVELS + EXPERT_LEVELS

for i in xrange(len(LEVELS)):
    LEVELS[i].id = i + 1


class EnglishLevel(Fixture):
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
    ]),
    "brands": EnglishLevel("brands", [
        "nike",
        "google",
        "apple",
        "kfc",
        "ikea",
        "addicting",
        "word",
        "games",
    ])
}
