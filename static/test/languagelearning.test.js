/*jslint browser:true*/
/*globals mochaPhantomJS, mocha, DEBUG_MODE:true, requirejs*/

DEBUG_MODE = true;

(function () {
    "use strict";

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
            'underscore': 'vendor/underscore',
            'test': '../test',
            'fixtures': '../test/fixtures',
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
            'expect': {
                exports: 'expect'
            },
            'sinon': {
                exports: 'sinon'
            },
            'mocha': {
                exports: 'mocha',
                init: function () {
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
        'test/adapters/search.test',
        'test/utils/ajaxStreaming.test'
    ], function () {
        if (window.mochaPhantomJS) {
            mochaPhantomJS.run();
        } else {
            mocha.run();
        }
    });
}());
