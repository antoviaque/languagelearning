/*jslint browser: true, nomen: true */
/*global define */

define([
    'underscore',
    'backbone',
    'jquery',
    'adapters/search',
    'views/searchBox',
    'views/expression'
], function (_, backbone, $, searchAdapter, SearchBoxView, ExpressionView) {
    "use strict";

    var $mainDiv = $('div.main-container div.main'),
        $horizon = $('div.horizon'),
        $header = $('div.header-container header');

    return backbone.Router.extend({
        routes: {
            "": "home",
            "expression/:source/:target/:expression": "expression"
        },

        initialize: function (options) {
            var $loadingSpinner = $('.js-loading-spinner');
            $loadingSpinner.fadeOut(100, function () {
                $loadingSpinner.remove();
            });
            $('body').css('cursor', 'auto');
            this._searchBoxView = new SearchBoxView({router: this}).render();
            this._expressionView = new ExpressionView({router: this}).render();
        },

        home: function () {
            $header.hide();
            this._searchBoxView.$el.detach().appendTo($horizon.show());
            this._expressionView.$el.detach();
        },

        expression: function (source, target, expression) {
            var self = this,
                loadingDfd,
                pathName = 'expression/' + encodeURIComponent(source) + '/' 
                                         + encodeURIComponent(target) + '/'
                                         + encodeURIComponent(expression);

            this.navigate(pathName);
            if (source === 'auto') {
                source = '';
            }

            $horizon.hide();
            this._searchBoxView.expression = expression;
            this._searchBoxView.render().$el.detach().appendTo($header.show());
            this._expressionView.$el.appendTo($mainDiv.show());
            loadingDfd = this._expressionView.loading();

            searchAdapter.search(source, target, expression).done(function (expressionModel) {
                self._expressionView.render(expressionModel);
            }).fail(function (expressionModel) {
                self._expressionView.render(expressionModel);
            }).always(function () {
                loadingDfd.resolve();
            });
        }
    });
});
