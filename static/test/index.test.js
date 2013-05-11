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

            it("has a text input", function () {
                expect($('#searchbox * input[type="text"]')).to.have.length(1);
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
    });
})();
