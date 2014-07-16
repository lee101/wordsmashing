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

            var $html = $(evutils.render('templates/shared/game.jinja2'));
            gameState.board.render($html.find('.gameon-board'));
            gameState.destruct = function () {
                gameon.cleanBoards();
                gameon.pauseSound("theme");
            };
            gameState.starBar = new gameon.StarBar(level.star_rating);
            gameState.starBar.setScore(0);

            gameon.renderVolumeTo($html.find('.mm-volume'));
            gameState.starBar.render($html.find('.mm-starbar'));

            gameState.endHandler = new gameState.EndHandler();
            gameState.endHandler.render();
            gameState.$html = $html;
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
            var numSpaces = level.width * level.height - level.num_start_letters - level.growth_rate
                - level.locked_spaces.length - level.blocked_spaces.length;
            for (var i = 0; i < numSpaces; i++) {
                tiles.push(new EmptyTile());
            }
            return gameon.shuffle(tiles);
        };
        function addGrowersTo(tiles) {
            for (var i = 0; i < level.growth_rate; i++) {
                var isRed = true;
                if (level.is_multiplayer && i >= level.growth_rate / 2) {
                    isRed = false;
                }
                tiles.push(new MainTile(gameon.wordutils.getRandomLetter(), isRed, true));
            }
        }

        gameState.currentSelected = [-1, -1];
        gameState.unselectAll = function () {
            if (gameState.currentSelected[0] == -1) {
                return;
            }
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
                if (!self.selected) {
                    gameState.unselectAll();
                }
                self.selected = !self.selected;
                self.reRender();
            };

            self.render = function () {
                var btnStyle = 'btn ';
                if (self.selected) {
                    btnStyle += 'btn-warning ';
                }
                else if (self.isRed) {
                    btnStyle += 'btn-danger ';
                }
                else if (self.locked) {
                    return '<button type="button" class="' + btnStyle + ' btn-lg" disabled="disabled"><span class="glyphicon glyphicon-lock"></span></button>';
                }
                if (self.halfgrown) {
                    btnStyle += ' btn-sm disabled swap grower';
                    return '<button type="button" class="' + btnStyle + '">' + self.letter + '</button>';
                }
                else {
                    btnStyle += ' btn-lg';
                }
                return '<button type="button" class="' + btnStyle + '">' + self.letter + '<div class="gameon-btn-extra">' + self.points + '</div></button>';
            };
        };

        gameState.EndHandler = function () {
            var endSelf = this;
            endSelf.moves = level.numMoves;
            endSelf.render = function () {
                if (level.numMoves) {
                    $('.mm-end-condition').html('<p>Moves: ' + endSelf.moves + '</p>');
                }
                else {
                    $('.mm-end-condition').html('<p>Time: <span class="gameon-clock"></span></p>');
                }
            };
            endSelf.setMoves = function (moves) {
                endSelf.moves = moves;
                if (moves <= 0) {
                    //todo settimeout so they can watch successanimation
                    endSelf.gameOver();
                    return;
                }
                endSelf.render();
            };
            endSelf.gameOver = function () {
                gameon.getUser(function (user) {
                    user.saveScore(level.id, gameState.starBar.getScore());
                    if (gameState.starBar.hasWon()) {
                        if (user.levels_unlocked < level.id) {
                            user.saveLevelsUnlocked(level.id);
                            var numLevels = fixtures.getLevelsByDifficulty(level.difficulty).length;
                            if (user.levels_unlocked % numLevels === 0) {
                                user.saveDifficultiesUnlocked(user.difficulties_unlocked + 1);
                            }
                        }
                    }
                });
                gameState.destruct();
                views.donelevel(gameState.starBar, level);
            };
            if (!level.numMoves) {
                gameState.clock = gameon.clock(endSelf.gameOver, level.time);
                gameState.clock.start();
            }
        };

        gameState.render = function (target) {
            gameState.$target = $(target);
            gameState.$target.html(gameState.$html);
        };

        construct();
        return gameState;
    }


})();
