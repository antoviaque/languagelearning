/*jslint browser: true*/
/*globals TraceKit*/

// This is run after Tracekit, and supplies the user an error in case there's
// an uncaught exception.
//
(function () {
    "use strict";

    /**
     * Let the user know they should try reloading the page.
     */
    var showReloadError = function () {
        document.getElementById('reload-error').style.display = 'block';
        var jsLoadingSpinner = document.getElementById('js-loading-spinner');
        if (jsLoadingSpinner) {
            jsLoadingSpinner.style.display = 'none';
        }
    };

    TraceKit.report.subscribe(function yourLogger(stackInfo) {

        var msg = stackInfo.message;

        // On requirejs timeout, have the user try reloading the page -- the
        // call to load the script may have just failed.
        if (msg) {
            if (msg.indexOf('timeout') !== -1 && msg.indexOf('requirejs.org') !== -1) {
                showReloadError();
            }
        }

        // TODO: let us know!
    });
}());
