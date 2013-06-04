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
            if (obj.source === 'no') {
                obj.status = 'error';
                obj.error = 'I couldn\'t identify the language of "' + obj.expression + '".  Maybe try checking for typos?'; // TODO LOCAL
                delete obj.results;
            } else if (obj.source && obj.target && obj.source === obj.target) {
                obj.status = 'error';
                obj.error = 'Source and target language are the same, please choose another language to translate into.'; // TODO LOCAL
                delete obj.results;
            }
            return obj;
        },

        validate: function (attributes) {

        }
    });
});
