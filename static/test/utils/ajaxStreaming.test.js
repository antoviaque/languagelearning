/*jslint nomen:true*/
/*globals beforeEach, describe, it, sinon, define, afterEach*/
define([
    'underscore',
    'jquery',
    'expect',
    'mocha',
    'sinon',
    'utils/ajaxStreaming'
], function (_, $, expect) {
    "use strict";

    describe("Progressive loading", function () {

        var xhr, requests, jqXHR, req, progressSpy, clock,
            sep = '===foobarbaz===',
            headers = {
                'X-Progressive-Response-Separator': sep,
                'Content-Type': 'application/json'
            };

        beforeEach(function () {
            requests = [];
            xhr = sinon.useFakeXMLHttpRequest();

            xhr.onCreate = function (xhr) {
                requests.push(xhr);
            };

            progressSpy = sinon.spy();
            jqXHR = $.ajax({
                url: 'progressive-loading',
                progress: progressSpy
            });
            req = requests[0];

            clock = sinon.useFakeTimers();
        });

        afterEach(function () {
            xhr.restore();
            clock.restore();
        });

        describe("as the content is being sent", function () {

            beforeEach(function () {
                req.status = 200;
                req.statusText = 'OK';
                req.setResponseHeaders(headers);
                req.responseText = req.responseBody = 'foo' + sep;
                req.readyStateChange(3);
            });

            it("calls the progress callback", function () {
                clock.tick(200);
                expect(progressSpy.calledOnce).to.be(true);
            });

            it("does not call the progress callback if the content hasn't changed", function () {
                clock.tick(200);
                expect(progressSpy.calledOnce).to.be(true);
                req.responseText = req.responseBody = req.responseText;
                clock.tick(200);
                expect(progressSpy.calledOnce).to.be(true);
            });

            it("calls the progress callback again when the content changes", function () {
                clock.tick(200);
                req.responseText = req.responseBody = req.responseText;
                clock.tick(200);
                expect(progressSpy.calledOnce).to.be(true);
                req.responseText = req.responseBody = req.responseText + 'foo bar' + sep;
                clock.tick(200);
                expect(progressSpy.calledTwice).to.be(true);
                expect(progressSpy.calledWith('foo bar')).to.equal(true);
            });

            it("reads the splitter from the 'X-Progressive-Response-Separator'", function () {
                clock.tick(200);
                expect(progressSpy.calledWith('foo')).to.equal(true);
            });
        });

        describe("after the content is finished being sent", function () {
            var content = ["foo", "bar", "baz"];

            beforeEach(function () {
                req.respond(200, headers, ['["foo"]', '["foo","bar"]', JSON.stringify(content), ''].join(sep));
            });

            it("reads the splitter from the 'X-Progressive-Response-Separator'", function (done) {
                jqXHR.done(function (content) {
                    expect(content).to.eql(content);
                    done();
                });
            });
        });
    });
});
