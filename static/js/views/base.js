define([
    'jquery',
    'backbone',
    'underscore'
], function ($, backbone, _) {
    'use strict';

    return backbone.View.extend({

        /**
         * This method is shared between all views.
         * @returns {boolean} true
         * TODO: eliminate me, I don't do anything ;)
         */
        commonMethod: function () {
            return true;
        }
    });
});
