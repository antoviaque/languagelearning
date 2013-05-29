/*globals DEBUG_MODE*/

define([
    'jquery',
    'underscore',
    'models/expression'
], function ($, _, ExpressionModel) {

    function SearchAdapter(expression) {
        this._inProgress = 0;
    }

    /**
     * Obtains promise that will contain an expression model when resolved.
     * @param {String} expression The expression to be translated.
     * @returns {jQuery.Promise}
     */
    SearchAdapter.prototype.search = function (expression) {
        var $dfd = new $.Deferred(),
            self = this;

        this._inProgress += 1;
        $('body').css('cursor', 'progress');

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
            $dfd.reject();
        }).always(function () {
            self._inProgress -= 1;
            if (self._inProgress === 0) {
                $('body').css('cursor', 'auto');
            }
        });
        return $dfd.promise();
    };

    return new SearchAdapter();
});
