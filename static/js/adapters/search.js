/*globals DEBUG_MODE*/

define([
    'jquery',
    'underscore',
    'models/expression'
], function ($, _, ExpressionModel) {

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
                        'images'
                        //'definitions' // TODO
                    ]
                }, true)
        }).success(function (content, status, jqXHR) {
            $dfd.resolve(new ExpressionModel(content));
        }).error(function (jqXHR) {
            $dfd.reject();
        });
        return $dfd.promise();
    };

    return new SearchAdapter();
});
