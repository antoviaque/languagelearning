/*jslint browser: true, nomen: true */
/*global define */

define([
    'underscore',
    'backbone',
    'jquery',
    'models/expression',
    'views/searchBox',
    'views/expression'
], function (_, backbone, $, ExpressionModel, SearchBoxView, ExpressionView) {
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
            var self = this,
                $loadingSpinner = $('#js-loading-spinner'),
                model = this.model = new ExpressionModel({});
            $loadingSpinner.fadeOut(100, function () {
                $loadingSpinner.remove();
            });
            $('body').css('cursor', 'auto');
            this._searchBoxView = new SearchBoxView({
                model: model
            }).render();
            this._expressionView = new ExpressionView({
                model: model
            }).render();
            model.on('change', function () {
                if (model.hasChanged('source') ||
                        model.hasChanged('target') ||
                        model.hasChanged('expression')) {
                    self.expression(model.get('source'),
                                    model.get('target'),
                                    model.get('expression'));
                }
            });
        },

        home: function () {
            $header.hide();
            this._searchBoxView.$el.detach().appendTo($horizon.show());
            this._expressionView.$el.detach();
        },

        expression: function (source, target, expression) {
            var self = this,
                model = this.model,
                loadingDfd,
                pathName = 'expression/' + encodeURIComponent(source) + '/'
                                         + encodeURIComponent(target) + '/'
                                         + encodeURIComponent(expression);

            this.navigate(pathName);

            if (model.get('source') !== source || model.get('target') !== target ||
                    model.get('expression') !== expression) {
                model.set({
                    source: source,
                    target: target,
                    expression: expression
                });
            }

            $horizon.hide();
            this._searchBoxView.expression = expression;
            this._searchBoxView.render().$el.detach().appendTo($header.show());
            if (this._expressionView.$container) {
                this._expressionView.$container.appendTo($mainDiv.show());
            } else {
                this._expressionView.$el.appendTo($mainDiv.show());
            }
        }
    });
});
