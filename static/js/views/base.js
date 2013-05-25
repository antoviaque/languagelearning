define([
    'jquery',
    'backbone',
    'underscore'
], function ($, backbone, _) {
    'use strict';

    return backbone.View.extend({

        /**
         * Show a loading indicator until the promise is resolved or rejected.
         * @returns {jQuery.Deferred} A Deferred object that, when resolved or
         * rejected, will cause the loading indicator to be hidden.
         */
        loading: function () {
            if (!this.$container) {
                this.$container = $('<div class="loading-container" />');
            }
            if (!this.$loadingDiv) {
                this.$loadingDiv = $('<div class="base-loading"><div class="base-loading-spinner" /></div>');
            }
            var $el = this.$el,
                $dfd = new $.Deferred(),
                $loadingDiv = this.$loadingDiv,
                $container = this.$container,
                $origParent = this.$el.parent();

            if (!$container.is(':visible')) {
                $el.replaceWith($container);
                $container.append($loadingDiv).append($el);
                $loadingDiv.hide().fadeIn();
            }
            $dfd.always(function () {
                $loadingDiv.fadeOut(function () {
                    $el.detach();
                    $container.replaceWith($el);
                });
            });
            return $dfd;
        }
    });
});
