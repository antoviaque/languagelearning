/*jslint browser: true, nomen: true*/
/*globals requirejs, DEBUG_MODE:true*/

DEBUG_MODE = true;

requirejs.config({

    paths: {
        'models': 'models',
        'collections': 'collections',
        'views': 'views',
        'templates': '../templates',
        'backbone': 'vendor/backbone',
        'jquery': 'vendor/jquery-1.9.1',
        'json2': 'vendor/json2',
        'mustache': 'vendor/mustache',
        'text': 'vendor/text',
        'tracekit': 'vendor/tracekit',
        'underscore': 'vendor/underscore'
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'json2': {
            exports: 'JSON'
        },
        'jquery': {
            exports: 'jQuery'
        },
        'mustache': {
            exports: 'Mustache'
        },
        'underscore': {
            exports: '_'
        },
        'tracekit': {
            exports: 'TraceKit'
        }
    },

    modules: [
        {
            name: "languagelearning.main"
        }
    ]
});

requirejs([
    'jquery',
    'underscore',
    'backbone',
    'json2',
    'tracekit',
    'views/searchBox'
], function ($, _, backbone, json, tracekit, SearchBoxView) {
    "use strict";

    $(document).ready(function () {
        var $searchbox = $('div#searchbox').get(0),
            searchBoxView = new SearchBoxView({
                el: $searchbox
            });
            searchBoxView.render();
    });
});
