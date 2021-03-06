/*jslint browser:true*/
/*globals describe, it, $, beforeEach, afterEach, expect, sinon, xit, TraceKit*/

(function () {
    "use strict";

    describe("The pre-JS page", function () {
        it("has a loading spinner", function () {
            expect($('#js-loading-spinner')).to.have.length(1);
            expect($('#js-loading-spinner * .base-loading-spinner')).to.have.length(1);
        });

        it("has made page-wide loading spinner", function () {
            expect($('body').css('cursor')).to.equal('progress');
        });
    });

    describe("The loaded index page", function () {

        beforeEach(function (done) {
            setTimeout(function () {
                done();
            }, 0);
        });

        it("has no loading spinner", function () {
            expect($('#js-loading-spinner')).to.have.length(0);
            expect($('#js-loading-spinner * .base-loading-spinner')).to.have.length(0);
        });

        it("has reset the cursor to auto", function () {
            expect($('body').css('cursor')).to.equal('auto');
        });

        it("has a search box", function () {
            expect($('#searchbox')).to.have.length(1);
        });

        describe("when there's a requirejs timeout", function () {

            it("displays an error asking the user to reload the page", function (done) {

                var generateError = function () {
                    var err = new Error('Load timeout for modules: \nhttp://requirejs.org/docs/errors.html#timeout');
                    err.requireType = 'timeout';
                    try {
                        throw (err);
                    } catch (caughtErr) {
                        return caughtErr;
                    }
                };

                try {
                    TraceKit.report(generateError());
                } catch (err) { }

                // Tracekit schedules the generation of the stacktrace using
                // setTimeout 0, so we have to test after that.
                setTimeout(function () {
                    expect($('#reload-error').is(':visible')).to.be(true);
                    expect($('#reload-error').text()).to.contain('reload the page');
                    done();
                }, 0);
            });
        });

        describe("The search box", function () {

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

                it("has the text 'Lookup'", function () {
                    expect($('#searchbox * .search-button').text()).to.be('Lookup');
                });
            });
        });

        describe("after submitting an expression for translation", function () {
            var exampleImageUrl = '/static/test/fixtures/example.jpeg',
                serverCallSpy,
                expression,

                // Set this to a three-element array [status code, headers
                // object, content] for the next ajax request.
                nextResponse,
                server;

            beforeEach(function () {
                server = sinon.fakeServer.create();
                serverCallSpy = sinon.spy(server, "handleRequest");
                server.respondWith(function (req) {
                    req.respond.apply(req, nextResponse);
                });
                expression = Math.random().toString(36).substring(7);
                $('input.search-text').val(expression);
                $('form.search-form').trigger('submit');
            });

            afterEach(function () {
                server.handleRequest.restore();
                server.restore();
            });

            it('should display a loading indicator', function () {
                var $loading = $('.base-loading');
                expect($loading.length).to.equal(1);
                expect($loading.is(':visible')).to.be(true);
                expect(Number($loading.css('opacity'))).not.to.equal(0);
            });

            it('should change the cursor to loading', function () {
                expect($('body').css('cursor')).to.equal('progress');
            });

            it('should update the url', function () {
                expect(window.location.pathname).to.equal('/expression/auto/en/' + expression);
            });

            describe("if the expression is in English", function () {

                describe("if no other target language has been specified", function () {

                    beforeEach(function () {
                        var content = {
                            "expression": expression,
                            "results": {
                                "translation": expression,
                            },
                            "source": "en",
                            "status": "success",
                            "target": "en"
                        };
                        nextResponse = [200, { "Content-Type": "application/json" },
                            JSON.stringify(content)];

                        server.respond();
                    });

                    it("informs the user that they should specify another language", function () {
                        expect($('.error').text()).to.contain('please choose another language');
                    });

                    it("provides the interface for them to choose another language", function () {
                        expect($('.languages .target').is(':visible')).to.be(true);
                        expect($('.languages .source').is(':visible')).to.be(true);
                    });
                });
            });

            describe("if the expression is not clearly in any language", function () {

                beforeEach(function () {
                    var content = {
                        "expression": expression,
                        "results": {
                            "translation": expression,
                        },
                        "source": "no",
                        "status": "success",
                        "target": "en"
                    };
                    nextResponse = [200, { "Content-Type": "application/json" },
                        JSON.stringify(content)];

                    $('input.search-text').val(expression);
                    $('form.search-form').trigger('submit');
                    server.respond();
                });

                it("informs the user the language couldn't be identified", function () {
                    expect($('.error').text()).to.contain("couldn't identify the language");
                    expect($('.error').text()).to.contain(expression);
                });
            });

            describe('after the server has responded unsuccessfully', function () {

                describe('with an expected 400', function () {

                    var msg = 'Unable to translate the phrase';

                    beforeEach(function () {
                        var content = {
                            "expression": expression,
                            "source": "pt",
                            "status": "error",
                            "target": "en",
                            "error": msg
                        };
                        nextResponse = [400, { "Content-Type": "application/json" },
                            JSON.stringify(content)];

                        server.respond();
                    });

                    it('lets the user know the phrase could not be translated', function () {
                        expect($('.error').length).to.equal(1);
                        expect($('.error').is(':visible')).to.be(true);
                        expect($('.error').text()).to.contain(msg);
                        expect($('.error').text()).to.contain('Sorry, an error has occurred');
                    });
                });

                describe('with an uncontrolled error', function () {

                    beforeEach(function () {
                        nextResponse = [500, { "Content-Type": "text/html" },
                            "<html><head><title>Error</title></head><body>An error has occurred</body></html>"];

                        server.respond();
                    });

                    it('lets the user know the phrase could not be translated', function () {
                        expect($('.error').length).to.equal(1);
                        expect($('.error').is(':visible')).to.be(true);
                        expect($('.error').text()).to.contain('Sorry, an error has occurred');
                    });
                });
            });

            describe('after the server has responded successfully', function () {

                beforeEach(function () {
                    var content = {
                        "expression": expression,
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
                            }, {
                                "word": "nodefinitions",
                                "sentences": []
                            }]
                        },
                        "source": "pt",
                        "status": "success",
                        "target": "en"
                    };
                    nextResponse = [200, { "Content-Type": "application/json" },
                                       JSON.stringify(content)];
                    server.respond();
                });

                it('should no longer display a loading indicator', function () {
                    var $loading = $('.base-loading');
                    expect($loading.is(':visible')).to.be(false);
                });

                it('should change the cursor back to normal', function () {
                    expect($('body').css('cursor')).to.equal('auto');
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

                it('should display all definitions', function () {
                    var $definitions = $('.expression-definition');
                    expect($definitions).to.have.length(3);
                    expect($('h2', $definitions.get(0)).text()).to.contain('bom');
                    expect($('ol li', $definitions.get(0))).to.have.length(2);
                    expect($('h2', $definitions.get(1)).text()).to.contain('dia');
                    expect($('ol li', $definitions.get(1))).to.have.length(4);
                    expect($('h2', $definitions.get(2)).text()).to.contain('nodefinitions');
                    expect($('ol li', $definitions.get(2))).to.have.length(0);
                });

                it('should display apology for words without definitions', function () {
                    var $noDefinitions = $('.expression-definition:contains("nodefinitions")');
                    expect($noDefinitions).to.have.length(1);
                    expect($noDefinitions.text()).to.contain('no definitions found');
                });

                describe('when the user hits the "back" button', function () {
                    var callback = sinon.spy(),
                        priorView;

                    beforeEach(function () {
                        priorView = $('#expression').html();
                        history.back();
                    });

                    it('should use the cache instead of the server', function () {
                        expect(serverCallSpy.callCount).to.equal(1);
                    });

                    it('should display the last view', function () {
                        expect(priorView).to.eql($('#expression').html());
                    });
                });

                it('should display the source language detected', function () {
                    expect($('.languages .source').val()).to.equal('pt');
                });

                it('should display the target language', function () {
                    expect($('.languages .target').val()).to.equal('en');
                });

                describe('after the source language has been changed', function () {
                    beforeEach(function () {
                        var content = {
                            "expression": expression,
                            "results": {
                                "translation": "bonjour",
                                "images": [],
                                "definitions": [],
                            },
                            "source": "pt",
                            "status": "success",
                            "target": "it"
                        };

                        nextResponse = [200, { "Content-Type": "application/json" },
                            JSON.stringify(content)];
                        $('.languages .target').val('it');
                        $('.languages .source').val('fr');
                        $('.languages .source').trigger('change');
                        server.respond();
                    });

                    it('should update the url', function () {
                        expect(window.location.pathname).to.equal('/expression/fr/it/' + expression);
                    });

                    it('should update the translation', function () {
                        expect($('#translation').text()).to.equal('bonjour');
                    });
                });
            });
        });
    });
}());
