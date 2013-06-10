/*jslint browser: true, nomen: true*/
/*globals requirejs, DEBUG_MODE:true*/

DEBUG_MODE = true;

// TODO this is duplicative with the settings at languagelearning.build.js,
// needs to be DRY'd out.
requirejs.config({

    paths: {
        'models': 'models',
        'collections': 'collections',
        'views': 'views',
        'fixtures': 'fixtures',
        'templates': '../templates',
        'backbone': 'vendor/backbone',
        'jquery': 'vendor/jquery-1.9.1',
        'json2': 'vendor/json2',
        'mustache': 'vendor/mustache',
        'text': 'vendor/text',
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
    'routers/languagelearning',
    'utils/ajaxStreaming'
], function ($, _, backbone, json, LanguageLearningRouter) {
    "use strict";

    // TODO would be better to use fake timers and keep animations during
    // testing, but recent jQuery/Sinon doesn't seem to cooperate.
    if (window.mochaPhantomJS) {
        $.fx.off = true;
    }

    $(document).ready(function () {
        var router = new LanguageLearningRouter();

        backbone.history.start({
            pushState: true
        });
    });
});
