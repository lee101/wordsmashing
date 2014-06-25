(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["campaign"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div id=\"instructions\">\n    <h1>Pick A Level</h1>\n\n    <p class=\"lead\">\n        Play through the Word Smashing campaign in any difficulty!<br/>\n        New boards and smashable locks!\n    </p>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["footer"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"footer\">\n    <p>\n        ";
if(!(lineno = 2, colno = 28, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "url")),"endswith", env.autoesc), "url[\"endswith\"]", ["learn-english"]))) {
output += "\n            <a class=\"footer__link\" href=\"/learn-english\" title=\"Learn English\">Learn English</a>\n        ";
;
}
output += "\n        ";
if("/contact" undefined runtime.contextOrFrameLookup(context, frame, "url")) {
output += "\n            <span>Contact</span>\n        ";
;
}
else {
output += "\n            <a class=\"footer__link\" href=\"/contact\" title=\"Contact Us\">Contact</a>\n        ";
;
}
output += "\n        ";
if("/about" undefined runtime.contextOrFrameLookup(context, frame, "url")) {
output += "\n            <span>About Us</span>\n        ";
;
}
else {
output += "\n            <a class=\"footer__link\" href=\"/about\" title=\"About Word Smashing\">About Us</a>\n        ";
;
}
output += "\n        ";
if("/terms" undefined runtime.contextOrFrameLookup(context, frame, "url")) {
output += "\n            <span>Terms &amp; Conditions</span>\n        ";
;
}
else {
output += "\n            <a class=\"footer__link\" href=\"/terms\" title=\"Terms &amp; Conditions\">Terms &amp; Conditions</a>\n        ";
;
}
output += "\n        ";
if("/privacy-policy" undefined runtime.contextOrFrameLookup(context, frame, "url")) {
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["header"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"ws-logo\">\n    <a href=\"/\" title=\"Word Smashing Word Puzzle\">\n        <img src=\"/static/img/wordsmashing_logo.png\" alt=\"Word Smashing\" title=\"Word Smashing\" width=\"250\" height=\"184\">\n    </a>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["start"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"ws-main-content\">\n\n    <a class=\"ws-play-btn btn btn-large btn-success gameon-btn-hg\" href=\"/campaign\">Play Now!</a>\n    <a class=\"ws-play-btn btn btn-large btn-success gameon-btn-hg\" href=\"/classic\">Classic</a>\n    <a class=\"ws-play-btn btn btn-large btn-success gameon-btn-hg\" href=\"/versus\">VS</a>\n</div>\n";
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
