/*jslint browser: true, nomen: true */
/*globals define, DEBUG_MODE*/

define([
    'jquery',
    'json2'
], function ($, json) {
    "use strict";

    /**
     * Read the actual response from progressive content with the specified
     * splitter between sections.
     * @param {String} content The raw progressive content.
     * @param {String} splitter The separator between sections of progressive
     * content.
     * @returns {String} The content.
     */
    var getResponse = function (content, splitter) {
        var split = content
            .split(splitter);
        return split[split.length - 2];
    },

        /**
         * Read the splitter header from the xhr.
         * @param {XMLHttpResponse} xhr An AJAX response whose headers can be
         * read to find the splitter.
         * @returns {String} the splitter.
         */
        readSplitter = function (xhr) {
            return xhr.getResponseHeader('X-Progressive-Response-Separator');
        },

        /**
         * Repeatedly read the xhr's content as it loads.  Calls `callback`
         * every time there is new content.  Content is separated by
         * `splitter`.
         * @param {XMLHttpResponse} xhr An AJAX response which is being loaded.
         * @param {String} splitter A string that separates each section of
         * progressive response.
         * @param {Function} callback A funciton that will be called with the
         * text of the response each time it changes.
         * @returns {Interval} A reference to an interval that should be
         * cleared when the loop should end.
         */
        loopWhileLoading = function (xhr, splitter, callback) {
            var lastRespTextLength = 0;
            return setInterval(function () {
                // Update progress when length of response text
                // changes.
                var len = xhr.responseText.length,
                    resp;
                if (lastRespTextLength !== len) {
                    lastRespTextLength  = len;
                    resp = getResponse(xhr.responseText, splitter);
                    if (resp) {
                        callback(json.parse(resp));
                    }
                }
            }, 100);
        };

    // Adapted from http://jsfiddle.net/tBTW2/
    // and http://stackoverflow.com/questions/6035987/can-i-use-jquery-prefilters-to-detect-onReadyStateChange-events-where-readystate
    $.ajaxPrefilter(function (options, _, jqXHR) {
        if (options.progress) {
            var xhrFactory = options.xhr;
            options.dataFilter = function (rawResponse) {
                return getResponse(rawResponse, readSplitter(jqXHR));
            };
            options.xhr = function () {
                var xhr = xhrFactory.apply(this, arguments);
                function handleLoadStates() {
                    if (xhr.readyState === 3) {
                        options._interval = loopWhileLoading(xhr,
                                                             readSplitter(xhr),
                                                             options.progress);
                    } else if (xhr.readyState === 4) {
                        clearInterval(options._interval);
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
