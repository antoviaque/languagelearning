/*jslint browser: true, devel: true, nomen: true */
/*global define */

define([
    'underscore',
    'mustache',
    'views/base',
    'text!templates/definition.mustache',
    'json2',
    'jquery',
    'tracekit'
], function (_, mustache, BaseView, definitionTemplate, json, $, tracekit) {
    "use strict";

    return BaseView.extend({

        events: {

        },

        initialize: function (options) {
            this.model.on('change', _.bind(this.render, this));
        },

        render: function () {
            var self = this;
            this.$el.empty();
            if (this.model.get('definitions').length === 0) {
                alert('No definitions found!'); // TODO
            } else {
                _.each(this.model.get('definitions'), function (definition) {
                    self.$el.append(mustache.render(definitionTemplate, {
                        definition: definition
                    }));
                });
            }

            return this;
        }
    });
});

