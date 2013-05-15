/*jslint */
/*globals beforeEach, describe, it*/
define([
   'underscore',
   'jquery',
   'adapters/search',
   'models/expression',
   'expect',
   'mocha'
], function (_, $, searchAdapter, ExpressionModel, expect) {

    describe("Search API", function () {

        it("provides a translation for an expression", function (done) {

            var searchExpression = 'bom dia';

            searchAdapter.search(searchExpression)
                .done(function (expression) {
                expect(expression).to.be.an(ExpressionModel);
                expect(expression.get('expression')).to.equal(searchExpression);
                expect(expression.get('source')).to.equal('pt');
                expect(expression.get('target')).to.equal('en');

                var results = expression.get('results');
                expect(results.translation).to.equal('good day');
                done();
            });
        });
    });
});
