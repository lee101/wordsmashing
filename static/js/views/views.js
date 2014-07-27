(function () {
    "use strict";
    window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};

    APP.Views['/'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('templates/shared/start.jinja2'));

            return this;
        }
    });

    APP.Views['/campaign'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('templates/shared/campaign.jinja2'));
            gameon.getUser(function (user) {
                var difficultiesUnlocked = user.difficulties_unlocked;
                if (difficultiesUnlocked >= 1) {
                    gameon.unlock('.mm-difficulty--' + fixtures.MEDIUM);
                }
                if (difficultiesUnlocked >= 2) {
                    gameon.unlock('.mm-difficulty--' + fixtures.HARD);
                }
                if (difficultiesUnlocked >= 3) {
                    gameon.unlock('.mm-difficulty--' + fixtures.EXPERT);
                }
            });

            return this;
        }
    });
    APP.Views['/campaign/:difficulty'] = Backbone.View.extend({
        initialize: function (options) {
            this.difficulty = options.args[0];
        },

        render: function () {
            var levelsSelf = this;

            var LevelLink = function (id, locked) {
                var self = this;

                self.locked = locked;
                self.id = id;
                self.stars = {
                    render: function () {
                        return '';
                    }
                };

                self.click = function () {
                    APP.goto('/campaign/' + levelsSelf.difficulty + '/' + self.id);
                };

                self.render = function () {
                    if (self.locked) {
                        return '<button type="button" class="btn btn-danger btn-lg" disabled="disabled"><span class="glyphicon glyphicon-lock"></span></button>';
                    }
                    var output = ['<button type="button" class="btn btn-danger btn-lg">' + self.id];
                    if (typeof self.stars !== 'undefined') {
                        output.push(' ' + self.stars.render());
                    }
                    output.push('</button>');
                    return output.join('');
                }
            };
            var tiles = [];
            var levels = fixtures.getLevelsByDifficulty(levelsSelf.difficulty);
            gameon.getUser(function (user) {
                var highScores = user.getHighScores();

                for (var i = 0; i < levels.length; i++) {
                    var locked = true;
                    if (user.levels_unlocked + 1 >= levels[i].id) {
                        locked = false;
                    }

                    var tile = new LevelLink(levels[i].id, locked);
                    if (i < highScores.length) {
                        tile.stars = new gameon.Stars(levels[i].star_rating, highScores[i].score);
                    }
                    tiles.push(tile);
                }
            });
            levelsSelf.levelsList = levels;
            levelsSelf.board = new gameon.Board(4, 4, tiles);
            levelsSelf.$el.html(evutils.render('templates/shared/levels.jinja2'));
            levelsSelf.board.render(levelsSelf.$el.find('.mm-levels'));
            levelsSelf.renderCallback();

            return levelsSelf;
        },
        rendersAsync: true,
        renderCallback: $.noop
    });

    APP.Views['/campaign/:difficulty/:level'] = Backbone.View.extend({
        initialize: function (options) {
            this.difficulty = options.args[0];
            this.levelIdx = +options.args[1] - 1;
        },

        render: function () {

            var self = this;

            var level = fixtures.getLevelsByDifficulty(self.difficulty)[self.levelIdx];

            APP.game = new wordsmashing.Game(level);
            APP.game.render(self.$el);

            return self;
        }
    });

    APP.Views['/done-level'] = Backbone.View.extend({
        initialize: function (options) {
            this.starBar = options.args[0];
            this.starBar2 = options.args[1];
            this.level = options.args[2];
        },

        render: function () {

            var self = this;

            var $html = $(evutils.render('templates/shared/done-level.jinja2'));
            self.$el.html($html);


            self.starBar.render($html.find('.mm-starbar'));

            var $button = $html.find('#mm-next-level');
            if (self.starBar.hasWon()) {
                $button.removeClass('disabled');
                $button.find('.fa-lock').remove();
                $button.click(function () {
                    self.nextLevel(self.level);
                });
            }
            if (self.isLastLevel(self.level)) {
                $button.hide();
            }
            $html.find('#mm-replay').click(function () {
                APP.gotoLevelSilently(self.level);
            });
            var endMessage = $html.find('.mm-end-message p');
            if (self.level.is_multiplayer) {
                if (self.level.computer_blue_opponent) {
                    if (self.starBar.getScore() > self.starBar2.getScore()) {
                        endMessage.html('You Win!!!!');
                    }
                    else if (self.starBar.getScore() == self.starBar2.getScore()) {
                        endMessage.html('Tie!');
                    }
                    else {
                        endMessage.html('Blue Wins. Try Again!');
                    }
                }
                else {
                    if (self.starBar.getScore() > self.starBar2.getScore()) {
                        endMessage.html('Red Wins!');
                    }
                    else if (self.starBar.getScore() == self.starBar2.getScore()) {
                        endMessage.html('Tie!');
                    }
                    else {
                        endMessage.html('Blue Wins!');
                    }
                }

            }
            else if (self.starBar.numStars == 0) {
                endMessage.html('Try Again!');
            }
            else if (self.starBar.numStars == 1) {
                endMessage.html('Good!');
            }
            else if (self.starBar.numStars == 2) {
                endMessage.html('Great!');
            }
            endMessage.fadeIn();
            if (self.starBar.movesBonus && self.starBar.movesBonus.bonus) {
                $html.find('.mm-bonus-message').append(
                        'Moves Bonus: ' + self.starBar.movesBonus.bonus +
                        ' Points!'
                );
            }
            else if (self.starBar.timeBonus && self.starBar.timeBonus.bonus) {
                $html.find('.mm-bonus-message').append(
                        'Time Bonus: ' + self.starBar.timeBonus.bonus +
                        ' Points!'
                );
            }
            if (self.starBar.hasWon() && self.isLastLevel(self.level)) {
                endMessage.append(' <br /> Congratulations You have Won The Game!!!');
            }
            if (self.starBar.hasWon()) {
                gameon.loopSound('win');
            }

            return self;
        },
        isLastLevel: function (lvl) {
            return lvl.id === fixtures.LEVELS[fixtures.LEVELS.length - 1].id;
        },
        nextLevel: function (level) {
            var nextLevel = fixtures.LEVELS[level.id];
            APP.gotoLevel(nextLevel);
        }

    });

    APP.Views['/versus'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('templates/shared/versus.jinja2'));
            return this;
        }
    });

    APP.Views['/versus/1player'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            var self = this;

            var level = {
                "blocked_spaces": [],
                "growth_rate": 3,
                "id": null,
                "moves": 999,
                "time_left": null,
                "num_start_letters": 14,
                "difficulty": 3,
                "locked_spaces": [],
                "height": 9,
                "width": 9,
                "star_rating": [900],
                "is_multiplayer": true,
                "min_num_letters_in_a_word": 3,
                "computer_blue_opponent": true
            };

            APP.game = new wordsmashing.Game(level);
            APP.game.render(self.$el);

            return self;
        }
    });

    APP.Views['/versus/2player'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            var self = this;

            var level = {
                "blocked_spaces": [],
                "growth_rate": 3,
                "id": null,
                "moves": 999,
                "time_left": null,
                "num_start_letters": 14,
                "difficulty": 3,
                "locked_spaces": [],
                "height": 9,
                "width": 9,
                "star_rating": [900],
                "is_multiplayer": true,
                "min_num_letters_in_a_word": 3,
                "computer_blue_opponent": false
            };

            APP.game = new wordsmashing.Game(level);
            APP.game.render(self.$el);

            return self;
        }
    });

    APP.Views['/contact'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('templates/shared/contact.jinja2'));
            return this;
        }
    });

    APP.Views['/about'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/about.jinja2'));
            return this;
        }
    });
    APP.Views['/terms'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/terms.jinja2'));
            return this;
        }
    });
    APP.Views['/privacy'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/privacy.jinja2'));
            return this;
        }
    });


    APP.Views.Header = Backbone.View.extend({
        initialize: function (options) {
            this.path = options.path;
        },

        render: function () {
            var self = this;
            gameon.getUser(function (user) {
                self.$el.html(evutils.render('templates/shared/header.jinja2', {'path': self.path, 'user': user}));
            });

            return self;
        }
    });

    APP.Views.Footer = Backbone.View.extend({
        initialize: function (options) {
            this.path = options.path;
        },

        render: function () {
            this.$el.html(evutils.render('templates/shared/footer.jinja2', {'path': this.path}));
            return this;
        }
    });

}());
