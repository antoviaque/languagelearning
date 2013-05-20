/*globals DEBUG_MODE*/

define([
    'jquery',
    'underscore'
], function ($, _) {
    'use strict';

    return {
        'de': function (page) {
            var $stub = $('<div />'),
                $bedeutung,
                $definitions;
            $stub.append($(page));
            $bedeutung = $('b:contains("Bedeutung")', $stub);
            $definitions = $('dd', $bedeutung.parent().next());
            return _.map($definitions, function(def) {
                return $(def).text();
            });
        },
        'fr': function (page) {

        }
    };
});
