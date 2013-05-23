/*jslint nomen: true, browser:true*/
/*global define*/

define([
    'underscore',
    'jquery',
    'models/base'
], function (_, $, BaseModel) {
    "use strict";

    return BaseModel.extend({
        initialize: function (obj) {
            this.attributes = this.parse(obj);
        },

        parse: function (obj) {
            return obj;
        },

        validate: function (attributes) {

        }
    });
});
