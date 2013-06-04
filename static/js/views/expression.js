/*jslint browser: true, nomen: true */
/*global define */

define([
    'underscore',
    'mustache',
    'views/base',
    'text!templates/expression.mustache',
    'fixtures/languages',
    'json2',
    'jquery',
    'tracekit'
], function (_, mustache, BaseView, expressionTemplate, languages, json, $, tracekit) {
    "use strict";

    return BaseView.extend({

        tagName: 'div',

        events: {
            'change select.source': 'changeLanguage',
            'change select.target': 'changeLanguage'
        },

        'id': 'expression',

        initialize: function (options) {
        },

        render: function (model) {
            var jsonModel = _.extend({},
                model ? model.toJSON() : {},
                { languages: languages.supported }
            );

            this.$el.html(mustache.render(expressionTemplate, jsonModel));

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
