(function () {
    "use strict";
    window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};

    APP.Views['/'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/start.jinja2'));

            return this;
        }
    });

    APP.Views['/campaign'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/campaign.jinja2'));
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
                        tile.stars = new gameon.Stars(levels[i].starrating, highScores[i].score);
                    }
                    tiles.push(tile);
                }
            });
            levelsSelf.levelsList = levels;
            levelsSelf.board = new gameon.Board(4, 4, tiles);
            evutils.render('static/templates/shared/levels.jinja2', {}, function (err, res) {
                levelsSelf.$el.html(res);
                levelsSelf.board.render(levelsSelf.$el.find('.mm-levels'));
                levelsSelf.renderCallback();
            });

            return this;
        },
        rendersAsync: true,
        renderCallback: $.noop
    });

    APP.Views['/campaign/:difficulty/:level'] = Backbone.View.extend({
        initialize: function (options) {
            this.difficulty = options.args[0];
            this.level = +options.args[1];
        },

        render: function () {

            var self = this;

            var level = fixtures.getLevelsByDifficulty(self.difficulty)[self.level];

            self.game = new wordsmashing.Game(level);
            self.game.renderCallback = function(html) {
                self.$el.html(html);
                self.renderCallback();
            };

            return this;
        },
        rendersAsync: true,
        renderCallback: $.noop
    });

    APP.Views['/contact'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/contact.jinja2'));
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
                self.$el.html(evutils.render('static/templates/shared/header.jinja2', {'path': self.path, 'user': user}));
            });

            return self;
        }
    });

    APP.Views.Footer = Backbone.View.extend({
        initialize: function (options) {
            this.path = options.path;
        },

        render: function () {
            this.$el.html(evutils.render('static/templates/shared/footer.jinja2', {'path': this.path}));
            return this;
        }
    });

}());
