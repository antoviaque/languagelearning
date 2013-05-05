/*jslint nomen: true, browser:true*/
/*global define*/

define([
    'underscore',
    'models/base'
], function (_, BaseModel) {
    "use strict";

    return BaseModel.extend({
        urlRoot: function() {
            return 'api/sample/';
        },

        defaults: function () {
            return {
                'foo': 'bar'
            };
        },

        initialize: function (obj) {
            this.attributes = this.parse(obj);
        },

        parse: function (obj) {
            // Set anything you want in the model that's not returned by the
            // server here.

            return obj;
        },

        validate: function (attributes) {

        }
    });
});
