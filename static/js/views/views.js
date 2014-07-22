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

            self.game = new wordsmashing.Game(level);
            self.game.render(self.$el);

            return self;
        }
    });

    APP.Views['/done-level'] = Backbone.View.extend({
        initialize: function (options) {
            this.starBar = options.args[0];
            this.level = options.args[1];
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
                //todo fix this workaround for backbone not triggering the same route
                APP.goto("/");
                APP.gotoLevel(self.level);
            });
            if (self.starBar.numStars == 0) {
                $html.find('.mm-end-message p').html('Try Again!');
            }
            else if (self.starBar.numStars == 1) {
                $html.find('.mm-end-message p').html('Good!');
            }
            else if (self.starBar.numStars == 2) {
                $html.find('.mm-end-message p').html('Great!');
            }
            if (self.starBar.movesBonus) {
                $html.find('.mm-bonus-message').append(
                        'Moves Bonus: ' + self.starBar.movesBonus.bonus +
                        ' Points!'
                );
            }
            else if (self.starBar.timeBonus) {
                $html.find('.mm-bonus-message').append(
                        'Time Bonus: ' + self.starBar.timeBonus.bonus +
                        ' Points!'
                );
            }
            if (self.starBar.hasWon() && self.isLastLevel(self.level)) {
                $html.find('.mm-end-message p').append(' <br /> Congratulations You have Won The Game!!!');
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
