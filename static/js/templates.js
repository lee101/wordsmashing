(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/shared/about.jinja2"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"article-theme\">\n\n    <h1>About Word Smashing</h1>\n\n    <p class=\"lead\">Word smashing is a brand new, free online word search puzzle. It offers free addicting fun\n        for the whole family. Be puzzled and build your brain today by playing Word Smashing. </p>\n\n    <p class=\"lead\"><b>Instructions:</b><br/>\n        Make Words for points and to clear space!<br/>\n        Click a letter and click on an empty space to move it there.<br/>\n        You will only be able to move if there is a clear path.<br/>\n        Every turn three new letters will grow into the game.<br/>\n        Its game over when the board is filled with letters!<br/>\n        Get two words in one turn and get combos by making words every turn for bonus points.<br/>\n        On Easy You can make words with 2 or more letters.<br/>\n        On Medium You can make words with 3 or more letters.<br/>\n        On Hard You can only make words with 4 or more letters!<br/>\n        Some place names and peoples names do not count as words.\n    </p>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/shared/contact.jinja2"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"article-theme\">\n\n    <h1>Contact Word Smashing</h1>\n\n    <p class=\"lead\">Contact Word Smashing by email: <a href=\"mailto:lee.penkman@wordsmashing.com\"\n                                                       title=\"contact word smashing\">lee.penkman@wordsmashing.com</a>\n    </p>\n\n    <p class=\"lead\">Word smashing is a free online word search puzzle fun for the whole family!</p>\n</div>\n";
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
output += "\n            <a class=\"footer__link\" href=\"/privacy\" title=\"Privacy Policy\">Privacy Policy</a>\n        ";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/shared/game.jinja2"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"mm-logo\">\n    <div class=\"mm-level-controls\">\n        <div class=\"mm-end-condition\">\n            <p>Time: <span class=\"gameon-clock\"></span></p>\n        </div>\n        <div class=\"mm-volume\">\n\n        </div>\n        <div class=\"clear\"></div>\n        <div class=\"mm-starbar\">\n\n        </div>\n    </div>\n</div>\n<div class=\"mm-level gameon-board gameon-board--small-tiles\">\n\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/shared/privacy.jinja2"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"article-theme\">\n\n    <h1>Privacy policy</h1>\n\n    <strong>What information do we collect?</strong><br>\n    <br>\n\n    <p style=\"margin-left:15px\">\n        Google, as a third party vendor, uses cookies to serve ads on your site. Google's\n        use of the DART cookie enables it to serve ads to your users based on their visit\n        to your sites and other sites on the Internet. Users may opt out of the use of the\n        DART cookie by visiting the Google ad and content network privacy policy..\n    </p><br>\n    <br>\n    <strong>What do we use your information for?</strong>\n    <br>\n    <br>\n\n    <p style=\"margin-left:15px\">\n        Any of the information we collect from you may be used in one of the following ways:\n        <br>\n        <br>\n        To personalize your experience<br>\n        (your information helps us to better respond to your individual needs)<br>\n        <br>\n        To improve our website<br>\n        (we continually strive to improve our website offerings based on the information\n        and feedback we receive from you)<br></p>\n    <br>\n    <strong>Do we use cookies?</strong>\n    <br>\n    <br>\n\n    <p style=\"margin-left:15px\">\n        Yes (Cookies are small files that a site or its service provider transfers to your\n        computers hard drive through your Web browser (if you allow) that enables the sites\n        or service providers systems to recognize your browser and capture and remember\n        certain information<br>\n        <br>\n        We use cookies to compile aggregate data about site traffic and site interaction\n        so that we can offer better site experiences and tools in the future. We may contract\n        with third-party service providers to assist us in better understanding our site\n        visitors. These service providers are not permitted to use the information collected\n        on our behalf except to help us conduct and improve our business.<br></p>\n    <br>\n    <strong>Do we disclose any information to outside parties?</strong>\n    <br>\n    <br>\n\n    <p style=\"margin-left:15px\">\n        We do not sell, trade, or otherwise transfer to outside parties your personally\n        identifiable information. This does not include trusted third parties who assist\n        us in operating our website, conducting our business, or servicing you, so long\n        as those parties agree to keep this information confidential. We may also release\n        your information when we believe release is appropriate to comply with the law,\n        enforce our site policies, or protect ours or others rights, property, or safety.\n        However, non-personally identifiable visitor information may be provided to other\n        parties for marketing, advertising, or other uses.<br></p>\n    <br>\n    <strong>Third party links</strong>\n    <br>\n    <br>\n\n    <p style=\"margin-left:15px\">\n        Occasionally, at our discretion, we may include or offer third party products or\n        services on our website. These third party sites have separate and independent privacy\n        policies. We therefore have no responsibility or liability for the content and activities\n        of these linked sites. Nonetheless, we seek to protect the integrity of our site\n        and welcome any feedback about these sites.<br></p>\n    <br>\n    <strong>California Online Privacy Protection Act Compliance</strong><br>\n    <br>\n\n    <p style=\"margin-left:15px\">\n        Because we value your privacy we have taken the necessary precautions to be in compliance\n        with the California Online Privacy Protection Act. We therefore will not distribute\n        your personal information to outside parties without your consent.<br></p>\n    <br>\n    <strong>Childrens Online Privacy Protection Act Compliance</strong>\n    <br>\n    <br>\n\n    <p style=\"margin-left:15px\">\n        We are in compliance with the requirements of COPPA (Childrens Online Privacy Protection\n        Act), we do not collect any information from anyone under 13 years of age. Our website,\n        products and services are all directed to people who are at least 13 years old or\n        older.<br></p>\n    <br>\n    <strong>Terms and Conditions</strong>\n    <br>\n    <br>\n\n    <p style=\"margin-left:15px\">\n        Please also visit our Terms and Conditions section establishing the use, disclaimers,\n        and limitations of liability governing the use of our website at <a href=\"/terms\">\n        http://www.wordsmashing.com/terms</a><br></p>\n    <br>\n    <strong>Your Consent</strong>\n    <br>\n    <br>\n\n    <p style=\"margin-left:15px\">\n        By using our site, you consent to our online privacy policy.<br></p>\n    <br>\n    <strong>Changes to our Privacy Policy</strong>\n    <br>\n    <br>\n\n    <p style=\"margin-left:15px\">\n        If we decide to change our privacy policy, we will post those changes on this page.\n        <br>\n        <br>\n        This policy was last modified on 20/05/2013</p>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/shared/terms.jinja2"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"article-theme\">\n\n    <h1>Word Smashing Terms and Conditions</h1>\n    <br>\n\n    <p>Using this website you are agreeing to comply with and be bound by the following terms and conditions of\n        use, which together with our privacy policy govern COMPANY’s relationship with you in relation to this\n        website.The term ‘COMPANY’ or ‘us’ or ‘we’ refers to the owner of the website. The term ‘you’ refers to\n        the user or viewer of our website.The use of this website is subject to the following terms of use:</p>\n    <ul>\n        <li>The content of the pages of this website is for your general information and use only. It is subject\n            to change without notice.\n        </li>\n        <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness,\n            performance, completeness or suitability of the information and materials found or offered on this\n            website for any particular purpose. You acknowledge that such information and materials may contain\n            inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the\n            fullest extent permitted by law.\n        </li>\n        <li>Your use of any information or materials on this website is entirely at your own risk, for which we\n            shall not be liable. It shall be your own responsibility to ensure that any products, services or\n            information available through this website meet your specific requirements.\n        </li>\n        <li>This website contains material which is owned by or licensed to us. This material includes, but is\n            not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other\n            than in accordance with the copyright notice, which forms part of these terms and conditions.\n        </li>\n        <li>All trade marks reproduced in this website which are not the property of, or licensed to, the\n            operator are acknowledged on the website.\n        </li>\n        <li>Unauthorised use of this website may give rise to a claim for damages and/or be a criminal\n            offence.\n        </li>\n        <li>From time to time this website may also include links to other websites. These links are provided\n            for your convenience to provide further information. They do not signify that we endorse the\n            website(s). We have no responsibility for the content of the linked website(s).\n        </li>\n        <li>You may not create a link to this website from another website or document without COMPANY’s prior\n            written consent.\n        </li>\n        <li>Your use of this website and any dispute arising out of such use of the website is subject to the\n            laws of New Zealand.\n        </li>\n    </ul>\n</div>\n";
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
