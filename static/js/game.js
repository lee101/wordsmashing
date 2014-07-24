gameon.loadSound('theme', 'http://commondatastorage.googleapis.com/wordsmashing%2Fws-piano-theme2.mp3');
gameon.loadSound('score', '/gameon/static/music/star.mp3');
gameon.loadSound('win', '/gameon/static/music/winning-level.mp3');
gameon.loadSound('moved', '/static/music/moved-letter.m4a');
gameon.loadSound('moving', '/static/music/moving-letter.m4a');

//TODO move to fixtures.words
words = {};
jQuery.get('/static/js/words.txt', function (data) {
    wordslist = data.split('\n');
    for (var i = 0; i < wordslist.length; i++) {
        words[wordslist[i]] = 1;
    }
});

var wordsmashing = new (function () {
    "use strict";
    var self = this;

    self.Game = function (level) {
        var gameState = this;

        function construct() {
            gameon.loopSound("theme");

            gameState.players_turn = 1;
            var tiles = gameState.initialBoardTiles();
            gameState.board = new gameon.Board(level.width, level.height, tiles);

            var $html = $(evutils.render('templates/shared/game.jinja2'));
            gameState.board.render($html.find('.gameon-board'));
            gameState.destruct = function () {
                gameon.cleanBoards();
                gameon.pauseSound("theme");
            };

            if (level.is_multiplayer) {
                gameState.starBar = new gameon.StarBar(level.star_rating, 'progress-bar-danger');
                gameState.starBar.render($html.find('.mm-starbar'));
                gameState.starBar2 = new gameon.StarBar(level.star_rating, 'progress-bar-primary');
                gameState.starBar2.render($html.find('.mm-starbar2'));

                if (level.computer_blue_opponent) {
                    gameState.aiHandler = new gameState.AIHandler();
                }
            }
            else {
                gameState.starBar = new gameon.StarBar(level.star_rating);

                gameState.starBar.render($html.find('.mm-starbar'));
            }

            gameon.renderVolumeTo($html.find('.mm-volume'));

            gameState.endHandler = new gameState.EndHandler();
            gameState.endHandler.render($html.find('.mm-end-condition'));
            gameState.$html = $html;

            if (level.id == 1) {
                window.setTimeout(function () {
                    var $firstLevelFirstTile = $('#firstLevelFirstTile');
                    $firstLevelFirstTile.popover('show');
                }, 400);
            }
        }

        gameState.initialBoardTiles = function () {
            var tiles = [];
            if (level.id == 1) {
                var firstTile = new MainTile('D', true);
                var lastTile = new EmptyTile();
                var lastTileParentRender = lastTile.render;
                lastTile.render = function () {
                    var $renderedTile = $(lastTileParentRender());
                    $renderedTile.attr('id', 'firstLevelLastTile');
                    $renderedTile.attr('data-toggle', 'popover');
                    $renderedTile.attr('data-placement', 'top');
                    $renderedTile.attr('data-trigger', 'manual');
                    $renderedTile.attr('data-content', 'Slide the letter here to make a word');
                    return $renderedTile;
                };
                var firstTileParentRender = firstTile.render;
                firstTile.render = function () {
                    var $renderedTile = $(firstTileParentRender());
                    $renderedTile.attr('id', 'firstLevelFirstTile');
                    $renderedTile.attr('data-toggle', 'popover');
                    $renderedTile.attr('data-placement', 'top');
                    $renderedTile.attr('data-trigger', 'manual');
                    $renderedTile.attr('data-content', 'Click a letter to select it');

                    return $renderedTile;
                };
                var firstTileParentClick = firstTile.click;
                firstTile.click = function () {
                    firstTileParentClick();
                    var $firstLevelFirstTile = $('#firstLevelFirstTile');
                    $firstLevelFirstTile.popover('hide');
                    var $firstLevelLastTile = $('#firstLevelLastTile');
                    $firstLevelLastTile.popover('show');
                };
                var lastTileParentClick = lastTile.click;
                lastTile.click = function () {
                    lastTileParentClick();
                    var $firstLevelLastTile = $('#firstLevelLastTile');
                    $firstLevelLastTile.popover('hide');
                };
                tiles.push(firstTile);
                for (var i = 0; i < 11; i++) {
                    tiles.push(new EmptyTile());
                }
                tiles.push(new MainTile('W', true));
                tiles.push(new MainTile('O', true));
                tiles.push(new MainTile('R', true));
                tiles.push(lastTile);
                return tiles
            }
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
            tiles = gameon.shuffle(tiles);
            var tilesWithLockedSpaces = []
            for (var y = 0; y < level.height; y++) {
                for (var x = 0; x < level.width; x++) {
                    if (level.isLockedTileAt(y, x)) {
                        tilesWithLockedSpaces.push(new LockedTile());
                    }
                    else {
                        tilesWithLockedSpaces.push(tiles.pop());
                    }
                }
            }
            return tilesWithLockedSpaces;
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
            gameState.currentSelected = null;
        };

        gameState.moveFromTo = function (startTile, endTile) {

        };

        var EmptyTile = function () {
            var self = this;
            self.canPassThrough = true;

            self.click = function () {
                //moveto this
                var path = gameState.board.getPathFromTo(gameState.currentSelected, self);
                if (path) {
                    var animationSpeed = 200;
                    if (gameState.players_turn == 2 && level.computer_blue_opponent) {
                        animationSpeed = 400;
                    }
                    gameState.board.animateTileAlongPath(gameState.currentSelected, path, animationSpeed, function () {
                        gameState.board.swapTiles(gameState.currentSelected, self);
                        gameState.endHandler.turnEnd(gameState.currentSelected);

                    });
                }
            };

            self.render = function () {
                return '<div class="btn btn-lg btn-link"></div>';
            };
        };

        var LockedTile = function () {
            var self = this;
            self.canPassThrough = false;
            self.locked = true;
            self.blocked = true;

            self.render = function () {
                return '<div class="btn btn-default btn-lg"><i class="fa fa-lock"></i></div>';
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

            self.setHalfgrown = function (halfgrown) {
                self.halfgrown = halfgrown;
                self.canPassThrough = halfgrown;
                if (!self.halfgrown) {
                    self.oldClick = self.click;
                    self.click = function () {
                        var canClick = (self.isRed && gameState.players_turn == 1) || (!self.isRed && gameState.players_turn == 2);
                        if (!canClick) {
                            return;
                        }
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
                else {
                    if (self.oldClick) {
                        self.click = self.oldClick;
                    }
                }
            };

            self.setHalfgrown(halfgrown);

            self.selected = false;

            self.render = function () {
                var btnStyle = 'btn ';
                if (self.selected) {
                    btnStyle += 'btn-warning ';
                }
                else if (self.isRed) {
                    btnStyle += 'btn-danger ';
                }
                else {
                    btnStyle += 'btn-primary ';
                }
                if (self.locked) {
                    return '<button type="button" class="' + btnStyle + ' btn-lg" disabled="disabled"><span class="glyphicon glyphicon-lock"></span></button>';
                }
                if (self.halfgrown) {
                    btnStyle += ' btn-sm disabled';
                    return '<div class="grower"><button type="button" class="' + btnStyle + '">' + self.letter + '</button></div>';
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
            endSelf.moves = level.moves;
            endSelf.render = function (target) {
                endSelf.$target = $(target);
                if (level.moves) {
                    endSelf.$target.html('<p>Moves: ' + endSelf.moves + '</p>');
                }
                else {
                    endSelf.$target.html('<p>Time: <span class="gameon-clock"></span></p>');
                }
            };
            endSelf.setMoves = function (moves) {
                endSelf.moves = moves;
                if (moves <= 0) {
                    //todo settimeout so they can watch successanimation
                    endSelf.gameOver();
                    return;
                }
                endSelf.render(endSelf.$target);
            };

            function showScore(word, score) {
                gameState.board.fadingPopup('<button type="button" class="btn btn-success">' +
                    gameon.wordutils.capitaliseFirstLetter(word) + ' ' + score + ' Points!</button>');
            }

            function showDouble() {
                gameState.board.fadingPopup('<button type="button" class="btn btn-success">Double Points!</button>');
            }

            function getCombo(comboCount) {
                gameState.board.fadingPopup('<button type="button" class="btn btn-success">' + comboCount + 'X Combo.' + comboCount + ' Points!</button>');
                return comboCount;
            }

            function growTiles() {
                for (var y = 0; y < level.height; y++) {
                    for (var x = 0; x < level.width; x++) {
                        var currentTile = gameState.board.getTile(y, x);
                        currentTile.justgrown = false;
                        if (currentTile.halfgrown) {
                            currentTile.setHalfgrown(false);
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
                            currentTile.setHalfgrown(true);
                            currentTile.justgrown = false;
                        }
                        else {
                            currentTile.justgrown = false;
                        }
                    }
                }
            }


            function unlock(y, x) {
                if (!gameState.board.isInBoard(y, x)) {
                    return;
                }
                var tile = gameState.board.getTile(y, x);
                if (!tile.locked) {
                    return;
                }
                gameState.board.setTile(y, x, new EmptyTile());

//                num_blocked--;
//                num_locked--;
//                if (num_locked <= 0) {
//                    if (typeof winViaBreakingAllLocks == "function") {
//                        winViaBreakingAllLocks();
//                    }
//                }
            }

            function unlockVWord(startTile, endTile) {
                //unlocks a horizontal word takes two xy coordinate pairs
                //try left and right
                unlock(startTile.yPos - 1, startTile.xPos);
                unlock(endTile.yPos + 1, endTile.xPos);
                for (var i = startTile.yPos; i <= endTile.yPos; i++) {
                    unlock(i, startTile.xPos + 1);
                    unlock(i, endTile.xPos - 1);
                }
            }

            function unlockHWord(startTile, endTile) {
                //unlocks a horizontal word takes two xy coordinate pairs
                //try left and right
                unlock(startTile.yPos, startTile.xPos - 1);
                unlock(endTile.yPos, endTile.xPos + 1);
                for (var i = startTile.xPos; i <= endTile.xPos; i++) {
                    unlock(startTile.yPos + 1, i);
                    unlock(startTile.yPos - 1, i);
                }
            }

            endSelf.addToScore = function (score) {
                if (gameState.players_turn == 1) {
                    gameState.starBar.addMoveScoring(score);
                }
                else {
                    gameState.starBar2.addMoveScoring(score)
                }
            };

            endSelf.turnEnd = function (endTile) {
                function removeHword(start, end) {
                    for (var k = start; k <= end; k++) {
                        gameState.board.setTile(endTile.yPos, k, new EmptyTile())
                    }
                }

                function removeVword(start, end) {
                    for (var k = start; k <= end; k++) {
                        gameState.board.setTile(k, endTile.xPos, new EmptyTile())
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
                var x = endTile.xPos;
                while (x > 0) {
                    x--;
                    if (!gameState.board.getTile(endTile.yPos, x).letter) {
                        break;
                    }
                    numLeft++
                }
                var x = endTile.xPos;
                while (x < level.width - 1) {
                    x++;
                    if (!gameState.board.getTile(endTile.yPos, x).letter) {
                        break;
                    }
                    numRight++
                }
                var startlen = numRight + numLeft + 1;

                //try all lengths down to level.difficulty (2 3 or 4)
                //
                //drag leftStart and rightStart alongto consider all possibilities
                hfinder:
                    while (startlen >= level.difficulty) {
                        //try options
                        //go as far left as pos while still including endTile.xPos
                        var leftStart = endTile.xPos;
                        for (var i = 0; i < startlen - 1 && leftStart - 1 >= 0; i++) {
                            if (!gameState.board.getTile(endTile.yPos, leftStart - 1).letter) {
                                break;
                            }
                            leftStart--
                        }
                        var rightStart = leftStart + startlen - 1;
                        //consider all options from leftStart

                        for (; leftStart <= endTile.xPos && rightStart <= numRight + endTile.xPos; leftStart++, rightStart++) {



                            //take startlen characters starting at leftStart+i
                            var possibleword = "";
                            for (var j = leftStart; j <= rightStart; j++) {
                                possibleword += gameState.board.getTile(endTile.yPos, j).letter
                            }
                            possibleword = possibleword.toLowerCase();

                            if (words[possibleword]) {
                                matches = 1;
                                scores = gameon.wordutils.scoreWord(possibleword);
                                removeTheHword = true;
                                showScore(possibleword, gameon.wordutils.scoreWord(possibleword))
                            }
                            else if (words[possibleword.reverse()]) {
                                matches = 1;
                                scores = gameon.wordutils.scoreWord(possibleword);
                                removeTheHword = true;
                                showScore(possibleword.reverse(), gameon.wordutils.scoreWord(possibleword))
                            }
                            if (matches >= 1) {
                                unlockHWord(gameState.board.getTile(endTile.yPos, leftStart), gameState.board.getTile(endTile.yPos, rightStart));
                                break hfinder;
                            }
                        }

                        startlen--
                    }
                ////////// Vertical check
                var numTop = 0;
                var numBottom = 0;
                var y = endTile.yPos;
                while (y > 0) {
                    y--;
                    if (!gameState.board.getTile(y, endTile.xPos).letter) {
                        break;
                    }
                    numTop++
                }
                var y = endTile.yPos;
                while (y < level.height - 1) {
                    y++;
                    if (!gameState.board.getTile(y, endTile.xPos).letter) {
                        break;
                    }
                    numBottom++
                }
                var startlen = numBottom + numTop + 1;

                //try all lengths down to 3
                //
                //drag topStart and bottomStart alongto consider all possibilities
                vfinder:
                    while (startlen >= level.difficulty) {
                        //try options
                        //go as far left as pos while still including endTile.xPos
                        var topStart = endTile.yPos;
                        for (var i = 0; i < startlen - 1 && topStart - 1 >= 0; i++) {
                            if (!gameState.board.getTile(topStart - 1, endTile.xPos).letter) {
                                break;
                            }
                            topStart--
                        }
                        var bottomStart = topStart + startlen - 1;
                        //consider all options from topStart

                        for (; topStart <= endTile.yPos && bottomStart <= numBottom + endTile.yPos; topStart++, bottomStart++) {


                            possibleword = "";
                            for (var j = topStart; j <= bottomStart; j++) {
                                possibleword += gameState.board.getTile(j, endTile.xPos).letter
                            }
                            possibleword = possibleword.toLowerCase();
                            if (words[possibleword]) {
                                matches++;
                                var currentWordsScore = gameon.wordutils.scoreWord(possibleword);
                                scores += currentWordsScore;
                                removeVword(topStart, bottomStart);
                                showScore(possibleword, currentWordsScore)
                            }
                            else if (words[possibleword.reverse()]) {
                                matches++;
                                var currentWordsScore = gameon.wordutils.scoreWord(possibleword);
                                scores += currentWordsScore;
                                removeVword(topStart, bottomStart);
                                showScore(possibleword.reverse(), currentWordsScore)
                            }
                            if (matches >= 1) {
                                unlockVWord(gameState.board.getTile(topStart, endTile.xPos), gameState.board.getTile(bottomStart, endTile.xPos));
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
                    scores += scores;
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
                            scores += getCombo(gameState.comboCounter);
                        }
                    }
                    else {
                        gameState.comboCounter2++;
                        if (gameState.comboCounter2 >= 2) {
                            scores += getCombo(gameState.comboCounter2);
                        }
                    }
                }

                endSelf.addToScore(scores);

                gameState.unselectAll();

                //look for 3 new spots
                var numspaces = 0;
                for (var i = 0; i < level.height; i++) {
                    for (var j = 0; j < level.width; j++) {

                        if (!gameState.board.getTile(i, j).letter && !gameState.board.getTile(i, j).blocked) {
                            numspaces++
                        }
                    }
                }
                //if 0 or less spaces then you loose
                if (numspaces <= 0) {
                    endSelf.gameOver()
                }
                if (level.moves) {
                    endSelf.setMoves(endSelf.moves - 1);
                }
                //generate random 3 letter places
                var growers = [];
                for (var i = 0; i < numspaces - level.growth_rate; i++) {
                    growers.push(new EmptyTile())
                }
                addGrowersTo(growers);

                gameon.shuffle(growers);
                //place them
                var currpos = 0;
                for (var y = 0; y < level.height; y++) {
                    for (var x = 0; x < level.width; x++) {

                        if (!gameState.board.getTile(y, x).letter && !gameState.board.getTile(y, x).blocked) {
                            if (growers[currpos].letter) {
                                gameState.board.setTile(y, x, growers[currpos])
                            }
                            currpos++
                        }
                    }
                }
                if (level.is_multiplayer) {
                    if (gameState.players_turn == 1) {
                        gameState.players_turn = 2;
                        if (level.computer_blue_opponent) {
                            gameState.aiHandler.makeAiMove();
                        }
                    }
                    else {
                        gameState.players_turn = 1;
                    }
                }

                gameState.board.render();
            };
            endSelf.scoreMove = function (startTile, endTile) {

                // == 1 simulate move on the board

                gameState.board.swapTiles(startTile, endTile);
                var tmp = endTile;
                endTile = startTile;
                startTile = tmp;

                growTiles();


                // == 2 score the move
                var currentMovesScore = 0;
                ///////////////////////////////////
                var matches = 0;
                var scores = 0;
                ////////////////check horizontally then vertically
                var numLeft = 0;
                var numRight = 0;
                var x = endTile.xPos;
                while (x > 0) {
                    x--;
                    if (!gameState.board.getTile(endTile.yPos, x).letter) {
                        break;
                    }
                    numLeft++
                }
                var x = endTile.xPos;
                while (x < level.width - 1) {
                    x++;
                    if (!gameState.board.getTile(endTile.yPos, x).letter) {
                        break;
                    }
                    numRight++
                }
                var startlen = numRight + numLeft + 1;

                //try all lengths down to difficulty (2 3 or 4)
                //
                //drag leftStart and rightStart alongto consider all possibilities
                hfinder:
                    while (startlen >= fixtures.EASY) {
                        //try options
                        //go as far left as pos while still including endTile.xPos
                        var leftStart = endTile.xPos;
                        for (var i = 0; i < startlen - 1 && leftStart - 1 >= 0; i++) {
                            if (!gameState.board.getTile(endTile.yPos, leftStart - 1).letter) {
                                break;
                            }
                            leftStart--
                        }
                        var rightStart = leftStart + startlen - 1;
                        //consider all options from leftStart

                        for (; leftStart <= endTile.xPos && rightStart <= numRight + endTile.xPos; leftStart++, rightStart++) {



                            //take startlen characters starting at leftStart+i
                            var possibleword = "";
                            for (var j = leftStart; j <= rightStart; j++) {
                                possibleword += gameState.board.getTile(endTile.yPos, j).letter
                            }
                            possibleword = possibleword.toLowerCase();

                            if (words[possibleword]) {
                                //scoreword
                                matches = 1;
                                scores = gameon.wordutils.scoreWord(possibleword);
                                currentMovesScore += scores;
                            }
                            else if (words[possibleword.reverse()]) {
                                //scoreword
                                matches = 1;
                                scores = gameon.wordutils.scoreWord(possibleword);
                                currentMovesScore += scores;
                            }
                            if (matches >= 1) {
                                break hfinder;
                            }
                        }

                        startlen--
                    }
                ////////// Vertical check
                var numTop = 0;
                var numBottom = 0;
                var y = endTile.yPos;
                while (y > 0) {
                    y--;
                    if (!gameState.board.getTile(y, endTile.xPos).letter) {
                        break;
                    }
                    numTop++
                }
                var y = endTile.yPos;
                while (y < level.height - 1) {
                    y++;
                    if (!gameState.board.getTile(y, endTile.xPos).letter) {
                        break;
                    }
                    numBottom++
                }
                var startlen = numBottom + numTop + 1;

                //try all lengths down to 3
                //
                //drag topStart and bottomStart alongto consider all possibilities
                vfinder:
                    while (startlen >= fixtures.EASY) {
                        //try options
                        //go as far left as pos while still including endTile.xPos
                        var topStart = endTile.yPos;
                        for (var i = 0; i < startlen - 1 && topStart - 1 >= 0; i++) {
                            if (!gameState.board.getTile(topStart - 1, endTile.xPos).letter) {
                                break;
                            }
                            topStart--
                        }
                        var bottomStart = topStart + startlen - 1;
                        //consider all options from topStart

                        for (; topStart <= endTile.yPos && bottomStart <= numBottom + endTile.yPos; topStart++, bottomStart++) {


                            possibleword = "";
                            for (var j = topStart; j <= bottomStart; j++) {
                                possibleword += gameState.board.getTile(j, endTile.xPos).letter
                            }
                            possibleword = possibleword.toLowerCase();
                            if (words[possibleword]) {
                                //scoreword
                                matches++;
                                var currentWordsScore = gameon.wordutils.scoreWord(possibleword);
                                scores += currentWordsScore;
                                currentMovesScore += currentWordsScore;
                            }
                            else if (words[possibleword.reverse()]) {
                                //scoreword
                                matches++;
                                var currentWordsScore = gameon.wordutils.scoreWord(possibleword);
                                scores += currentWordsScore;
                                currentMovesScore += currentWordsScore;
                            }
                            if (matches >= 1) {
                                break vfinder;
                            }
                        }

                        startlen--
                    }
                //getdouble
                if (matches == 2) {
                    currentMovesScore += scores;
                }

                ///////////////////////////////////
                // == 3 rollback the board
                gameState.board.swapTiles(startTile, endTile);
                unGrowTiles();

                return currentMovesScore
            };


            endSelf.gameOver = function () {
                if ($.isNumeric(level.id)) {
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
                }

                gameState.destruct();
                APP.doneLevel(gameState.starBar, gameState.starBar2, level);
            };
            if (!level.moves) {
                gameState.clock = gameon.clock(endSelf.gameOver, level.time);
                gameState.clock.start();
            }
        };

        gameState.AIHandler = function () {
            var AISelf = this;

            AISelf.makeAiMove = function () {
                //TODO figure out if people can move!
                gameon.blockUI();

                //find a place to move to
                // - find all blue movables
                var blueTiles = [];
                for (var y = 0; y < level.height; y++) {
                    for (var x = 0; x < level.width; x++) {
                        var currentTile = gameState.board.getTile(y, x);
                        if (currentTile.isRed == false &&
                            currentTile.letter && !currentTile.halfgrown) {

                            blueTiles.push(currentTile);
                        }
                    }
                }
                //get the move with best score
                var maxScoreMove = [
                    gameState.board.getTile(0, 0),
                    gameState.board.getTile(0, 0)
                ];
                var maxScore = 0;
                var totalNumMovesFound = 0;
                for (var i = 0; i < blueTiles.length; i++) {
                    var allMovesFrom = gameState.board.getAllReachableTilesFrom(blueTiles[i]);
                    totalNumMovesFound += allMovesFrom.length;
                    for (var j = 0; j < allMovesFrom.length; j++) {
                        var currentMovesScore = gameState.endHandler.scoreMove(blueTiles[i], allMovesFrom[j]);
                        if (currentMovesScore >= maxScore) {
                            maxScore = currentMovesScore;
                            maxScoreMove = [blueTiles[i], allMovesFrom[j]];
                        }
                    }
                }
                if (totalNumMovesFound == 0) {
                    //no moves! TODO something
                    gameState.endHandler.gameOver();
                    gameon.unblockUI()
                }

                //update view
                maxScoreMove[0].click();
                setTimeout(function () {
                    //move there
                    maxScoreMove[1].click();
//                    gameon.unblockUI();
                    //gameState.unselectAll();
                }, 800);
            };


            return AISelf;
        };

        gameState.render = function (target) {
            gameState.$target = $(target);
            gameState.$target.html(gameState.$html);
        };

        construct();
        return gameState;
    }


})();
