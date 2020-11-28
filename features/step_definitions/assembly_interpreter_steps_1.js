const {After, Before, Given, When, Then } = require('cucumber');
const assert = require('assert');
const fs = require('fs')
const AssemblyParser = require("../../lib/model/assemblyParser");
const Assembler = require("../../lib/model/assembler");
const CodeHolder = require("../holders/codeHolder");
const ParserHolder = require("../holders/parserHolder");
const AssemblyCleaner = require("../../lib/model/assemblyCleaner");
const CleanerHolder = require("../holders/cleanerHolder");
const AssemblyInterpreter = require("../../lib/model/assemblyInterpreter");
const InterpreterHolder = require("../holders/interpreterHolder");

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
});

Given('the code is interpreted', function () {
    let initialMem = getEmptyMemory(cleanerHolder.getCleaner().cleanCode.length);
    let interpreter = new AssemblyInterpreter(cleanerHolder.getCleaner().lineNumberByLabel,initialMem,false);
    try {
        interpreter.interpretCleanAssemblyCode(cleanerHolder.getCleaner().cleanCode);
    }  catch(e) {
        if (e.name === "InfiniteLoopException") {
            console.log(e.message);
        } else {
            throw e
        }
    }
    interpreterHolder = new InterpreterHolder(interpreter);
});

Then('the result of register {string} is {string}', function (regName, expectedRegValue) {
    let registerLog = interpreterHolder.getInterpreter().registerLog;
    let endCC = registerLog.length - 1;
    let regNumber = regName.substring(1,regName.length);
    assert.equal(registerLog[endCC][regNumber], expectedRegValue);
});

Then('the value at memory address {int} is {int}', function (memAddress, memValue) {
    let memLog = interpreterHolder.getInterpreter().memLog;
    let endCC = memLog.length - 1;
    assert.equal(memLog[endCC][memAddress], memValue);
});

Then('the pipelineOrder is {string}', function (expectedOrder) {
    let actualOrder = interpreterHolder.getInterpreter().pipelineOrder;
    expectedOrder = expectedOrder.split(",");
    for (var i = 0; i < actualOrder.length; i++) {
        assert.equal(actualOrder[i][0], expectedOrder[i]);
    }
});

function getEmptyMemory(length) {
    var initialMem = [];
    for (var i = 0; i < length * 4; i++) {
        initialMem.push(0n);
    }
    return initialMem;
}