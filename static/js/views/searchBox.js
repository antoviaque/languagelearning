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
            this._router = options.router;
            this.expression = '';
        },

        render: function () {
            this.$el.html(mustache.render(searchBoxTemplate, {
                expression: this.expression
            }));

            return this;
        },

        submit: function (evt) {
            evt.preventDefault();

            this._router.expression($('input.search-text', this.$el).val());
            return false;
        }
    });
});
