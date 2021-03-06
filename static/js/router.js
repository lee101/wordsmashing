(function () {
    "use strict";
    window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};
    APP.routerViews = {};

    APP.goto = function (name) {
        if (APP.game) {
            APP.game.destruct();
        }
        APP.router.navigate(name, {trigger: true});
        return false
    };

    APP.gotoLevel = function (level) {

        if (level.computer_blue_opponent) {
            APP.goto('/versus/1player');
            return false;
        }
        else if (level.is_multiplayer) {
            APP.goto('/versus/2player');
            return false;
        }

        //find level idx
        var levelsByDifficulty = fixtures.getLevelsByDifficulty(level.difficulty);
        var levelIdx = 1;
        for (var i = 0; i < levelsByDifficulty.length; i++) {
            if (levelsByDifficulty[i].id == level.id) {
                break;
            }
            levelIdx++;
        }
        APP.goto('/campaign/' + fixtures.difficultyIdToName(level.difficulty) + '/' + levelIdx);
        return false
    };

    APP.gotoLevelSilently = function (level) {
        if (level.computer_blue_opponent) {
            APP.router.versus1player();
            return false;
        }
        else if (level.is_multiplayer) {
            APP.router.versus2player();
            return false;
        }
        else if (level.required_words) {
            APP.router.learnenglishlevelkey(level.urlkey);
            return false
        }

        var levelIdx = fixtures.getLevelIdx(level);
        APP.router.campaigndifficultylevel(fixtures.difficultyIdToName(level.difficulty), levelIdx);
        return false
    };

    APP.stepBack = function () {
        var currrentPath = window.location.hash;
        if (currrentPath == "") {
            currrentPath = window.location.pathname;
        }
        if (currrentPath.length <= 1) {
            APP.goto('/');
        }
        else {
            currrentPath = currrentPath.split('/');
            currrentPath.pop();
            currrentPath = currrentPath.join('/');
            APP.goto(currrentPath);
        }
        return false
    };


    $(document).on('click', 'a:not([data-bypass])', function (e) {
        var href = $(this).prop('href');
        var root = location.protocol + '//' + location.host + '/';
        if (root === href.slice(0, root.length)) {
            e.preventDefault();
            APP.goto(href.slice(root.length));
        }
    });

    APP.gotoLink = function (link) {
        if(gameon.isInIFrame()) {
            return true;
        }
        var href = $(link).prop('href');
        var root = location.protocol + '//' + location.host + '/';
        if (root === href.slice(0, root.length)) {
            APP.goto(href.slice(root.length));
            return false;
        }
    };

    var currentView;

    function animateTo(view) {
        var $mainbody = $('#mainbody');
        var duration = 300;

        $mainbody.fadeOut(duration, function () {
            if (currentView) {
                currentView.close();
            }

            currentView = view;
            if (view.rendersAsync) {
                view.renderCallback = function () {
                    $mainbody.html(view.el);
                    $mainbody.fadeIn(duration, function () {
                        if (typeof specHelpers == 'object') {
                            specHelpers.once();
                        }
                    });
                };
                view.render();
            }
            else {
                $mainbody.html(view.render().el);

                $mainbody.fadeIn(duration, function () {
                    //scroll to top
                    $("html, body").scrollTop(0);
                    if (typeof specHelpers == 'object') {
                        specHelpers.once();
                    }
                });
            }
        });

        //scroll to top
        $("html, body").scrollTop(0);
    }

    APP.refresh = function () {
        APP.footer.path = location.pathname;
        APP.header.path = location.pathname;
        var $headerbody = $('#headerbody');
        var $backBtn = $headerbody.find('#ws-back-btn');
        if ($backBtn.length) {
            $backBtn.html($(APP.header.render().el).find('#ws-back-btn'));
        }
        else {
            $headerbody.html(APP.header.render().el);
        }
        $('#footerbody').html(APP.footer.render().el);
        $.ajax({ url: 'http://platform.twitter.com/widgets.js', dataType: 'script', cache: true});
    };


    APP.currentView = location.pathname;
    function defaultHandler(pathname) {
        return function () {
            var args = arguments;
            if (APP.currentView == pathname && prerenderedPages[APP.currentView]) {
                return;
            }

            APP.currentView = pathname;
            APP.refresh();
            animateTo(new APP.Views[pathname]({args: args}));
        }
    }

    var prerenderedPages = {
        "/": "home",
        '/campaign': 'campaign',
        '/timed': 'timed',
        '/classic': 'classic',
        '/versus': 'versus',

        '/instructions': 'instructions',
        '/learn-english': 'learn-english',
        "/about": "about",
        "/contact": "contact",
        "/terms": "terms",
        "/privacy": "privacy"
    };
    var routes = {};
    $.each(prerenderedPages, function (key, value) {
        routes[key.substring(1)] = value;
    });
    jQuery.extend(routes, {
        //pages needing js rendering
        'versus/1player': 'versus1player',
        'versus/2player': 'versus2player',
        'learn-english/:levelkey': 'learnenglishlevelkey',
        'campaign/:difficulty': 'campaigndifficulty',
        'campaign/:difficulty/:level': 'campaigndifficultylevel'
    });

    var Router = Backbone.Router.extend({
        // Define routes
        'routes': routes,
        'home': defaultHandler('/'),
        'campaign': defaultHandler('/campaign'),
        'campaigndifficulty': defaultHandler('/campaign/:difficulty'),
        'campaigndifficultylevel': defaultHandler('/campaign/:difficulty/:level'),
        'timed': defaultHandler('/timed'),
        'classic': defaultHandler('/classic'),
        'versus': defaultHandler('/versus'),
        'learnenglishlevelkey': defaultHandler('/learn-english/:levelkey'),
        'versus1player': defaultHandler('/versus/1player'),
        'versus2player': defaultHandler('/versus/2player'),
        'instructions': defaultHandler('/instructions'),
        'learn-english': defaultHandler('/learn-english'),
        'contact': defaultHandler('/contact'),
        'about': defaultHandler('/about'),
        'terms': defaultHandler('/terms'),
        'privacy': defaultHandler('/privacy')
    });


    $(document).ready(function () {
        APP.router = new Router();
        APP.header = new APP.Views.Header({path: location.pathname});
        APP.footer = new APP.Views.Footer({path: location.pathname});
        APP.doneLevel = defaultHandler('/done-level');
        Backbone.history.start({
            pushState: true
//            silent: true
        });

        $(document).on('click', '.ws-help-btn', function () {
            var $modal = $('#modal');
            $modal.find('.modal-body').html($('#instructions').html());
            $modal.modal('show');
        });
        function inIframe () {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        }

        if (!inIframe()) {
            window.showPaywall = function () {
                var $modal = $('#modal');
                $modal.find('.modal-body').html("<h4 class=\"mdl-dialog__title lead\">Please support us! Play on <a href=\"https://www.addictingwordgames.com\">AddictingWordGames.com</a></h4>" +
                    "        <div class=\"mdl-dialog__content lead\">" +
                    "            <p>" +
                    "                $7 to buy this game and all 694 Addicting Word Games forever + any future" +
                    "                releases!" +
                    "            </p>" +
                    "        </div>" +
                    "        <div class=\"mdl-dialog__actions\">" +
                    "            <a type=\"button\" class=\"btn btn-danger mdl-button mdl-button--colored mdl-button--accent mdl-js-button mdl-js-ripple-effect closes-modal\" href=\"https://www.addictingwordgames.com/sign-up\" target=\"_blank\">Buy Now</a>" +
                    "        </div>");
                $modal.modal('show');
                window.setTimeout(window.showPaywall, 60 * 1000);
            };
            window.setTimeout(window.showPaywall, 60 * 1000);
        }

    });
}());
