const {After, Before, Given, When, Then } = require('cucumber');
const assert = require('assert');
const fs = require('fs')
const HazardSolver = require("../../lib/hazardSolver");
const AssemblyCompiler = require("../../lib/assemblyCompiler");
const HazardSolverHolder = require("../../lib/hazardSolverHolder");
const CompilerHolder = require("../../lib/compilerHolder");
const CodeHolder = require("../../lib/codeHolder");
const AssemblyParser = require("../../lib/assemblyParser");
const ParserHolder = require("../../lib/parserHolder");

let codeHolder;
let parserHolder;
let compilerHolder;
let hazardSolverHolder;


Given("that the assembly editor holds the input with no errors: {string}", function (textFileName) {
    let code = fs.readFileSync("features/test_files/pipeline_table/" + textFileName).toString();
    codeHolder = new CodeHolder(code);
    let parser = new AssemblyParser(code);
    parser.getAllInstructionErrors();
    parserHolder = new ParserHolder(parser);
});

Given('the assembly code is compiled', function () {
    let compiler = new AssemblyCompiler();
    compiler.storeCode(codeHolder.getCode(), parserHolder.getParser().instructionSignals);
    compilerHolder = new CompilerHolder(compiler);
});

Given('the data hazards are removed from the assembly code', function () {
    let hazardSolver = new HazardSolver(compilerHolder.getCompiler().cleanAssemblyCode);
    hazardSolver.solveAllHazards();
    hazardSolverHolder = new HazardSolverHolder(hazardSolver);
});


Then('{int} data hazards are detected', function (expectedAmount) {
    assert.equal(hazardSolverHolder.getHazardSolver().numberOfHazards, expectedAmount);
});

Then('there is a forwarding line from line {int} at cc {float} to line {int} at {float}', function (srcLine, srcCC, desLine, desCC) {
    let noHazardsAssemblyCode = hazardSolverHolder.getHazardSolver().noHazardsAssemblyCode;
    console.log(noHazardsAssemblyCode);
    assert((noHazardsAssemblyCode[srcLine][5].toString()).indexOf(srcCC + "," + desLine + "," + desCC) > -1);
});

Then('there is a stall at line {int}', function (lineNumber) {
    let noHazardsAssemblyCode = hazardSolverHolder.getHazardSolver().noHazardsAssemblyCode;
    assert(noHazardsAssemblyCode[lineNumber] = "---");
});