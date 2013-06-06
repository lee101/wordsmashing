/**
 * Created with PyCharm.
 * User: user-000
 * Date: 1/04/13
 * Time: 10:49 PM
 * To change this template use File | Settings | File Templates.
 */
/* private */
var word_frequencies = {
    'E': 12.02,
    'T': 9.10,
    'A': 8.12,
    'O': 7.68,
    'I': 7.31,
    'N': 6.95,
    'S': 6.28,
    'R': 6.02,
    'H': 5.92,
    'D': 4.32,
    'L': 3.98,
    'U': 2.88,
    'C': 2.71,
    'M': 2.61,
    'F': 2.30,
    'Y': 2.11,
    'W': 2.09,
    'G': 2.03,
    'P': 1.82,
    'B': 1.49,
    'V': 1.11,
    'K': 0.69,
    'X': 0.17,
    'Q': 0.11,
    'J': 0.10,
    'Z': 0.07};
Object.keys = Object.keys || function(o) {
    var result = [];
    for(var name in o) {
        if (o.hasOwnProperty(name))
            result.push(name);
    }
    return result;
};
function cdf(hist) {
    var keys = Object.keys(hist)
    for (var i = 1; i < keys.length; i++) {
        hist[keys[i]] = hist[keys[i]] + hist[keys[i - 1]]
    }
    return hist;
}
word_cdf = cdf(word_frequencies);
function getRandomLetter() {
    var position = Math.random();
    var keys = Object.keys(word_cdf)
    for (var i = 0; i < keys.length; i++) {
        if (position <= word_cdf[keys[i]]/100) {
            return keys[i];
        }
    }
}
Array.prototype.shuffle = function () {
    for (var i = this.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = this[i];
        this[i] = this[j];
        this[j] = tmp;
    }

    return this;
}
function scoreWord(word){
    var score=0
    for(var i=0;i<word.length;i++){
        score+=Math.ceil((24/word_frequencies[word[i].toUpperCase()])*145)
    }
    return score
}

String.prototype.reverse=function(){return this.split("").reverse().join("");}