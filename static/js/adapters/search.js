/*jslint browser: true, nomen: true */
/*globals define, DEBUG_MODE*/

define([
    'jquery',
    'underscore',
    'json2',
    'models/expression'
], function ($, _, json, ExpressionModel) {

    "use strict";

    function SearchAdapter(expression) {
    }

    /**
     * Obtains promise that will contain an expression model when resolved.
     * @param {String} expression The expression to be translated.
     * @returns {jQuery.Promise}
     */
    SearchAdapter.prototype.search = function (expression) {
        var $dfd = new $.Deferred();

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
            $dfd.resolve(new ExpressionModel(content));
        }).error(function (jqXHR) {
            try {
                $dfd.reject(new ExpressionModel(json.parse(jqXHR.responseText)));
            } catch (err) {
                $dfd.reject(new ExpressionModel({
                    "error": "please try again later" // TODO LOCAL
                }));
            }
        });
        return $dfd.promise();
    };

    return new SearchAdapter();
});
