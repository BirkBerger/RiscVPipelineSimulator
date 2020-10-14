const {After, Before, Given, When, Then } = require('cucumber');
const assert = require('assert');
const fs = require('fs')
const CodeHolder = require("../../lib/holders/codeHolder");
const AssemblyParser = require("../../lib/assemblyParser");
const ParserHolder = require("../../lib/parserHolder");
const AssemblyCleaner = require("../../lib/assemblyCleaner");
const CleanerHolder = require("../../lib/holders/cleanerHolder");
const AssemblyInterpreter = require("../../lib/assemblyInterpreter");
const InterpreterHolder = require("../../lib/holders/interpreterHolder");

let codeHolder;
let parserHolder;
let cleanerHolder;
let interpreterHolder;

Given('that the assembly editor holds the input with no syntax errors: {string}', function (fileName) {
    let code = fs.readFileSync("features/test_files/assembly_interpreter/" + fileName).toString();
    codeHolder = new CodeHolder(code);
    let parser = new AssemblyParser(code);
    parser.getAllInstructionErrors();
    parserHolder = new ParserHolder(parser);
});

Given('the code is cleaned', function () {
    let cleaner = new AssemblyCleaner();
    cleaner.cleanAssemblyCode(codeHolder.getCode(), parserHolder.getParser().instructionSignals);
    cleanerHolder = new CleanerHolder(cleaner);
    // console.log(cleaner.cleanCode);
});

Given('the code is interpreted', function () {
    let interpreter = new AssemblyInterpreter();
    interpreter.interpretCleanAssemblyCode(cleanerHolder.getCleaner().cleanCode);
    interpreterHolder = new InterpreterHolder(interpreter);
});

Then('the result of register {string} is {string}', function (regName, expectedRegValue) {
    let registersByTime = interpreterHolder.getInterpreter().gpRegistersByTime;
    let endCC = Object.keys(registersByTime).length - 1;
    let regNumber = regName.substring(1,regName.length);
    assert.equal(registersByTime[endCC][regNumber], expectedRegValue);
});

Then('the value at memory address {int} is {int}', function (memAddress, memValue) {
    let dataMem = interpreterHolder.getInterpreter().dataMem;
    assert.equal(dataMem[memAddress], memValue);
});