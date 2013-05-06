/*jslint nomen: true, browser:true*/
/*global define*/

define([
    'underscore',
    'backbone'
], function (_, backbone) {

    return backbone.Collection.extend({

        /**
         * This method is shared between all collections.
         * @returns {boolean} true
         * TODO: eliminate me, I don't do anything ;)
         */
        commonMethod: function () {
            return true;
        }
    });
});

