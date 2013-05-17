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
            var $this = this;
         
            // TODO: Is this the right place for this?
            obj = $this.normalize_images_height(obj);

            return obj;
        },

        normalize_images_height: function (obj) {
            if (!obj.results.images) {
                return obj;
            }
            _.each(obj.results.images, function (result) {
                // TODO: Change API response to result.width and result.height for consistency & ease?
                // Or is there a way to access size[0] and size[1] without a loop with mustache?
                var width = result.size[0],
                    height = result.size[1];

                // TODO: Remove hard-coded height value from JS
                // What's the best practice for manipulating values from CSS with Backbone?
                // $('.expression-images').css('height') doesn't work as it seem rendered later on
                result.normalized_height = 100;
                result.normalized_width = Math.round(width * result.normalized_height / height);
            });

            return obj;
        },

        validate: function (attributes) {

        }
    });
});
