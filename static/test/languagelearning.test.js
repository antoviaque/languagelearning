/*jslint browser:true*/
/*globals mochaPhantomJS, mocha, DEBUG_MODE:true*/

DEBUG_MODE = true;

requirejs.config({

    baseUrl: '../js',

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
        'underscore': 'vendor/underscore',
        'test': '../test',
        'expect': '../test/vendor/expect',
        'mocha': '../test/vendor/mocha',
        'sinon': '../test/vendor/sinon'
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
        },
        'expect': {
            exports: 'expect'
        },
        'sinon': {
            exports: 'Sinon'
        },
        'mocha': {
            exports: 'mocha',
            init: function() {
                this.mocha.ui('bdd');
                this.mocha.checkLeaks();
                this.mocha.globals(['jQuery*']);
            }
        }
    },

    modules: [
        {
            name: "languagelearning.test"
        }
    ]
});

requirejs([
    'test/adapters/wiktionaryDefinitionProcessors.test',
    'test/adapters/wiktionaryDefinitions.test',
    'test/adapters/search.test'
], function () {
    "use strict";

    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }
});
