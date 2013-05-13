/*jslint multistr:true*/
/*globals beforeEach, describe, it*/
define([
   'underscore',
   'jquery',
   'adapters/wiktionaryDefinitions',
   'expect',
   'mocha',
   'sinon'
], function (_, $, Definitions, expect) {
    "use strict";

    describe("German definitions", function () {

        it("provides German definitions for a word", function (done) {
            var mudigkeit, bezeichnen, klage;

            mudigkeit = new Definitions('http:', 'de', 'Müdigkeit');
            bezeichnen = new Definitions('http:', 'de', 'bezeichnen');
            klage = new Definitions('http:', 'de', 'Klage');

            $.when(mudigkeit.request(),
                   bezeichnen.request(),
                   klage.request()
                  ).done(function (mudigkeitDefs, bezeichnenDefs, klageDefs) {
                expect(mudigkeitDefs).to.eql([
                    "[1] Zustand des Schlafmangels oder des Unausgeruhtseins"
                ]);
                expect(bezeichnenDefs).to.eql([
                   "[1] jemandem oder etwas einen Namen geben, jemanden benennen",
                   "[2] in bestimmter Weise kennzeichnen; durch ein Symbol erkennbar machen",
                   "[3] eine Sache ausmachen, für etwas typisch sein"
                ]);
                expect(klageDefs).to.eql([
                   "[1] sprachlich gefasste Äußerung unlustvoller Gefühle von Schmerz, Leid oder Trauer, etwa über den Tod eines Menschen",
                   "[2] sprachlich gefasste Äußerung unlustvoller Gefühle von Enttäuschung, Unzufriedenheit, Ärger oder Ressentiment, mit Implikationen von Kritik oder Schelte",
                   "[3] Recht: ein Antrag an ein Gericht, über einen Rechtsstreit zu entscheiden",
                   "[4] Literatur: bestimmte Formen der Dichtung, in deren Mittelpunkt eine Klage ([1]) steht"
                ]);
                done();
            });
        });
    });
});
