/*jslint browser:true plusplus:true*/
/*globals mocha, mochaPhantomJS*/

(function () {
    "use strict";

    var body = document.getElementsByTagName('body')[0],

        loadedLibs = 0,

        /**
         * Add paths to any test-only libraries here.
         */
        libs = [
            "/static/js/vendor/jquery-1.9.1.js",
            "/static/test/vendor/expect.js",
            "/static/test/vendor/mocha.js",
            "/static/test/vendor/sinon.js",
        ],

        loadedTests = 0,

        /**
         * Add paths to any testing scripts here.
         */
        tests = [
            "/static/test/index.test.js"
        ],

        /**
         * This creates a script, appends it to the page, and watches it for
         * loading purposes.
         */
        createScript = function (src) {
            var script = document.createElement('script');
            script.src = src;
            body.appendChild(script);
            return script;
        },

        /**
         * This is fired every time a test is loaded, and starts mocha when
         * all tests are loaded.
         */
        testLoaded = function () {
            loadedTests += 1;
            if (loadedTests === tests.length) {
                mocha.checkLeaks();
                mocha.globals(['jQuery*', 'Backbone*']);
                mochaPhantomJS.run();
            }
        },

        /**
         * Load the tests.
         */
        loadTests = function () {
            var i;
            mocha.setup('bdd');
            for (i = 0; i < tests.length; i += 1) {
                createScript(tests[i]).onload = testLoaded;
            }
        },

        /**
         * This is fired every time a library is loaded, and finishes
         * initialization when all scripts are loaded.
         */
        libLoaded = function () {
            loadedLibs += 1;
            if (loadedLibs === libs.length) {
                loadTests();
            }
        };

    /**
     * Load all libraries in a loop.
     */
    (function () {
        var i;
        for (i = 0; i < libs.length; i += 1) {
            createScript(libs[i]).onload = libLoaded;
        }
    }());
}());
