/*jslint browser: true, nomen: true */
/*globals define, DEBUG_MODE*/

define([
    'jquery',
    'json2'
], function ($, json) {
    "use strict";

    // TODO read begin/splitters from headers.
    var getResponse = function (content) {
        var split = content
            .replace(new RegExp('=+\\[PROGRESSIVE_RESPONSE_BEGIN\\]=+'), '')
            .split(new RegExp('=+\\[PROGRESSIVE_RESPONSE_END\\]=+'));
        return split[split.length - 2];
    };

    // Adapted from http://jsfiddle.net/tBTW2/
    // and http://stackoverflow.com/questions/6035987/can-i-use-jquery-prefilters-to-detect-onReadyStateChange-events-where-readystate
    $.ajaxPrefilter(function (options, _, jqXHR) {
        if (options.progress) {
            var xhrFactory = options.xhr;
            options.dataFilter = function (rawResponse) {
                return getResponse(rawResponse);
            };
            options.xhr = function () {
                var xhr = xhrFactory.apply(this, arguments);
                function loopWhileLoading() {
                    if (!options._interval) {
                        options._interval = setInterval(function () {
                            // Update progress when length of response text
                            // changes.
                            var len = xhr.responseText.length,
                                resp;
                            if (options._lastResponseTextLength !== len) {
                                options._lastResponseTextLength = len;
                                resp = getResponse(xhr.responseText);
                                if (resp) {
                                    options.progress(json.parse(resp));
                                }
                            }
                        }, 100);
                    }
                }
                function terminateLoop() {
                    clearInterval(options._interval);
                }
                function handleLoadStates() {
                    if (xhr.readyState === 3) {
                        loopWhileLoading();
                    } else if (xhr.readyState === 4) {
                        terminateLoop();
                    }
                }
                if (xhr.addEventListener) {
                    xhr.addEventListener("readystatechange", handleLoadStates, false);
                } else {
                    setTimeout(function () {
                        var internal = xhr.onReadyStateChange;
                        if (internal) {
                            xhr.onReadyStateChange = function () {
                                handleLoadStates();
                                internal.apply(this, arguments);
                            };
                        }
                    }, 0);
                }
                return xhr;
            };
        }
    });
});
