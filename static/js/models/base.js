/*jslint nomen: true, browser:true*/
/*global define*/

define([
    'underscore',
    'backbone'
], function (_, backbone) {

    return backbone.Model.extend({

        /**
         * This method is shared between all models.
         * @returns {boolean} true
         * TODO: eliminate me, I don't do anything ;)
         */
        commonMethod: function () {
            return true;
        }
    });
});
