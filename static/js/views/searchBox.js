/*jslint browser: true, devel: true, nomen: true */
/*global define */

define([
    'underscore',
    'mustache',
    'models/sample',
    'collections/sample',
    'views/base',
    'text!templates/searchBox.mustache',
    'json2',
    'jquery',
    'tracekit'
], function (_, mustache, SampleModel, SampleCollection,
            BaseView, searchBoxTemplate, json, $, tracekit) {
    "use strict";

    return BaseView.extend({

        events: {

        },

        initialize: function (options) {

        },

        render: function () {
            var loc = window.location,

                // TODO temp: maintaining existing functionality
                data = {
                    searchText: decodeURIComponent(loc.search.substring(3))
                },

                rendered = mustache.render(searchBoxTemplate, data);

            this.$el.html(rendered);

            return this;
        }
    });
});
