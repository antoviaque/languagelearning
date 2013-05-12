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
    'models/definitions',
    'views/searchBox',
    'views/definitions'
], function ($, _, backbone, json, tracekit, DefinitionsModel, SearchBoxView,
             DefinitionsView) {
    "use strict";

    $(document).ready(function () {
        var searchboxEl = $('div#searchbox').get(0),
            searchBoxView = new SearchBoxView({
                el: searchboxEl
            }),
            definitionsModel = new DefinitionsModel({
                word: decodeURIComponent(window.location.search.substring(3)), // TODO via router
                language: 'de' // TODO not hardcoded
            }),
            definitionsEl = $('#definitions').get(0),
            definitionsView = new DefinitionsView({
                el: definitionsEl,
                model: definitionsModel
            });
            searchBoxView.render();
            definitionsModel.fetch();
    });
});
