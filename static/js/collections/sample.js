/*jslint nomen: true, browser: true*/
/*globals define*/

define([
    'underscore',
    'models/sample',
    'collections/base',
    'json2'
], function (_, SampleModel, BaseCollection, json) {
    "use strict";

    return BaseCollection.extend({
        model: SampleModel,

        url: function () {
            return 'api/sample/';
        },

        initialize: function (models) {

        }
    });
});
