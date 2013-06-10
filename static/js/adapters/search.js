/*jslint browser: true, nomen: true */
/*globals define, DEBUG_MODE*/

define([
    'jquery',
    'underscore',
    'json2'
], function ($, _, json) {
    "use strict";

    var cache = {},
        cacheOrder = [],
        cacheSize = 10;

    function addToCache(k, v) {
        if (cacheOrder.length > cacheSize) {
            delete cache[cacheOrder.pop()];
        }
        cacheOrder.push(k);
        cache[k] = v;
    }

    function SearchAdapter(expression) {
        this._inProgress = 0;
    }

    /**
     * Obtains promise that will contain data for an expression model when
     * resolved, and partial data as progress.
     * @param {String} expression The expression to be translated.
     * @returns {jQuery.Promise}
     */
    SearchAdapter.prototype.search = function (source, target, expression) {

        if (this.$dfd) {
            if (this.$dfd.state() === 'pending') {
                this.$dfd.reject();
            }
        }

        source = source === 'auto' ? '' : source;

        this._inProgress += 1;
        $('body').css('cursor', 'progress');

        var $dfd = this.$dfd = new $.Deferred(),
            self = this,
            key = json.stringify([source, target, expression]);

        $dfd.always(function () {
            self._inProgress -= 1;
            if (self._inProgress === 0) {
                $('body').css('cursor', 'auto');
            }
        });

        if (_.has(cache, key)) {
            $dfd.resolve(cache[key]);
        } else {
            $.ajax({
                method: 'get',
                dataType: 'json',
                url: '/api/v1/search?' +
                    $.param({
                        progressive: true,
                        //key: '',
                        expression: expression,
                        source: source,
                        target: target,
                        query_type: [
                            'translation',
                            'images',
                            'definitions'
                        ]
                    }, true),
                progress: function (content) {
                    $dfd.notify(content);
                }
            }).success(function (content, status, jqXHR) {
                addToCache(key, content);
                $dfd.resolve(content);
            }).error(function (jqXHR) {
                //addToCache(key, null);
                try {
                    $dfd.resolve(json.parse(jqXHR.responseText));
                } catch (err) {
                    $dfd.resolve({
                        "error": "please try again later" // TODO LOCAL
                    });
                }
            });
        }

        return $dfd.promise();
    };

    return new SearchAdapter();
});
