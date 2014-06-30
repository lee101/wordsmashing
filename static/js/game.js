gameon.loadSound('theme', 'http://commondatastorage.googleapis.com/wordsmashing%2Fws-piano-theme2.mp3');
gameon.loadSound('score', '/gameon/static/music/star.mp3');
gameon.loadSound('win', '/gameon/static/music/winning-level.mp3');
gameon.loadSound('moved', '/static/music/moved-letter.m4a');
gameon.loadSound('moving', '/static/music/moving-letter.m4a');

var wordsmashing = new (function () {
    "use strict";
    var self = this;

    self.Game = function (level) {
        var gameState = this;

        function construct() {
            gameon.loopSound("theme");

            gameState.isMultiplayer = level.is_multiplayer;

            var tiles = gameState.initialBoardTiles();
            gameState.board = new gameon.Board(level.width, level.height, tiles);
            var $html = $('<div class="ws-level gameon-board"></div>');
            evutils.render('static/templates/shared/game.jinja2', {}, function (err, res) {
                $html = $(res);
                gameState.board.render($html.find('.gameon-board'));
                gameState.destruct = function () {
                    gameon.cleanBoards();
                    gameon.pauseSound("theme");
                };
                gameState.starBar = new gameon.StarBar(level.starrating);
                gameState.starBar.setScore(0);

                gameon.renderVolumeTo($html.find('.mm-volume'));
                gameState.starBar.render($html.find('.mm-starbar'));

                gameState.endHandler = new gameState.EndHandler();
                gameState.endHandler.render();
                if (typeof gameState.renderCallback === 'function') {
                    gameState.renderCallback($html);
                }
            });
        }

        gameState.initialBoardTiles = function () {
            var tiles = [];
            for (var i = 0; i < level.num_start_letters; i++) {
                var isRed = true;
                if (level.is_multiplayer && i >= level.num_start_letters / 2) {
                    isRed = false;
                }
                tiles.push(new MainTile(gameon.wordutils.getRandomLetter(), isRed));
            }
            addGrowersTo(tiles);
            var numspaces = level.width * level.height - level.startwords - level.growth_rate
                - level.locked_spaces.length - level.blocked_spaces.length;
            for (var i = 0; i < numspaces; i++) {
                tiles.push(new EmptyTile());
            }
            return gameon.shuffle(tiles);
        };
        function addGrowersTo(tiles) {
            for (var i = 0; i < game.growth_rate; i++) {
                var isRed = true;
                if (level.is_multiplayer && i >= game.growth_rate / 2) {
                    isRed = false;
                }
                tiles.push(new MainTile(gameon.wordutils.getRandomLetter(), isRed, true));
            }
        }
        gameState.currentSelected = [0, 0];
        gameState.unselectAll = function () {
            var currentSelected = gameState.board.getTile(gameState.currentSelected);
            currentSelected.selected = false;
            currentSelected.reRender();
        };

        var EmptyTile = function () {
            var self = this;

            self.click = function () {
                //moveto
            };

            self.render = function () {
                return '<div class="btn btn-lg btn-link" style="height:26px;"></div>';
            };
        };

        var MainTile = function (letter, isRed, halfgrown) {
            var self = this;
            if (typeof halfgrown == 'undefined') {
                halfgrown = false;
            }

            self.letter = letter;
            self.points = gameon.wordutils.scoreLetter(letter);

            self.isRed = isRed;
            self.halfgrown = halfgrown;

            self.selected = false;

            self.click = function () {
                gameState.unselectAll();
                self.selected = !self.selected;
                self.reRender();
            };

            self.render = function () {
                var btnStyle = 'btn btn-primary btn-lg';
                if (self.selected) {
                    btnStyle = 'btn btn-warning btn-lg';
                }
                if (self.isRed) {
                    btnStyle = 'btn btn-danger btn-lg';
                }
                if (self.locked) {
                    return '<button type="button" class="' + btnStyle + '" disabled="disabled"><span class="glyphicon glyphicon-lock"></span></button>';
                }
                return '<button type="button" class="' + btnStyle + '">' + self.letter + '<div class="gameon-btn-extra">' + self.points + '</div></button>';
            };
        };

        construct();
        return gameState;
    }


})();
