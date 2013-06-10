/*jslint nomen:true*/
/*globals beforeEach, describe, it, sinon, define, afterEach*/
define([
    'underscore',
    'jquery',
    'adapters/search',
    'models/expression',
    'expect',
    'mocha',
    'sinon'
], function (_, $, searchAdapter, ExpressionModel, expect) {
    "use strict";

    describe("Search API", function () {

        var server;

        beforeEach(function () {
            server = sinon.fakeServer.create();
        });

        afterEach(function () {
            server.restore();
        });

        it("provides a translation for an expression", function (done) {

            var searchExpression = 'bom dia',
                resp = {
                    "expression": "bom dia",
                    "results": {
                        "translation": "good day"
                    },
                    "source": "pt",
                    "status": "success",
                    "target": "en"
                };

            server.respondWith("GET", /\/api\/v1\/search/,
                               [200, { "Content-Type": "application/json" },
                                   JSON.stringify(resp)
                               ]);

            searchAdapter.search(searchExpression)
                .done(function (expression) {
                    expect(expression).to.be.an(Object);
                    expect(expression.expression).to.equal(searchExpression);
                    expect(expression.source).to.equal('pt');
                    expect(expression.target).to.equal('en');

                    var results = expression.results;
                    expect(results.translation).to.equal('good day');
                    done();

                    // TODO: Check for images results after merging pending changes
                    // to this test
                });

            server.respond();
        });
    });
});
