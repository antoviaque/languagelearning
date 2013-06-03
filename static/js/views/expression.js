/*jslint browser: true, nomen: true */
/*global define */

define([
    'underscore',
    'mustache',
    'views/base',
    'text!templates/expression.mustache',
    'json2',
    'jquery',
    'tracekit'
], function (_, mustache, BaseView, expressionTemplate, json, $, tracekit) {
    "use strict";

    return BaseView.extend({

        tagName: 'div',

        'id': 'expression',

        initialize: function (options) {
        },

        render: function (model) {
            var jsonModel = model ? model.toJSON() : {};
            this.$el.html(mustache.render(expressionTemplate, jsonModel));
            return this;
        }
    });
});
