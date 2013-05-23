/*jslint browser:true*/
/*globals describe, it, $, before, beforeEach, after, afterEach, expect, sinon, xit*/

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

            var expression = 'bom dia',
                exampleImageUrl = '/static/test/fixtures/example.jpeg',
                server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            beforeEach(function () {
                server.respondWith("GET", /\/api\/v1\/search/,
                                   [200, { "Content-Type": "application/json" },
                                       JSON.stringify({
                                           "expression": "bom dia",
                                           "results": {
                                               "translation": "good day",
                                               "images": [{
                                                   "meta": {
                                                     "engine": "bing images"
                                                   },
                                                   "size": ["100", "144"],
                                                   "url": exampleImageUrl
                                               }],
                                               "definitions": [{
                                                   "word": "bom",
                                                   "sentences": [
                                                       "que corresponde plenamente ao que \xc3\xa9 exigido, desejado ou esperado quanto \xc3\xa0 sua natureza, adequa\xc3\xa7\xc3\xa3o, fun\xc3\xa7\xc3\xa3o, efic\xc3\xa1cia, funcionamento etc. (falando de ser ou coisa)",
                                                       "moralmente correto em suas atitudes, de acordo com quem julga"
                                                   ]
                                               }, {
                                                   "word": "dia",
                                                   "sentences": [
                                                       'espa\xc3\xa7o de tempo correspondente \xc3\xa0 rota\xc3\xa7\xc3\xa3o da Terra, que equivale a 23 horas, 56 minutos e 4 segundos',
                                                       'espa\xc3\xa7o de 24 horas',
                                                       'parte do dia (da defini\xc3\xa7\xc3\xa3o 1) entre o amanhecer e o p\xc3\xb4r-do-sol',
                                                       '(F\xc3\xadsica) unidade de medida de tempo equivalente a 86400 segundos e que \xc3\xa9 simbolizada por d'
                                                   ]
                                               }]
                                           },
                                           "source": "pt",
                                           "status": "success",
                                           "target": "en"
                                       })
                                   ]);

                $('input.search-text').val(expression);
                $('form.search-form').trigger('submit');
            });

            it('should display a loading indicator', function (done) {
                var $loading = $('#searchbox .base-loading');
                expect($loading.length).to.equal(1);
                $loading.queue(function (next) {
                    expect($loading.is(':visible')).to.be(true);
                    next();
                    done();
                });
            });

            it('should update the url', function () {
                expect(window.location.pathname).to.equal('/expression/' + expression);
            });

            describe('after the server has responded', function () {

                beforeEach(function () {
                    server.respond();
                });

                it('should no longer display a loading indicator', function (done) {
                    $('#searchbox .base-loading').queue(function (next) {
                        expect($('#searchbox .base-loading').is(':visible')).to.be(false);
                        next();
                        done();
                    });
                });

                it('should display the original expression', function () {
                    expect($('.search-text').is(':visible')).to.equal(true);
                    expect($('.search-text').val()).to.equal(expression);
                });

                it('should display a translation', function () {
                    expect($('#expression').is(':visible')).to.equal(true);
                    expect($('#translation').text()).to.equal('good day');
                });

                it('should display an image', function () {
                    expect($('.expression-images .thumb').length).to.equal(1);
                    expect($('.expression-images .thumb').attr('src')).to.equal(exampleImageUrl);
                });

                it('should display all images resized to 100px height', function () {
                    expect($('.expression-images .thumb').height()).to.equal(100);
                });

                it('should display all translations', function () {
                    var $definitions = $('.expression-definition');
                    expect($definitions).to.have.length(2);
                    expect($('h2', $definitions.get(0)).text()).to.equal('bom');
                    expect($('ol li', $definitions.get(0))).to.have.length(2);
                    expect($('h2', $definitions.get(1)).text()).to.equal('dia');
                    expect($('ol li', $definitions.get(1))).to.have.length(4);
                });
            });

            after(function () {
                server.restore();
            });
        });
    });
}());
