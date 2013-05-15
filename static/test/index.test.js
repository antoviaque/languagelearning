/*jslint browser:true*/
/*globals describe, it, $, before, beforeEach, afterEach, expect*/

(function () {
    "use strict";

    describe("The index page", function () {

        /**
         * Set a document.ready callback after any others would have been set.
         */
        beforeEach(function(done) {
            setTimeout(function() {
                $(document).ready(function() {
                    done();
                });
            }, 10);
        });

        it("has a search box", function () {
            expect($('#searchbox')).to.have.length(1);
        });

        describe("The search box", function() {

            it("has a text input with class 'search-text'", function () {
                var $input = $('#searchbox * input[type="text"]');
                expect($input).to.have.length(1);
                expect($('.search-text')).to.have.length(1);
                expect($input.hasClass('search-text')).to.equal(true);
            });

            it("has no text in the text input", function () {
                expect($('.search-text').text()).to.equal('');
            });

            it("is 500 pixels wide", function () {
                expect($('#searchbox').width()).to.be(500);
            });

            describe("the text input", function () {

                it("has placeholder text", function () {
                    expect($('#searchbox * input[type="text"]').attr('placeholder'))
                        .to.be("Word or expression to translate");
                });
            });

            it("has a search button", function () {
                expect($('#searchbox * .search-button')).to.have.length(1);
            });

            describe("the search button", function () {

                it("has the text 'Lookup'", function() {
                    expect($('#searchbox * .search-button').text()).to.be('Lookup');
                });
            });
        });

        describe("after submitting an expression for translation", function () {

            var expression = 'bom dia';

            beforeEach(function () {
                $('input.search-text').val(expression);
                $('form.search-form').trigger('submit');
            });

            it('should display the original expression', function () {
                expect($('.search-text').is(':visible')).to.equal(true);
                expect($('.search-text').val()).to.equal(expression);
            });

            it('should display a translation', function () {
                expect($('#expression').is(':visible')).to.equal(true);
                expect($('#translation').text()).to.equal('good day');
            });

            it('should update the url', function () {
                expect(window.location.pathname).to.equal('/expression/' + expression);
            });
        });
    });
}());
