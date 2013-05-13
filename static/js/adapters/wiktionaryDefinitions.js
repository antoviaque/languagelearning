/*globals DEBUG_MODE*/

define([
    'jquery',
    'underscore',
    'adapters/wiktionaryDefinitionProcessors'
], function ($, _, wiktionaryDefinitionsProcessors) {
    'use strict';

    function WiktionaryDefinitions(protocol, language, word) {
        if (DEBUG_MODE) {
            if (!protocol) {
                throw "Must initialize wiktionary with either http or https protocol.";
            }
            if (!word) {
                throw "Must initialize wiktionary definition with a word.";
            }
            if (!language) {
                throw "Must initialize wiktionary definition with a language.";
            }
        }
        this._protocol = protocol;
        this._language = language;
        this._word = word;
        this._processor = wiktionaryDefinitionsProcessors[language];
        if (!this._processor) {
            throw "No processor for language " + language + ".";
        }
    }

    /**
     * Obtain promise that will contain array of definitions when resolved.
     * @returns {jQuery.Promise}
     */
    WiktionaryDefinitions.prototype.request = function () {
        var self = this,
            $dfd = new $.Deferred();
        $.ajax({
            method: 'get',
            dataType: 'jsonp',
            url: this._protocol + "//" +
                 this._language + ".wiktionary.org/w/api.php?" +
                 $.param({
                    "action": "query",
                    "prop": "extracts",
                    "titles": this._word,
                    "format": "json",
                    "callback": "_"
                 })
        }).success(function (content, status, jqXHR) {
            var pages = content.query.pages,
                firstPage = pages[_.first(_.keys(pages))].extract;

            $dfd.resolve(self._processor(firstPage));
        }).error(function (jqXHR) {
            $dfd.reject();
        });
        return $dfd.promise();
    };

    return WiktionaryDefinitions;
});
