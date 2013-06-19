/*jslint browser: true, nomen: true */
/*global define */

define([
    'underscore',
    'mustache',
    'views/base',
    'text!templates/searchBox.mustache',
    'json2',
    'jquery'
], function (_, mustache, BaseView, searchBoxTemplate, json, $) {
    "use strict";

    return BaseView.extend({

        tagName: 'div',

        events: {
            'submit form.search-form': 'submit'
        },

        'id': 'searchbox',

        initialize: function (options) {
        },

        render: function () {
            this.$el.html(mustache.render(searchBoxTemplate, this.model.toJSON()));

            return this;
        },

        submit: function (evt) {
            evt.preventDefault();

            this.model.set({
                expression: $('input.search-text', this.$el).val()
            });

            return false;
        }
    });
});
