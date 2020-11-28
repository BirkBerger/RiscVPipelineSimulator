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
const AssemblerHolder = require("../holders/assemblerHolder");

let codeHolder;
let parserHolder;
let cleanerHolder;
let interpreterHolder;
let assemblerHolder;

Given('that the assembly editor holds the input from file: {string}', function (fileName) {
    let code = fs.readFileSync("features/test_files/assembly_interpreter/with_data_hazards/" + fileName).toString();
    codeHolder = new CodeHolder(code);
    let parser = new AssemblyParser(code);
    parser.getAllInstructionErrors();
    parserHolder = new ParserHolder(parser);
});

Given('the code is cleaned and assembled', function () {
    // clean code
    let cleaner = new AssemblyCleaner();
    cleaner.cleanAssemblyCode(codeHolder.getCode(), parserHolder.getParser().instructionSignals);
    cleanerHolder = new CleanerHolder(cleaner);
    // assemble code
    let assembler = new Assembler(cleaner.lineNumberByLabel);
    assembler.initializeMemory(cleaner.cleanCode);
    assemblerHolder = new AssemblerHolder(assembler);
});

Given('the code is interpreted while still having data hazards', function () {
    let interpreter = new AssemblyInterpreter(cleanerHolder.getCleaner().lineNumberByLabel,assemblerHolder.getAssembler().initialMem,true);

    interpreter.interpretCleanAssemblyCode(cleanerHolder.getCleaner().cleanCode);
    interpreterHolder = new InterpreterHolder(interpreter);
});

Given('the code is interpreted with no data hazards', function () {
    let interpreter = new AssemblyInterpreter(cleanerHolder.getCleaner().lineNumberByLabel,assemblerHolder.getAssembler().initialMem,false);
    interpreter.interpretCleanAssemblyCode(cleanerHolder.getCleaner().cleanCode);
    interpreterHolder = new InterpreterHolder(interpreter);
});

Then('the result of register {string} is {int} at cc {int}', function (regName, expectedRegValue, cc) {
    let registersByTime = interpreterHolder.getInterpreter().registerLog;
    let regNumber = regName.substring(1,regName.length);
    assert.equal(registersByTime[cc][regNumber], expectedRegValue);
});

Then('the value at memory address {int} at cc {int} is {int}', function (address, cc, value) {
    let memLog = interpreterHolder.getInterpreter().memLog;
    assert.equal(memLog[cc][address], value);
});

Then('the pipeline order is {string}', function (expectedOrder) {
    let actualOrder = interpreterHolder.getInterpreter().pipelineOrder;
    expectedOrder = expectedOrder.split(",");
    for (var i = 0; i < actualOrder.length; i++) {
        assert.equal(actualOrder[i][0], expectedOrder[i]);
    }
});