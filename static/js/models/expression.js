/*jslint nomen: true, browser:true*/
/*global define*/

define([
    'underscore',
    'jquery',
    'models/base',
    'adapters/search'
], function (_, $, BaseModel, searchAdapter) {
    "use strict";

    return BaseModel.extend({
        defaults: function () {
            return {
                "expression": "",
                "source": "auto",
                "target": "en" // TODO LOCAL
            };
        },

        initialize: function (obj) {
            this.on('change', function () {
                if (this.hasChanged('source') ||
                        this.hasChanged('target') ||
                        this.hasChanged('expression')) {
                    this.reload();
                }
            }, this);
        },

        /**
         * Reload this model from the search adapter.
         */
        reload: function () {
            var self = this;
            this.trigger('request');
            this.unset('results', {silent: true});
            searchAdapter.search(this.get('source'),
                                 this.get('target'),
                                 this.get('expression'))
                .progress(function (partialModel) {
                    self.update(partialModel);
                    self.trigger('progress');
                }).done(function (completeModel) {
                    self.update(completeModel);
                    self.trigger('sync');
                });
        },

        /**
         * Update this model from the adapter's response.
         */
        update: function (obj) {
            if (obj.source === 'no') {
                obj.status = 'error';
                obj.error = 'I couldn\'t identify the language of "' + obj.expression + '".  Maybe try checking for typos?'; // TODO LOCAL
                delete obj.results;
            } else if (obj.source && obj.target && obj.source === obj.target) {
                obj.status = 'error';
                obj.error = 'Source and target language are the same, please choose another language to translate into.'; // TODO LOCAL
                delete obj.results;
            }
            this.unset('results', {silent: true});
            this.unset('error', {silent: true});
            this.set(obj, {silent: true});
        },

        validate: function (attributes) {

        }
    });
});
