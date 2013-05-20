/*jslint multistr:true evil:true*/
/*globals beforeEach, describe, it*/
define([
   'underscore',
   'adapters/wiktionaryDefinitionProcessors',
   'expect',
   'mocha',
   'sinon',
   'text!fixtures/wiktionaryMudigkeit.txt',
   'text!fixtures/wiktionaryBezeichnen.txt',
   'text!fixtures/wiktionaryKlage.txt'
], function (_, processors, expect, mocha, sinon, mudigkeitResp, bezeichnenResp,
            klageResp) {
    "use strict";

    describe("the German definition processor", function () {

        it("transforms unstructured German wiktionary page into definitions", function () {
            var mudigkeit, bezeichnen, klage, _;

            _ = function (callbackData) { mudigkeit = callbackData.query.pages['26802'].extract; };
            eval(mudigkeitResp);

            expect(processors.de(mudigkeit)).to.eql([
                "[1] Zustand des Schlafmangels oder des Unausgeruhtseins"
            ]);

            _ = function (callbackData) { klage = callbackData.query.pages['19948'].extract; };
            eval(klageResp);

            expect(processors.de(klage)).to.eql([
               "[1] sprachlich gefasste Äußerung unlustvoller Gefühle von Schmerz, Leid oder Trauer, etwa über den Tod eines Menschen",
               "[2] sprachlich gefasste Äußerung unlustvoller Gefühle von Enttäuschung, Unzufriedenheit, Ärger oder Ressentiment, mit Implikationen von Kritik oder Schelte",
               "[3] Recht: ein Antrag an ein Gericht, über einen Rechtsstreit zu entscheiden",
               "[4] Literatur: bestimmte Formen der Dichtung, in deren Mittelpunkt eine Klage ([1]) steht"
            ]);

            _ = function (callbackData) { bezeichnen = callbackData.query.pages['28681'].extract; };
            eval(bezeichnenResp);

            expect(processors.de(bezeichnen)).to.eql([
               "[1] jemandem oder etwas einen Namen geben, jemanden benennen",
               "[2] in bestimmter Weise kennzeichnen; durch ein Symbol erkennbar machen",
               "[3] eine Sache ausmachen, für etwas typisch sein"
            ]);
        });
    });

    describe("the French definition processor", function () {

    });
});
