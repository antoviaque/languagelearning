/*jslint */
/*globals beforeEach, describe, it, sinon*/
define([
   'underscore',
   'jquery',
   'adapters/search',
   'models/expression',
   'expect',
   'mocha'
], function (_, $, searchAdapter, ExpressionModel, expect) {

    describe("Search API", function () {

        var server;

        before(function () {
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
        });

        it("provides a translation for an expression", function (done) {

            var searchExpression = 'bom dia';

            server.respondWith("GET", /\/api\/v1\/search/,
                               [200, { "Content-Type": "application/json" },
                                   JSON.stringify({
                                       "expression": "bom dia",
                                       "results": {
                                           "translation": "good day"
                                       },
                                       "source": "pt",
                                       "status": "success",
                                       "target": "en"
                                   })
                               ]);

            searchAdapter.search(searchExpression)
                .done(function (expression) {
                expect(expression).to.be.an(ExpressionModel);
                expect(expression.get('expression')).to.equal(searchExpression);
                expect(expression.get('source')).to.equal('pt');
                expect(expression.get('target')).to.equal('en');

                var results = expression.get('results');
                expect(results.translation).to.equal('good day');
                done();

                // TODO: Check for images results after merging pending changes
                // to this test
            });

            server.respond();
        });
    });
});
