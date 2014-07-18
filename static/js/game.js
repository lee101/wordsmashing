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

        gameState.currentSelected = null;
        gameState.unselectAll = function () {
            if (!gameState.currentSelected) {
                return;
            }
            gameState.currentSelected.selected = false;
            gameState.currentSelected.reRender();
        };

        var EmptyTile = function () {
            var self = this;
            self.canPassThrough = true;

            self.click = function () {
                //moveto this
                var path = gameState.board.getPathFromTo(gameState.currentSelected, self);
                if (path) {
                    gameState.board.animateTileAlongPath(gameState.currentSelected, path, function () {
                        gameState.board.swapTiles(gameState.currentSelected, self);
                        gameState.endHandler.turnEnd([self.yPos, self.xPos]);

                    });
                }
            };

            self.render = function () {
                return '<div class="btn btn-lg btn-link"></div>';
            };
        };

        var MainTile = function (letter, isRed, halfgrown) {
            var self = new EmptyTile();
            if (typeof halfgrown == 'undefined') {
                halfgrown = false;
            }

            self.letter = letter;
            self.points = gameon.wordutils.scoreLetter(letter);

            self.isRed = isRed;
            self.halfgrown = halfgrown;
            self.canPassThrough = halfgrown;

            self.selected = false;
            if (!self.halfgrown) {
                self.click = function () {
                    if (!self.selected) {
                        gameState.unselectAll();
                        self.selected = true;
                        gameState.currentSelected = self;
                    }
                    else {
                        gameState.currentSelected = null;
                        self.selected = false;
                    }
                    self.reRender();
                };
            }

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
            return self;
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

            function growTiles() {
                for (var y = 0; y < level.height; y++) {
                    for (var x = 0; x < level.width; x++) {
                        var currentTile = gameState.board.getTile(y, x);
                        currentTile.justgrown = false;
                        if (currentTile.halfgrown) {
                            currentTile.halfgrown = false;
                            currentTile.justgrown = true;
                        }
                    }
                }
            }

            //ungrows tiles which just grew (only works once)
            function unGrowTiles() {
                for (var y = 0; y < level.height; y++) {
                    for (var x = 0; x < level.width; x++) {
                        var currentTile = gameState.board.getTile(y, x);
                        if (currentTile.justgrown) {
                            currentTile.halfgrown = true;
                            currentTile.justgrown = false;
                        }
                        else {
                            currentTile.justgrown = false;
                        }
                    }
                }
            }

            endSelf.turnEnd = function(endPos) {
                function removeHword(start, end) {
                    for (var k = start; k <= end; k++) {
                        gameState.board.setTile(endPos[1], k, EmptyTile())
                    }
                }

                function removeVword(start, end) {
                    for (var k = start; k <= end; k++) {
                        gameState.board.setTile(k, endPos[0], EmptyTile())
                    }
                }

                //two used for doubling scores
                var matches = 0;
                var scores = 0;

                var removeTheHword = false;

                growTiles();
                //check for good words.

                ////////////////check horizontally then vertically
                var numLeft = 0;
                var numRight = 0;
                x = endPos[0];
                while (x > 0) {
                    x--;
                    if (!gameState.board.getTile(endPos[1], x).letter) {
                        break;
                    }
                    numLeft++
                }
                x = endPos[0];
                while (x < game.width - 1) {
                    x++;
                    if (!gameState.board.getTile(endPos[1], x).letter) {
                        break;
                    }
                    numRight++
                }
                var startlen = numRight + numLeft + 1;
                var maxlen = startlen;

                //try all lengths down to level.difficulty (2 3 or 4)
                //
                //drag leftStart and rightStart alongto consider all possibilities
                hfinder:
                    while (startlen >= level.difficulty) {
                        //try options
                        //go as far left as pos while still including endPos[0]
                        var leftStart = endPos[0];
                        for (var i = 0; i < startlen - 1 && leftStart - 1 >= 0; i++) {
                            if (!gameState.board.getTile(endPos[1], leftStart - 1).letter) {
                                break;
                            }
                            leftStart--
                        }
                        var rightStart = leftStart + startlen - 1;
                        //consider all options from leftStart
                        var iterationnumber = (maxlen - startlen) + 1;

                        for (; leftStart <= endPos[0] && rightStart <= numRight + endPos[0]; leftStart++, rightStart++) {



                            //take startlen characters starting at leftStart+i
                            var possibleword = "";
                            for (var j = leftStart; j <= rightStart; j++) {
                                possibleword += gameState.board.getTile(endPos[1], j).letter
                            }
                            possibleword = possibleword.toLowerCase();

                            if (words[possibleword]) {
                                //scoreword
                                matches = 1;
                                scores = scoreWord(possibleword);
                                addToScore(scores);
                                removeTheHword = true;
                                showScore(possibleword, scoreWord(possibleword))
                            }
                            else if (words[possibleword.reverse()]) {
                                //scoreword
                                matches = 1;
                                scores = scoreWord(possibleword);
                                addToScore(scores);
                                removeTheHword = true;
                                showScore(possibleword.reverse(), scoreWord(possibleword))
                            }
                            if (matches >= 1) {
                                unlockHWord([leftStart, endPos[1]], [rightStart, endPos[1]]);
                                break hfinder;
                            }
                        }

                        startlen--
                    }
                ////////// Vertical check
                var numTop = 0;
                var numBottom = 0;
                y = endPos[1];
                while (y > 0) {
                    y--;
                    if (!gameState.board.getTile(y, endPos[0]).letter) {
                        break;
                    }
                    numTop++
                }
                y = endPos[1];
                while (y < game.height - 1) {
                    y++;
                    if (!gameState.board.getTile(y, endPos[0]).letter) {
                        break;
                    }
                    numBottom++
                }
                var startlen = numBottom + numTop + 1;
                var maxlen = startlen;

                //try all lengths down to 3
                //
                //drag topStart and bottomStart alongto consider all possibilities
                vfinder:
                    while (startlen >= level.difficulty) {
                        //try options
                        //go as far left as pos while still including endPos[0]
                        var topStart = endPos[1];
                        for (var i = 0; i < startlen - 1 && topStart - 1 >= 0; i++) {
                            if (!gameState.board.getTile(topStart - 1, endPos[0]).letter) {
                                break;
                            }
                            topStart--
                        }
                        var bottomStart = topStart + startlen - 1;
                        //consider all options from topStart
                        var iterationnumber = (maxlen - startlen) + 1;

                        for (; topStart <= endPos[1] && bottomStart <= numBottom + endPos[1]; topStart++, bottomStart++) {


                            possibleword = "";
                            for (var j = topStart; j <= bottomStart; j++) {
                                possibleword += gameState.board.getTile(j, endPos[0]).letter
                            }
                            possibleword = possibleword.toLowerCase();
                            if (words[possibleword]) {
                                //scoreword
                                matches++;
                                var currentWordsScore = scoreWord(possibleword);
                                scores += currentWordsScore;
                                addToScore(currentWordsScore);
                                removeVword(topStart, bottomStart);
                                showScore(possibleword, currentWordsScore)
                            }
                            else if (words[possibleword.reverse()]) {
                                //scoreword
                                matches++;
                                var currentWordsScore = scoreWord(possibleword);
                                scores += currentWordsScore;
                                addToScore(currentWordsScore);
                                removeVword(topStart, bottomStart);
                                showScore(possibleword.reverse(), currentWordsScore)
                            }
                            if (matches >= 1) {
                                unlockVWord([endPos[0], topStart], [endPos[0], bottomStart]);
                                break vfinder;
                            }
                        }

                        startlen--
                    }

                if (removeTheHword) {
                    removeHword(leftStart, rightStart)
                }

                if (matches == 2) {
                    showDouble();
                    addToScore(scores);
                }
                if (matches == 0) {
                    if (gameState.players_turn == 1) {
                        gameState.comboCounter = 0;
                    }
                    else {
                        gameState.comboCounter2 = 0;
                    }
                }
                else {
                    if (gameState.players_turn == 1) {
                        gameState.comboCounter++;
                        if (gameState.comboCounter >= 2) {
                            showCombo(gameState.comboCounter);
                        }
                    }
                    else {
                        gameState.comboCounter2++;
                        if (gameState.comboCounter2 >= 2) {
                            showCombo(gameState.comboCounter2);
                        }
                    }
                }

                //deselect / unselect
                gameState.currentSelected = null;

                //look for 3 new spots
                var numspaces = 0;
                for (var i = 0; i < game.height; i++) {
                    for (var j = 0; j < game.width; j++) {

                        if (!gameState.board.getTile(i, j).letter && !gameState.board.getTile(i, j).blocked) {
                            numspaces++
                        }
                    }
                }
                //if 0 or less spaces then you loose
                if (numspaces <= 0) {
                    gameover()
                }
                //generate random 3 letter places
                var growers = [];
                for (var i = 0; i < numspaces - level.growth_rate; i++) {
                    growers.push(EmptyTile())
                }
                addGrowersTo(growers);

                growers.shuffle();
                //place them
                var currpos = 0;
                for (var y = 0; y < game.height; y++) {
                    for (var x = 0; x < game.width; x++) {

                        if (!gameState.board.getTile(y, x).letter && !gameState.board.getTile(y, x).blocked) {
                            if (growers[currpos].letter) {
                                gameState.board.setTile(y, x, growers[currpos])
                            }
                            currpos++
                        }
                    }
                }
                if (game.players_turn == 1) {
                    game.players_turn = 2;
                    makeAiMove();
                }
                else {
                    game.players_turn = 1;
                }
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
