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
    }

    /**
     * Obtains promise that will contain an expression model when resolved.
     * @param {String} expression The expression to be translated.
     * @returns {jQuery.Promise}
     */
    SearchAdapter.prototype.search = function (expression) {
        if (this.$dfd) {
            if (this.$dfd.state() === 'pending') {
                this.$dfd.reject();
            }
        }

        var $dfd = this.$dfd = new $.Deferred();

        if (_.has(cache, expression)) {
            if (cache[expression] === null) {
                $dfd.reject();
            } else {
                $dfd.resolve(new ExpressionModel(cache[expression]));
            }
        } else {
            $.ajax({
                method: 'get',
                dataType: 'json',
                url: '/api/v1/search?' +
                    $.param({
                        //key: '',
                        expression: expression,
                        //source: '',  // TODO
                        //target: '', // TODO
                        query_type: [
                            'translation',
                            'images',
                            'definitions'
                        ]
                    }, true)
            }).success(function (content, status, jqXHR) {
                addToCache(expression, content);
                $dfd.resolve(new ExpressionModel(content));
            }).error(function (jqXHR) {
                addToCache(expression, null);
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
