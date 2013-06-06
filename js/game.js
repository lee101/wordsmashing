/**
 * User: user-000
 * Date: 1/04/13
 * Time: 10:37 PM
 * To change this template use File | Settings | File Templates.
 */
var game = {
    'width': 9,
    'height': 9,
    'startwords': 12,
    'growth_rate': 3,
    score: 0
};
var EASY = 2;
var MEDIUM = 3;
var HARD = 4;
var difficulty = EASY;
function changeDifficulty(){
	difficulty++;
	if(difficulty > HARD){
		difficulty = EASY;
	}
	var difficultyText = "Medium";
	if(difficulty == EASY){
		difficultyText = "Easy";
	}
	else if(difficulty == HARD){
		difficultyText = "Hard";
	}
	
	$('#difficulty button').text('Difficulty: ' + difficultyText);
}
var gamedata = []
var gamedata2d = []
currentNumWords = game.startwords + game.growth_rate;
words = {}
jQuery.get('js/words.txt', function (data) {
    wordslist = data.split('\n');
    for (var i = 0; i < wordslist.length; i++) {
        words[wordslist[i]] = 1
    }
});

newGame = function () {
    gamedata = []
    gamedata2d = []
    for (var i = 0; i < game.startwords; i++) {
        gamedata.push({letter: getRandomLetter(), 'selected': false})
    }
    for (var i = 0; i < game.growth_rate; i++) {
        gamedata.push({letter: getRandomLetter(), 'halfgrown': 'halfgrown', 'selected': false})
    }
    //push empty spaces
    var numspaces = game.width * game.height - game.startwords - game.growth_rate
    for (var i = 0; i < numspaces; i++) {
        gamedata.push({'selected': false})
    }
    gamedata.shuffle()

    //wrap into 2d

    for (var i = 0; i < game.height; i++) {
        gamedata2d.push([])
        for (var j = 0; j < game.width; j++) {

            gamedata2d[i].push(gamedata[i * game.height + j])
        }
    }
    //remove score and game over screen
    game.score=0
    $('#showscore1 button').replaceWith('<button style="display: none"></button>')
    update();

}
function getXIndex(imclicked){
    return Number(imclicked.id.split('-')[1])
}
function getYIndex(imclicked){
    return Number(imclicked.id.split('-')[0])
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
    var xPos = getXIndex(imclicked)
    var yPos = getYIndex(imclicked)

    //unselect if its already selected
    if (xPos == selectedXpos && yPos == selectedYpos) {
        gamedata2d[yPos][xPos].selected = false;
        selectedXpos = -1;
        selectedYpos = -1;
        update()
        return;

    }
    //unselect all --- TODO could only unselect one thats selected
    for (var i = 0; i < game.height; i++) {
        for (var j = 0; j < game.width; j++) {
            curr = gamedata2d[i][j].selected = false;
        }
    }
    gamedata2d[yPos][xPos].selected = true;
    selectedXpos = xPos
    selectedYpos = yPos

    //update view
    update();
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
    /*
     for (var i = 0; i < game.startwords; i++) {
     gamedata.push({letter: getRandomLetter(), 'selected': false})
     }
     for (var i = 0; i < game.growth_rate; i++) {
     gamedata.push({letter: getRandomLetter(), 'halfgrown': 'halfgrown', 'selected': false})
     }
     //push empty spaces
     var numspaces = game.width * game.height - game.startwords - game.growth_rate
     for (var i = 0; i < numspaces; i++) {
     gamedata.push({'selected': false})
     }
     gamedata.shuffle()
     */
    //deselect / unselect
    gamedata2d[endPos[1]][endPos[0]].selected = false;
    selectedXpos = -1;
    selectedYpos = -1;

    //look for 3 new spots
    numspaces = 0
    for (var i = 0; i < game.height; i++) {
        for (var j = 0; j < game.width; j++) {

            if (!gamedata2d[i][j].letter) {
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
    for (var i = 0; i < numspaces - 3; i++) {
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

            if (!gamedata2d[i][j].letter) {
                if (growers[currpos].letter) {
                    gamedata2d[i][j] = growers[currpos]
                }
                currpos++
            }
        }
    }
}
function gameover(){
    $('#showscore1 button').replaceWith("<button class=\"btn-large btn-warning\" type=\"button\">Game Over. Your Score: " + game.score + " Points!</button>")
}
var iteration=0;
function showScore(word, score) {
    iteration++
    iteration = iteration%4;
    word = word.toUpperCase()
    $('#showscore'+iteration+' button').empty()
    $('#showscore'+iteration+' button').replaceWith("<button class=\"btn-large btn-warning\" type=\"button\">" + word + ". " + score + " Points!</button>")
    var definiteit=iteration
    $('#showscore'+iteration+' button').animate({top: '-=100px',opacity:0},2500,function(){
        $('#showscore'+definiteit+' button').css({display:'none'})
    })


    //"<button class=\"" + btnclass + "\" onclick=\"selectWord(this)\" type=\"button\">" + gd.letter + "</button>"
}
function showDouble() {
    iteration++
    iteration = iteration%4;
    $('#showscore'+iteration+' button').empty()
    $('#showscore'+iteration+' button').replaceWith("<button class=\"btn-large btn-success\" type=\"button\">Double Points!</button>")
    var definiteit=iteration
    $('#showscore'+iteration+' button').animate({top: '-=100px',opacity:0},2500,function(){
        $('#showscore'+definiteit+' button').css({display:'none'})
    })


    //"<button class=\"" + btnclass + "\" onclick=\"selectWord(this)\" type=\"button\">" + gd.letter + "</button>"
}
function update() {
    function renderGameData(gd,i,j) {
        var cssclass = ''
        var val = '<div id="'+i+'-'+j+'" onclick="moveTo(this)" class="btn-large btn-link" style="height:26px;" ></div>'
        var btnclass = 'btn-large btn-danger'

        if (gd.selected) {
            btnclass = 'btn-large btn-warning'
        }
        if (gd.letter) {
            val = '<button id="'+i+'-'+j+'" class="' + btnclass + "\" onclick=\"selectWord(this)\" type=\"button\">" + gd.letter + "</button>"
        }
        if (gd.halfgrown) {
            val = '<div id="'+i+'-'+j+'" onclick="moveTo(this)" class="btn-link swap" style="height: 36px;padding-top: 10px;" >'+
            '<a class="btn btn-small disabled btn-danger swap" href="#" >' + gd.letter + "</a></div>"
        }
        return val
    }

    domtable = []
    for (var i = 0; i < game.height; i++) {
        domtable.push("<tr>");
        for (var j = 0; j < game.width; j++) {
            domtable.push("<td>");
            domtable.push(renderGameData(gamedata2d[i][j],i,j));
            domtable.push("</td>");
        }
        domtable.push("</tr>");
    }

    $(document).ready(function () {
        $('table').empty()
        $('table').replaceWith(domtable.join(''))
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
        if (xpos > 0 && (!gamedata2d[ypos][xpos - 1].letter || gamedata2d[ypos][xpos - 1].halfgrown) && !seen[ypos][xpos - 1]) {
            seen[ypos][xpos - 1] = true;
            previous[ypos][xpos - 1] = [xpos, ypos];
            possibleMoves.push([xpos - 1, ypos])


        }
        //can go up if theres no grown letter
        if (ypos > 0 && (!gamedata2d[ypos - 1][xpos].letter || gamedata2d[ypos - 1][xpos].halfgrown) && !seen[ypos - 1][xpos]) {
            seen[ypos - 1][xpos] = true;
            previous[ypos - 1][xpos] = [xpos, ypos];
            possibleMoves.push([xpos, ypos - 1])

        }
        //can go right if theres no grown letter
        if (xpos < game.width - 1 && (!gamedata2d[ypos][xpos + 1].letter || gamedata2d[ypos][xpos + 1].halfgrown) && !seen[ypos][xpos + 1]) {
            seen[ypos][xpos + 1] = true;
            previous[ypos][xpos + 1] = [xpos, ypos];
            possibleMoves.push([xpos + 1, ypos])

        }
        //can go down if theres no grown letter
        if (ypos < game.height - 1 && (!gamedata2d[ypos + 1][xpos].letter || gamedata2d[ypos + 1][xpos].halfgrown) && !seen[ypos + 1][xpos]) {
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
	
	$.ajax( {
        "url":  "/scores",
        "data": {"score":game.score},
        "success": function (json) {
            
        },
        "dataType": "json",
        "type": "POST",
        "cache": false,
        "error": function (xhr, error, thrown) {
            if ( error == "parsererror" ) {
                console.log( "JSON data from "+
                    "server could not be parsed. This is caused by a JSON formatting error." );
            }
        }
    } );
}



