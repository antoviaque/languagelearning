/*jslint nomen: true, browser:true*/
/*global define*/

define([
    'underscore',
    'models/base',
    'adapters/wiktionaryDefinitions'
], function (_, BaseModel, WiktionaryDefinitions) {
    "use strict";

    return BaseModel.extend({
        initialize: function (obj) {
            this.attributes = this.parse(obj);
        },

        parse: function (obj) {
            // Set anything you want in the model that's not returned by the
            // server here.

            return obj;
        },

        /**
         *
         */
        fetch: function () {
            var definitions = new WiktionaryDefinitions(window.location.protocol,
                                                        this.get('language'),
                                                        this.get('word')),
                self = this;
            definitions.request().done(function (definitionsArray) {
                self.set({
                    definitions: definitionsArray
                });
            }).fail(function () {
                self.trigger('error');
            });
        }
    });
});
