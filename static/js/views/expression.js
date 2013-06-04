/*jslint browser: true, nomen: true */
/*global define */

define([
    'underscore',
    'mustache',
    'views/base',
    'text!templates/expression.mustache',
    'text!fixtures/languages.json',
    'json2',
    'jquery',
    'tracekit'
], function (_, mustache, BaseView, expressionTemplate, languagesJSON, json, $, tracekit) {
    "use strict";

    return BaseView.extend({

        tagName: 'div',

        events: {
            'change select.source': 'changeLanguage',
            'change select.target': 'changeLanguage'
        },

        'id': 'expression',

        initialize: function (options) {
            this.languages = json.parse(languagesJSON);
        },

        render: function (model) {
            var jsonModel = model ? model.toJSON() : {};

            // TODO: Is this the right way to do this?
            jsonModel.languages = this.languages;

            this.$el.html(mustache.render(expressionTemplate, jsonModel));

            // TODO: I'd rather do this on the template, but as far as I understand mustache,
            // this would require to prepare two languages arrays, with a selected attribute set 
            // on the right languages -- which would be quite an unecessary contortion. 
            // Any better idea?
            $('.languages .source').val(jsonModel.source);
            $('.languages .target').val(jsonModel.target);

            // Bind events once the DOM has been generated
            this.delegateEvents();

            return this;
        },

        changeLanguage: function (evt) {
            $('#searchbox .search-form').submit();
        }
    });
});
