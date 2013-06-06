// TODO this is duplicative with the settings at languagelearning.main.js,
// needs to be DRY'd out.
({
    appDir: '../',
    baseUrl: 'js',

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
})
