/*jslint browser: true, nomen: true */
/*globals define, DEBUG_MODE*/

define([
    'jquery',
    'underscore',
    'json2',
    'models/expression'
], function ($, _, json, ExpressionModel) {
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
     * Obtains promise that will contain an expression model when resolved,
     * and partial expression models as progress.
     * @param {String} expression The expression to be translated.
     * @returns {jQuery.Promise}
     */
    SearchAdapter.prototype.search = function (source, target, expression) {
        if (this.$dfd) {
            if (this.$dfd.state() === 'pending') {
                this.$dfd.reject();
            }
        }

        this._inProgress += 1;
        $('body').css('cursor', 'progress');

        var $dfd = this.$dfd = new $.Deferred(),
            self = this,
            pathname = window.location.pathname;

        $dfd.always(function () {
            self._inProgress -= 1;
            if (self._inProgress === 0) {
                $('body').css('cursor', 'auto');
            }
        });

        if (_.has(cache, pathname)) {
            if (cache[pathname] === null) {
                $dfd.reject();
            } else {
                $dfd.resolve(new ExpressionModel(cache[pathname]));
            }
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
                    $dfd.notify(new ExpressionModel(content));
                }
            }).success(function (content, status, jqXHR) {
                addToCache(pathname, content);
                $dfd.resolve(new ExpressionModel(content));
            }).error(function (jqXHR) {
                addToCache(pathname, null);
                try {
                    $dfd.reject(new ExpressionModel(json.parse(jqXHR.responseText)));
                } catch (err) {
                    $dfd.reject(new ExpressionModel({
                        "error": "please try again later" // TODO LOCAL
                    }));
                }
            });

        }

        return $dfd.promise();
    };

    return new SearchAdapter();
});
