/*jslint browser: true, nomen: true */
/*global define */

define([
    'underscore',
    'mustache',
    'views/base',
    'text!templates/expression.mustache',
    'fixtures/languages',
    'json2',
    'jquery'
], function (_, mustache, BaseView, expressionTemplate, languages, json, $) {
    "use strict";

    return BaseView.extend({

        tagName: 'div',

        events: {
            'change select.source': 'changeLanguage',
            'change select.target': 'changeLanguage'
        },

        'id': 'expression',

        changeLanguage: function (evt) {
            this.model.set({
                source: this.sourceSelect().val(),
                target: this.targetSelect().val()
            });
        },

        initialize: function (options) {
            this.model.on('request', this.loading, this);
            this.model.on('progress', this.render, this);
            this.model.on('sync', this.render, this);
            this.model.on('sync', this.endLoading, this);
        },

        sourceSelect: function () {
            return $('.languages .source', this.$el);
        },

        targetSelect: function () {
            return $('.languages .target', this.$el);
        },

        render: function () {
            var jsonModel = _.extend(
                {},
                this.model.toJSON(),
                { languages: languages.supported }
            );

            this.$el.html(mustache.render(expressionTemplate, jsonModel));

            this.sourceSelect().val(jsonModel.source);
            this.targetSelect().val(jsonModel.target);

            // Bind events once the DOM has been generated
            this.delegateEvents();

            return this;
        },
    });
});
