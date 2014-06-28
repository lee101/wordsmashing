(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/shared/campaign.jinja2"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div id=\"instructions\" style=\"display: none\">\n    <h1>Pick A Level</h1>\n\n    <p class=\"lead\">\n        Play through the Word Smashing campaign in any difficulty!<br/>\n        New boards and smashable locks!\n    </p>\n</div>\n<div class=\"ws-main-btn-container\">\n    <button type=\"button\" class=\"ws-main-btn gameon-btn-hg btn btn-success btn-lg\"\n            onclick=\"APP.goto('/campaign/easy')\">Easy\n    </button>\n</div>\n<div class=\"ws-main-btn-container\">\n    <button type=\"button\" class=\"ws-main-btn gameon-btn-hg btn btn-success btn-lg\"\n            onclick=\"APP.goto('/campaign/medium')\"\n            disabled=\"disabled\"><span\n            class=\"glyphicon glyphicon-lock\"></span>Medium\n    </button>\n</div>\n<div class=\"ws-main-btn-container\">\n    <button type=\"button\" class=\"ws-main-btn gameon-btn-hg btn btn-success btn-lg\"\n            onclick=\"APP.goto('/campaign/hard')\"\n            disabled=\"disabled\"><span\n            class=\"glyphicon glyphicon-lock\"></span>Hard\n    </button>\n</div>\n<div class=\"ws-main-btn-container\">\n    <button type=\"button\" class=\"ws-main-btn gameon-btn-hg btn btn-success btn-lg\"\n            onclick=\"APP.goto('/campaign/expert')\"\n            disabled=\"disabled\"><span\n            class=\"glyphicon glyphicon-lock\"></span>Expert\n    </button>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/shared/footer.jinja2"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"footer\">\n    <p>\n        ";
if("/contact" == runtime.contextOrFrameLookup(context, frame, "path")) {
output += "\n            <span>Contact</span>\n        ";
;
}
else {
output += "\n            <a class=\"footer__link\" href=\"/contact\" title=\"Contact Us\">Contact</a>\n        ";
;
}
output += "\n        ";
if("/about" == runtime.contextOrFrameLookup(context, frame, "path")) {
output += "\n            <span>About Us</span>\n        ";
;
}
else {
output += "\n            <a class=\"footer__link\" href=\"/about\" title=\"About Word Smashing\">About Us</a>\n        ";
;
}
output += "\n        ";
if("/terms" == runtime.contextOrFrameLookup(context, frame, "path")) {
output += "\n            <span>Terms &amp; Conditions</span>\n        ";
;
}
else {
output += "\n            <a class=\"footer__link\" href=\"/terms\" title=\"Terms &amp; Conditions\">Terms &amp; Conditions</a>\n        ";
;
}
output += "\n        ";
if("/privacy-policy" == runtime.contextOrFrameLookup(context, frame, "path")) {
output += "\n            <span>Privacy Policy</span>\n        ";
;
}
else {
output += "\n            <a class=\"footer__link\" href=\"/privacy-policy\" title=\"Privacy Policy\">Privacy Policy</a>\n        ";
;
}
output += "\n\n        <span>© 2013 <a class=\"footer__link\" href=\"http://www.addictingwordgames.com\" title=\"Addicting Word Games\"\n                        target=\"_blank\">Addicting Word Games</a></span>\n        <a href=\"http://www.facebook.com/WordSmashing\" title=\"Word Smashing on Facebook\" target=\"_blank\">\n            <img src=\"/static/img/facebook.jpg\" alt=\"Word Smashing on Facebook\" width=\"144px\" height=\"44px\">\n        </a>\n\n    <div class=\"g-plus\" data-href=\"//plus.google.com/116949277834973226564\" data-rel=\"publisher\"></div>\n\n    <!-- Place this tag after the last badge tag. -->\n    <script type=\"text/javascript\">\n        (function () {\n            var po = document.createElement('script');\n            po.type = 'text/javascript';\n            po.async = true;\n            po.src = 'https://apis.google.com/js/plusone.js';\n            var s = document.getElementsByTagName('script')[0];\n            s.parentNode.insertBefore(po, s);\n        })();\n    </script>\n    <br/>\n    <a href=\"https://twitter.com/Wordsmashing\" class=\"twitter-follow-button\" data-show-count=\"false\"\n       data-size=\"large\">Follow @Wordsmashing</a>\n    <script>!function (d, s, id) {\n        var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';\n        if (!d.getElementById(id)) {\n            js = d.createElement(s);\n            js.id = id;\n            js.src = p + '://platform.twitter.com/widgets.js';\n            fjs.parentNode.insertBefore(js, fjs);\n        }\n    }(document, 'script', 'twitter-wjs');</script>\n    </p>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/shared/header.jinja2"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"ws-header\">\n    ";
if(env.getFilter("length").call(context, runtime.contextOrFrameLookup(context, frame, "path")) > 1) {
output += "\n        <div class=\"ws-header--item\">&nbsp;\n            <button type=\"button\" class=\"back-btn gameon-btn-hg btn btn-danger btn-lg\" onclick=\"return APP.stepBack()\">\n                <i\n                        class=\"fa fa-arrow-left\"></i></button>\n\n        </div>\n    ";
;
}
else {
output += "\n        <div class=\"ws-header--item\">&nbsp;\n            <button type=\"button\" class=\"back-btn gameon-btn-hg btn btn-danger btn-lg\" disabled=\"disabled\">\n                <i\n                        class=\"fa fa-arrow-left\"></i></button>\n\n        </div>\n    ";
;
}
output += "\n    <a href=\"/\" title=\"Word Smashing Word Puzzle\" class=\"ws-header--item\">\n        <img class=\"gameon-hidden-xs\" src=\"/static/img/wordsmashing_logo.png\" alt=\"Word Smashing\" title=\"Word Smashing\" width=\"250\" height=\"184\" />\n        <img class=\"gameon-visible-xs\" src=\"/static/img/wordsmashing_icon60.png\" alt=\"Word Smashing\" title=\"Word Smashing\" width=\"60\" height=\"60\" />\n    </a>\n\n    <div class=\"ws-header--item\">\n        <button type=\"button\" class=\"gameon-btn-hg btn btn-danger btn-lg\">Login</button>\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/shared/levels.jinja2"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"mm-levels gameon-board\">\n\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/shared/start.jinja2"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div id=\"instructions\" style=\"display:none\">\n    <h1 style=\"display:none\">Word Smashing</h1>\n\n    <p class=\"lead\" style=\"display:none\">Word smashing is a free online word search puzzle.</p>\n\n    <p class=\"lead\"><b>Instructions:</b><br/>\n        Make words! lots of words! two at once or heaps in a row for bonus points!<br/>\n        Get words up, down, forward and backwards!<br/>\n        To move, click a letter and click a space!<br/>\n        You can move if there's a clear path!<br/>\n        Each turn 3 more letters appear, when the board fills up its game over!<br/>\n        Some people &amp; place names don't count!<br/>\n    </p>\n</div>\n\n<div class=\"ws-main-content\">\n\n    <div class=\"ws-main-btn-container\">\n        <a class=\"ws-main-btn btn btn-large btn-success gameon-btn-hg\" href=\"/campaign\">Play Now!</a>\n    </div>\n    <div class=\"ws-main-btn-container\">\n        <a class=\"ws-main-btn btn btn-large btn-success gameon-btn-hg\" href=\"/classic\">Classic</a>\n    </div>\n    <div class=\"ws-main-btn-container\">\n        <a class=\"ws-main-btn btn btn-large btn-success gameon-btn-hg\" href=\"/versus\">VS</a>\n    </div>\n    <div class=\"ws-main-btn-container\">\n        <a class=\"ws-main-btn btn btn-large btn-success gameon-btn-hg\" href=\"/learn-english\">Learn English</a>\n    </div>\n    <div class=\"ws-main-btn-container\">\n        <button class=\"ws-help-btn btn btn-large btn-danger gameon-btn-hg\" type=\"button\">?</button>\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
