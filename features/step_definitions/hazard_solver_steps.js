const {After, Before, Given, When, Then } = require('cucumber');
const assert = require('assert');
const fs = require('fs')
const HazardHandler = require("../../lib/model/hazardHandler");
const HazardHandlerHolder = require("../holders/hazardHandlerHolder");
const CleanerHolder = require("../holders/cleanerHolder");
const CodeHolder = require("../holders/codeHolder");
const AssemblyParser = require("../../lib/model/assemblyParser");
const ParserHolder = require("../holders/parserHolder");
const AssemblyCleaner = require("../../lib/model/assemblyCleaner");

let codeHolder;
let parserHolder;
let cleanerHolder;
let hazardHandlerHolder;


Given("that the assembly editor holds the input with no errors: {string}", function (textFileName) {
    let code = fs.readFileSync("features/test_files/data_hazards/" + textFileName).toString();
    codeHolder = new CodeHolder(code);
    let parser = new AssemblyParser(code);
    parser.getAllInstructionErrors();
    parserHolder = new ParserHolder(parser);
});

Given('the assembly code is cleaned', function () {
    let cleaner = new AssemblyCleaner();
    cleaner.cleanAssemblyCode(codeHolder.getCode(), parserHolder.getParser().instructionSignals);
    cleanerHolder = new CleanerHolder(cleaner);
});

Given('the data hazards are removed from the assembly code', function () {
    let hazardHandler = new HazardHandler(cleanerHolder.getCleaner().cleanCode);
    hazardHandler.detectAndSolveDataHazards([],[]);
    hazardHandlerHolder = new HazardHandlerHolder(hazardHandler);
});


Then('{int} data hazards are detected', function (expectedAmount) {
    assert.equal(hazardHandlerHolder.getHazardHandler().numberOfHazards, expectedAmount);
});

Then('there is a forwarding line from line {int} at cc {float} to line {int} at {float}', function (srcLine, srcCC, desLine, desCC) {
    let dataFreeHazardsCode = hazardHandlerHolder.getHazardHandler().code;
    assert((dataFreeHazardsCode[srcLine][5].toString()).indexOf(srcCC + "," + desLine + "," + desCC) > -1);
});

Then('there is a stall at line {int}', function (lineNumber) {
    let dataFreeHazardsCode = hazardHandlerHolder.getHazardHandler().code;
    assert(dataFreeHazardsCode[lineNumber][0] = "Stall");
});

Then('there are no forwarding lines', function () {
    let dataFreeHazardsCode = hazardHandlerHolder.getHazardHandler().code;
    for (var i = 0; i < dataFreeHazardsCode.length; i++) {
        assert(dataFreeHazardsCode[5] = []);
    }
});