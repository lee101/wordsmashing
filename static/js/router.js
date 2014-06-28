(function () {
    "use strict";
    window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};
    APP.routerViews = {};

    APP.goto = function (name) {
        APP.router.navigate(name, {trigger: true});
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

    var currentView;

    function animateTo(view) {
        var $mainbody = $('#mainbody');
        var duration = 300;

        $mainbody.fadeOut(duration, function () {
            if (currentView) {
                currentView.close();
            }

            currentView = view;
            $mainbody.html(view.render().el);
            $mainbody.fadeIn(duration);
        });

        //scroll to top
        $("html, body").scrollTop(0);
    }

    APP.refresh = function () {
        APP.footer.path = location.pathname;
        APP.header.path = location.pathname;
        $('#headerbody').html(APP.header.render().el);
        $('#footerbody').html(APP.footer.render().el);
    };



    APP.currentView = location.pathname;
    function defaultHandler(pathname) {
        return function () {
            var args = arguments;
            if (APP.currentView == pathname && prerenderedPages[APP.currentView]) {
                return;
            }

            function handle() {
                APP.currentView = pathname;
                APP.refresh();
                animateTo(new APP.Views[pathname]({args: args}));
            }

            handle();
        }
    }

    var prerenderedPages = {
        "/": "home",
        '/campaign': 'campaign',
        '/timed': 'timed',
        '/classic': 'classic',
        '/versus': 'versus',
        '/versus/1player': 'versus/1player',
        '/versus/2player': 'versus/2player',
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
        'campaign/:difficulty': 'campaign/:difficulty'
    });

    var Router = Backbone.Router.extend({
        // Define routes
        'routes': routes,
        'home': defaultHandler('/'),
        'campaign': defaultHandler('/campaign'),
        'campaign/:difficulty': defaultHandler('/campaign/:difficulty'),
        'timed': defaultHandler('/timed'),
        'classic': defaultHandler('/classic'),
        'versus': defaultHandler('/versus'),
        'versus/1player': defaultHandler('/versus/1player'),
        'versus/2player': defaultHandler('/versus/2player'),
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
        Backbone.history.start({
            pushState: true
//            silent: true
        });
    });
}());
