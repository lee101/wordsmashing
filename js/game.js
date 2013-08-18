
var game = {
    'width': 9,
    'height': 9,
    'startwords': 12,
    'growth_rate': 3,
    'score': 0
};
if (!blocked_spaces) {
    var blocked_spaces = {};
    num_blocked = 0;
}
var timedMode = 0;
var EASY = 2;
var MEDIUM = 3;
var HARD = 4;
var difficulty = EASY;
/**
 * implementing 5 10 20 combos!
 */
var comboCounter = 0;

var gamedata = [];
var gamedata2d = [];
currentNumWords = game.startwords + game.growth_rate;
words = {};
jQuery.get('/js/words.txt', function (data) {
    wordslist = data.split('\n');
    for (var i = 0; i < wordslist.length; i++) {
        words[wordslist[i]] = 1;
    }
});
function showChangeDifficultyDialog(){
    //TODO fix ui
    var mediumButton = '<button class="btn btn-large btn-danger" onclick="changeDifficulty(MEDIUM)" type="button" title="Change difficulty to Medium">Medium</button>';
    if(! achievements.medium){
        var mediumButton = '<button class="btn btn-large btn-danger btn disabled" type="button" title="Get Over 5000 Points on Easy!"><span class="icon-lock"></span>Medium</button>';
    }
    
    var hardButton = '<button class="btn btn-large btn-danger" onclick="changeDifficulty(HARD)" type="button" title="Change difficulty to Hard">Hard</button>';
    if(! achievements.hard){
        var hardButton = '<button class="btn btn-large btn-danger btn disabled" type="button" title="Get Over 5000 Points on Medium!"><span class="icon-lock"></span>Hard</button>';
    }
    
    modal.open({content: '<div id="changedifficulty">'+
        '<p class="lead">Change difficulty and start a new game?</p>'+
        '<button class="btn btn-large btn-danger" onclick="changeDifficulty(EASY)" type="button" title="Change difficulty to Easy">Easy</button>'+
        mediumButton+
        hardButton+
    '</div>'});
    
}

function changeDifficulty(newDifficulty){
    modal.close();
    newGame();
    difficulty = newDifficulty;
    var difficultyText = "Medium";
    if(difficulty == EASY){
        difficultyText = "Easy";
    }
    else if(difficulty == HARD){
        difficultyText = "Hard";
    }

    $('#changedifficultybutton').text('Difficulty: ' + difficultyText);
}

newGame = function () {
    if(typeof GAMESAPI === 'object') {
        GAMESAPI.beginGameSession(
           function(response) {
               // success callback.  response.statusCode == 200
           },
           function(response) {
               // error handler callback.  response.statusCode != 200
           }
       );
    }
    gamedata = [];
    gamedata2d = [];
    for (var i = 0; i < game.startwords; i++) {
        gamedata.push({letter: getRandomLetter(), 'selected': false});
    }
    for (var i = 0; i < game.growth_rate; i++) {
        gamedata.push({letter: getRandomLetter(), 'halfgrown': 'halfgrown', 'selected': false});
    }
    //push empty spaces
    var numspaces = game.width * game.height - game.startwords - game.growth_rate - num_blocked;
    for (var i = 0; i < numspaces; i++) {
        gamedata.push({'selected': false});
    }
    gamedata.shuffle()

    //wrap into 2d

    var gamedatapos = 0;
    for (var i = 0; i < game.height; i++) {
        gamedata2d.push([]);
        for (var j = 0; j < game.width; j++) {
            if(blocked_spaces[j+'-'+i]) {
                gamedata2d[i].push({'blocked':true})
            }
            else {
                gamedata2d[i].push(gamedata[gamedatapos++]);
            }
        }
    }
    //remove score and game over screen
    game.score = 0;
    comboCounter = 0;
    $('#showscore1').html('<button style="display: none"></button>');
    update();
};
function getXIndex(imclicked){
    return Number(imclicked.id.split('-')[1]);
}
function getYIndex(imclicked){
    return Number(imclicked.id.split('-')[0]);
    /*
    var idx = imclicked.parentElement.parentNode.sectionRowIndex
    if(idx==-1){
        return imclicked.parentElement.parentNode.rowIndex
    }
    return idx */
}
newGame();
selectedXpos = -1;
selectedYpos = -1;
function selectWord(imclicked) {
    var xPos = getXIndex(imclicked);
    var yPos = getYIndex(imclicked);

    //unselect current if there is a current selected
    if (selectedXpos != -1 && selectedYpos != -1) {
        gamedata2d[selectedYpos][selectedXpos].selected = false;
        $("#"+selectedYpos+'-'+selectedXpos).removeClass('btn-warning');
        $("#"+selectedYpos+'-'+selectedXpos).addClass('btn-danger');
        //stop if current selected is this
        if(selectedXpos == xPos && selectedYpos == yPos){
            selectedXpos = -1;
            selectedYpos = -1;
        	return;
        }
        selectedXpos = -1;
        selectedYpos = -1;
    }

    gamedata2d[yPos][xPos].selected = true;
    selectedXpos = xPos
    selectedYpos = yPos

    //update view

    $("#"+yPos+'-'+xPos).removeClass('btn-danger');
    $("#"+yPos+'-'+xPos).addClass('btn-warning');
}
/*
 animate along path
 //dont worry about blocking input for now. TODO later
 */
function moveTo(imclicked) {
    var start = [selectedXpos, selectedYpos]
    var xPos = getXIndex(imclicked)
    var yPos = getYIndex(imclicked)
    var goal = [xPos, yPos]
    var path;
    try {
        path = getpath(start, goal)
    } catch (e) {
        //play cant go there noise?
        return;
    }

    var timescalled = 0

    function handleAnimation() {
        //custom animation followed by update
        //reverse order over path

        var end = path.length - 1 - timescalled

        //find direction
        var nextpos = end - 1
        var direction
        //60x57
        if (path[end][0] > path[nextpos][0]) {
            direction = 'left'
            var newcss = {
                left: '-=60px'
            }
        }
        if (path[end][0] < path[nextpos][0]) {
            direction = 'right'
            var newcss = {
                left: '+=60px'
            }
        }
        if (path[end][1] > path[nextpos][1]) {
            direction = 'up'
            var newcss = {
                top: '-=57px'
            }
        }
        if (path[end][1] < path[nextpos][1]) {
            direction = 'down'
            var newcss = {
                top: '+=57px'
            }
        }
        timescalled++;
        var stopping = timescalled >= path.length - 1

        var $cell = $('#'+selectedYpos+'-'+selectedXpos); // Now it's a jQuery object.
        if (!stopping) {

            $cell.animate(newcss, 200, handleAnimation);
        }

        if (stopping) {
            //last time
            $cell.animate(newcss, 200, function () {
                //stop animation
                $cell.css({
                    left: '0px',
                    top: '0px'
                })

                var tmp = gamedata2d[yPos][xPos];
                gamedata2d[yPos][xPos] = gamedata2d[selectedYpos][selectedXpos]
                gamedata2d[selectedYpos][selectedXpos] = tmp
                //turn end
                turnEnd([xPos, yPos])

                update();
                //TODO unblock ui
                $.unblockUI();
            })

        }
    }

    //TODO block ui
    $.blockUI({ message: ''})//,css: { backgroundColor: '#f00', color: '#fff'} });

    handleAnimation();
}


function turnEnd(endPos) {
    function removeHword(start, end) {
        for (var k = start; k <= end; k++) {
            gamedata2d[endPos[1]][k] = {'selected': false}
        }
    }
    function removeVword(start, end) {
        for (var k = start; k <= end; k++) {
            gamedata2d[k][endPos[0]] = {'selected': false}
        }
    }
    //two used for doubling scores
    var matches=0;
    var scores = 0;
    
    var removeTheHword=false

    //grow tiles
    for (var i = 0; i < game.height; i++) {
        for (var j = 0; j < game.width; j++) {

            if (gamedata2d[i][j].halfgrown) {
                gamedata2d[i][j].halfgrown = false;
            }
        }
    }
    //check for good words.

    ////////////////check horzontally then vertically
    numLeft = 0
    numRight = 0
    x = endPos[0]
    while (x > 0) {
        x--;
        if (!gamedata2d[endPos[1]][x].letter) {
            break;
        }
        numLeft++
    }
    x = endPos[0]
    while (x < game.width - 1) {
        x++;
        if (!gamedata2d[endPos[1]][x].letter) {
            break;
        }
        numRight++
    }
    startlen = numRight + numLeft + 1
    maxlen = startlen

    //try all lengths down to 3//EDIT difficulty 2 3 or 4
    //
    //drag leftStart and rightStart alongto consider all possibilities
    hfinder:
        while (startlen >= difficulty ) {
            //try options
            //go as far left as pos while still including endPos[0]
            leftStart = endPos[0]
            for (var i = 0; i < startlen - 1 && leftStart - 1 >= 0; i++) {
                if (!gamedata2d[endPos[1]][leftStart - 1].letter) {
                    break;
                }
                leftStart--
            }
            rightStart = leftStart + startlen -1
            //consider all options from leftStart
            iterationnumber = (maxlen - startlen) + 1

            for (; leftStart <= endPos[0] &&  rightStart <= numRight +endPos[0]; leftStart++,rightStart++) {



                //take startlen characters starting at leftStart+i
                possibleword = ""
                for (var j = leftStart; j <= rightStart; j++) {
                    possibleword += gamedata2d[endPos[1]][j].letter
                }
                possibleword = possibleword.toLowerCase();
                
                if (words[possibleword]) {
                    //scoreword
                	matches = 1;
                	scores = scoreWord(possibleword)
                    game.score += scores;
                    removeTheHword=true
                    showScore(possibleword, scoreWord(possibleword))
                    break hfinder;
                }
                else if (words[possibleword.reverse()]) {
                    //scoreword
                	matches = 1;
                	scores = scoreWord(possibleword)
                    game.score += scores;
                    removeTheHword=true
                    showScore(possibleword.reverse(), scoreWord(possibleword))
                    break hfinder;
                }
            }

            startlen--
        }
    ////////// Vertical check
    numTop = 0
    numBottom = 0
    y = endPos[1]
    while (y > 0) {
        y--;
        if (!gamedata2d[y][endPos[0]].letter) {
            break;
        }
        numTop++
    }
    y = endPos[1]
    while (y < game.height - 1) {
        y++;
        if (!gamedata2d[y][endPos[0]].letter) {
            break;
        }
        numBottom++
    }
    startlen = numBottom + numTop + 1
    maxlen = startlen

    //try all lengths down to 3
    //
    //drag topStart and bottomStart alongto consider all possibilities
    vfinder:
        while (startlen >= difficulty ) {
            //try options
            //go as far left as pos while still including endPos[0]
            topStart = endPos[1]
            for (var i = 0; i < startlen - 1 && topStart - 1 >= 0; i++) {
                if (!gamedata2d[topStart - 1][endPos[0]].letter) {
                    break;
                }
                topStart--
            }
            bottomStart = topStart + startlen -1
            //consider all options from topStart
            iterationnumber = (maxlen - startlen) + 1

            for (; topStart <= endPos[1] &&  bottomStart <= numBottom +endPos[1]; topStart++,bottomStart++) {



                possibleword = ""
                for (var j = topStart; j <= bottomStart; j++) {
                    possibleword += gamedata2d[j][endPos[0]].letter
                }
                possibleword = possibleword.toLowerCase()
                if (words[possibleword]) {
                    //scoreword
                	matches++;
                	scores += scoreWord(possibleword)
                    game.score += scoreWord(possibleword)
                    removeVword(topStart, bottomStart)
                    showScore(possibleword, scoreWord(possibleword))
                    break vfinder;
                }
                else if (words[possibleword.reverse()]) {
                    //scoreword
                	matches++;
                	scores += scoreWord(possibleword);
                    game.score += scoreWord(possibleword)
                    removeVword(topStart, bottomStart)
                    showScore(possibleword.reverse(), scoreWord(possibleword))
                    break vfinder;
                }
            }

            startlen--
        }

    if(removeTheHword){
        removeHword(leftStart, rightStart)
    }
    
    if(matches == 2){
    	showDouble();
    	game.score += scores;
    }
    if(matches == 0){
        comboCounter = 0;
    }
    else{
        comboCounter++;
        if(comboCounter >= 2){
            showCombo();
        }
    }

    //deselect / unselect
    gamedata2d[endPos[1]][endPos[0]].selected = false;
    selectedXpos = -1;
    selectedYpos = -1;

    //look for 3 new spots
    numspaces = 0
    for (var i = 0; i < game.height; i++) {
        for (var j = 0; j < game.width; j++) {

            if (!gamedata2d[i][j].letter && !gamedata2d[i][j].blocked) {
                numspaces++
            }
        }
    }
    //if 0 or less apaces then you loose
    if (numspaces <= 0) {
        gameover()
    }
    //generate random 3 letter places
    growers = []
    for (var i = 0; i < numspaces - game.growth_rate; i++) {
        growers.push({'selected': false})
    }

    growers.push({letter: getRandomLetter(), 'halfgrown': 'halfgrown', 'selected': false})
    growers.push({letter: getRandomLetter(), 'halfgrown': 'halfgrown', 'selected': false})
    growers.push({letter: getRandomLetter(), 'halfgrown': 'halfgrown', 'selected': false})
    growers.shuffle()
    //place them
    currpos = 0
    for (var i = 0; i < game.height; i++) {
        for (var j = 0; j < game.width; j++) {

            if (!gamedata2d[i][j].letter && !gamedata2d[i][j].blocked) {
                if (growers[currpos].letter) {
                    gamedata2d[i][j] = growers[currpos]
                }
                currpos++
            }
        }
    }
}
function gameover(){
    var isHighScore = saveHighScore()
    if(typeof GAMESAPI === 'object') {
        GAMESAPI.endGameSession(
           function(response) {
               // success callback.  response.statusCode == 200
           },
           function(response) {
               // error handler callback.  response.statusCode != 200
           }
       );
    }
    var congratsMessage = 'Congratulations! Your Score: ' + game.score + '!';
    if(isHighScore){
        congratsMessage = 'Thats A New Best! Your New High Score: ' + game.score + '!';
    }
	modal.open({content: '<div id="changedifficulty">'+
		'<p class="lead">Smashed It!</p>'+
		'<p class="lead">' + congratsMessage + '</p>'+
    	'<div style="float:left"><button class="btn btn-large btn-primary" onclick="postHighScoreToFacebook()">Post High Score To Facebook!</button></div>'+
    	'<div style="float:right"><button class="btn btn-large btn-success" onclick="changeDifficulty('+ difficulty +')" type="button">Play Again!</button></div>'+
    	'<div class="clear"></div>'+
	'</div>'});
}
function updateAchievements() {
    if(! achievements.medium && game.score >= 5000){
        achievements.medium = true;
        saveAchievement(1);
        
        modal.open({content: '<div id="changedifficulty">'+
            '<p class="lead">Congratulations!!</p>'+
            '<p class="lead">You Have Unlocked Medium Difficulty!</p>'+
            '<p class="lead">Only Words With 3 or More Letters on Medium!</p>'+
            '<button class="btn btn-large btn-primary" onclick="postAchievementToFacebook(MEDIUM)" style="margin:20px;">Post Achievement To Facebook!</button>'+
            '<div style="float:left"><button class="btn btn-large btn-danger" onclick="modal.close()" type="button">Keep Playing On Easy!</button></div>'+
            '<div style="float:right"><button class="btn btn-large btn-danger" onclick="changeDifficulty(MEDIUM)" type="button">Play On Medium!</button></div>'+
            '<div class="clear"></div>'+
        '</div>'});
        
    }
    if(! achievements.hard && game.score >= 5000 && difficulty == MEDIUM){
        achievements.hard = true;
        saveAchievement(2);
        modal.open({content: '<div id="changedifficulty">'+
            '<p class="lead">Congratulations!!</p>'+
            '<p class="lead">You Have Unlocked Hard Difficulty!</p>'+
            '<p class="lead">Only Words With 4 or More Letters on Hard!</p>'+
            '<button class="btn btn-large btn-primary" onclick="postAchievementToFacebook(HARD)" style="margin:20px;">Post Achievement To Facebook!</button>'+
            '<div style="float:left"><button class="btn btn-large btn-danger" onclick="modal.close()" type="button">Keep Playing On Medium!</button></div>'+
            '<div style="float:right"><button class="btn btn-large btn-danger" onclick="changeDifficulty(HARD)" type="button">Play On Hard!</button></div>'+
            '<div class="clear"></div>'+
        '</div>'});
        
    }
}
var iteration=0;
function showScore(word, score) {
    iteration++
    iteration = iteration%4;
    word = word.toUpperCase()
    $('#showscore'+iteration+' button').empty()
    $('#showscore'+iteration).html("<button class=\"btn btn-large btn-warning\" type=\"button\">" + word + ". " + score + " Points!</button>")
    var definiteit=iteration
    $('#showscore'+iteration+' button').animate({top: '-=100px',opacity:0},4000,function(){
        $('#showscore'+definiteit+' button').css({display:'none'})
    })
    updateAchievements();
    //"<button class=\"" + btnclass + "\" onclick=\"selectWord(this)\" type=\"button\">" + gd.letter + "</button>"
}
function showDouble() {
    iteration++
    iteration = iteration%4;
    $('#showscore'+iteration+' button').empty()
    $('#showscore'+iteration+' button').replaceWith("<button class=\"btn btn-large btn-success\" type=\"button\">Double Points!</button>")
    var definiteit=iteration
    $('#showscore'+iteration+' button').animate({top: '-=100px',opacity:0},4000,function(){
        $('#showscore'+definiteit+' button').css({display:'none'})
    })
}
function showCombo(){

    var bonusPoints = comboCounter*10;

    game.score += bonusPoints;
    iteration++
    iteration = iteration%4;
    $('#showscore'+iteration+' button').empty()
    $('#showscore'+iteration+' button').replaceWith("<button class=\"btn btn-large btn-success\" type=\"button\">"+comboCounter+"X Combo "+bonusPoints+" Points!</button>")
    var definiteit=iteration
    $('#showscore'+iteration+' button').animate({top: '-=100px',opacity:0},4000,function(){
        $('#showscore'+definiteit+' button').css({display:'none'})
    })
}
function unlock(x,y) {
    var cell = $('#' + y + '-' + x);
    cell.animate({backgroundColor: 'none'}, 750, function(){
        cell.css({backgroundColor:'none'})
        cell.html('<div id="'+y+'-'+x+'" onclick="moveTo(this)" class="btn btn-large btn-link" style="height:26px;" ></div>');
        num_blocked--;
    });
}
function update() {
    function renderGameData(gd,i,j) {
        if(gd.blocked) {
            return ''
        }
        if(gd.locked) {
            return '<span class="icon-lock"></span>'
        }
        var cssclass = ''
        var val = '<div id="'+i+'-'+j+'" onclick="moveTo(this)" class="btn btn-large btn-link" style="height:26px;" ></div>'
        var btnclass = 'btn btn-large btn-danger'

        if (gd.selected) {
            btnclass = 'btn btn-large btn-warning'
        }
        if (gd.letter) {
            val = '<button id="'+i+'-'+j+'" class="' + btnclass + "\" onclick=\"selectWord(this)\" type=\"button\">" + gd.letter + "</button>"
        }
        if (gd.halfgrown) {
            val = '<div id="'+i+'-'+j+'" onclick="moveTo(this)" class="btn-link swap" style="height: 36px;padding-top: 10px;" >'+
            '<button class="btn btn-small disabled btn-danger swap grower" type="button" >' + gd.letter + "</button></div>"
        }
        return val
    }

    domtable = []
    for (var i = 0; i < game.height; i++) {
        domtable.push("<tr>");
        for (var j = 0; j < game.width; j++) {
            var gmedta = gamedata2d[i][j];
            if(gmedta.blocked) {
                domtable.push('<td id="' + i + '-' + j+ '" style="background-color:white">');
            }
            else {
                domtable.push("<td>");
            }
            domtable.push(renderGameData(gmedta,i,j));
            domtable.push("</td>");
        }
        domtable.push("</tr>");
    }

    $(document).ready(function () {
        $('#gametable').empty()
        $('#gametable').replaceWith(domtable.join(''))
        //document.getElementById("score").firstChild.innerHTML = "Score: "+game.score
        $('#score button').html("Score: "+game.score)
    })
}

/**
 *
 *
 * @param start [x,y] pair the starting state
 * returns false or a path through the game grid
 */
function getpath(start, goal) {
    //seen nodes and back pointers
    var seen = [];
    var previous = [];
    for (var i = 0; i < game.height; i++) {
        seen.push([])
        previous.push([])
        for (var j = 0; j < game.width; j++) {
            seen[i].push(false)
            previous[i].push([])
        }
    }
    seen[start[1]][start[0]] = true;

    var queue = [start],
        next = start;
    while (next) {
        xpos = next[0];
        ypos = next[1];
        //find possible moves
        var possibleMoves = []
        //can go left if theres no grown letter
        if (xpos > 0 && (!gamedata2d[ypos][xpos - 1].letter || gamedata2d[ypos][xpos - 1].halfgrown) && !seen[ypos][xpos - 1] && !gamedata2d[ypos][xpos - 1].blocked) {
            seen[ypos][xpos - 1] = true;
            previous[ypos][xpos - 1] = [xpos, ypos];
            possibleMoves.push([xpos - 1, ypos])


        }
        //can go up if theres no grown letter
        if (ypos > 0 && (!gamedata2d[ypos - 1][xpos].letter || gamedata2d[ypos - 1][xpos].halfgrown) && !seen[ypos - 1][xpos] && !gamedata2d[ypos - 1][xpos].blocked) {
            seen[ypos - 1][xpos] = true;
            previous[ypos - 1][xpos] = [xpos, ypos];
            possibleMoves.push([xpos, ypos - 1])

        }
        //can go right if theres no grown letter
        if (xpos < game.width - 1 && (!gamedata2d[ypos][xpos + 1].letter || gamedata2d[ypos][xpos + 1].halfgrown) && !seen[ypos][xpos + 1] && !gamedata2d[ypos][xpos + 1].blocked) {
            seen[ypos][xpos + 1] = true;
            previous[ypos][xpos + 1] = [xpos, ypos];
            possibleMoves.push([xpos + 1, ypos])

        }
        //can go down if theres no grown letter
        if (ypos < game.height - 1 && (!gamedata2d[ypos + 1][xpos].letter || gamedata2d[ypos + 1][xpos].halfgrown) && !seen[ypos + 1][xpos] && !gamedata2d[ypos + 1][xpos].blocked) {
            seen[ypos + 1][xpos] = true;
            previous[ypos + 1][xpos] = [xpos, ypos];
            possibleMoves.push([xpos, ypos + 1])

        }

        if (possibleMoves.length != 0) {
            $.each(possibleMoves, function (i, possibleMove) {
                queue.push(possibleMove);
            });
        }

        //todo use queue.js instead of naiive array shift
        next = queue.shift();
        if (next[0] == goal[0] && next[1] == goal[1]) {
            //we are here use previous to build list of the path
            backtrace = [next]
            current = next
            while (!(current[0] == start[0] && current[1] == start[1])) {
                current = previous[current[1]][current[0]]
                backtrace.push(current)
            }
            return backtrace;
        }
    }
}

// high scores service
function saveHighScore(){
    if(window.FB){
        FB.api('/me/scores/', 'post', { score: game.score }, function(response) {
            if(response.error){
                console.log(response.error);
            }
            else{
                console.log("Score posted to Facebook");
            }
        });
    }

    if(typeof GAMESAPI === 'object') {
        GAMESAPI.postScore(game.score,function(){},function(){});
    }

	$.ajax( {
        "url":  "/scores",
        "data": {"score":game.score, "difficulty":difficulty, "timedMode":timedMode},
        "success": function (text) {

        },
        "type": "GET",
        "cache": false,
        "error": function (xhr, error, thrown) {
            if ( error == "parsererror" ) {
                console.log( "JSON data from "+
                    "server could not be parsed. This is caused by a JSON formatting error." );
            }
        }
    } );
    if(difficulty == EASY){
        if(game.score > highscores.easy){
            highscores.easy = game.score
            return true;
        }
    }
    else if (difficulty == MEDIUM) {
        if(game.score > highscores.medium){
            highscores.medium = game.score
            return true;
        }
    }
    else {
        if(game.score > highscores.hard){
            highscores.hard = game.score
            return true;
        }
    }
    return false;
}
function saveAchievement(achievement_number){

    var achievementURLs = Array();
    achievementURLs[0] = "";
    achievementURLs[1] = "http://www.wordsmashing.com/achievement-medium.html";
    achievementURLs[2] = "http://www.wordsmashing.com/achievement-hard.html";

    achievementURLs[2] = "http://www.wordsmashing.com/achievement150.html";
    achievementURLs[3] = "http://www.wordsmashing.com/achievement200.html";
    achievementURLs[4] = "http://www.wordsmashing.com/achievementx3.html";

    $.ajax( {
        "url":  "/achievements",
        "data": {"achievement":achievement_number},
        "success": function (text) {

        },
        "type": "GET",
        "cache": false,
        "error": function (xhr, error, thrown) {
            if ( error == "parsererror" ) {
                console.log( "JSON data from "+
                    "server could not be parsed. This is caused by a JSON formatting error." );
            }
        }
    } );
    if(window.FB)
        FB.api('/me/scores/', 'post', { achievement: achievementURLs[achievement_number] }, function(response) {
            if(response.error){
                console.log(response.error);
            }
            else{
                console.log("Achievement posted");
            }
        });
}
function postHighScoreToFacebook(){
    if(window.FB)
        FB.ui(
            {
                method: 'feed',
                name: 'Word Smashing',
                link: 'http://apps.facebook.com/wordsmashing',
                picture: 'http://www.wordsmashing.com/img/wordsmashing_logo155x100.png',
                caption: 'Got a High Score of ' + game.score + '!',
                description: 'Come play the challenging new word puzzle at WordSmashing.com!'
            },
            function(response) {
                if (response && response.post_id) {
                    //alert('Post was published.');
                } else {
                    //alert('Post was not published.');
                }
            }
        );
}
function postAchievementToFacebook(achievementnumber) {
    if(achievementnumber == MEDIUM) {
        achievementname = 'Medium';
    }
    else if(achievementnumber == HARD) {
        achievementname = 'Hard';
    }
    else {
        return;
    }
    if(window.FB)
        FB.ui(
            {
                method: 'feed',
                name: 'Word Smashing',
                link: 'http://apps.facebook.com/wordsmashing',
                picture: 'http://www.wordsmashing.com/img/wordsmashing_logo155x100.png',
                caption: 'Unlocked ' + achievementname + ' Difficulty on Word Smashing!',
                description: 'Come Play the Challenging new Word Puzzle at WordSmashing.com!'
            },
            function(response) {
                if (response && response.post_id) {
                    //alert('Post was published.');
                } else {
                    //alert('Post was not published.');
                }
            }
        );
}

function showHighScores(){
    if(! highscores.medium){
        highscores.medium = 0;
    }
    if(! highscores.easy){
        highscores.easy = 0;
    }
    if(! highscores.hard){
        highscores.hard = 0;
    }
	modal.open({content: '<div id="highscores-modal">'+
		'<p class="lead">Your High Scores</p>'+
    	'<p class="lead">Easy: ' + highscores.easy + '</p>'+
    	'<p class="lead">Medium: ' + highscores.medium + '</p>'+
    	'<p class="lead">Hard: ' + highscores.hard + '</p>'+
	'</div>'});
}
