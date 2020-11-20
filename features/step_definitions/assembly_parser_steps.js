const {After, Before, Given, When, Then } = require('cucumber');
const assert = require('assert');
const fs = require('fs')
const AssemblyParser = require("../../lib/model/assemblyParser");
const AssemblyCleaner = require("../../lib/model/assemblyCleaner");
const AssemblyInterpreter = require("../../lib/model/assemblyInterpreter");
const ErrorMessageHolder = require('../holders/errorMessageHolder');

let errorMessageHolder;

Given("that the assembly editor holds the content of {string}", function (textFileName) {
    let code = fs.readFileSync("features/test_files/assembly_parser/" + textFileName).toString();

    // check syntax errors
    let parser = new AssemblyParser(code);
    let cleaner = new AssemblyCleaner();
    let errorMessage = parser.getAllInstructionErrors();

    // check for runtime error and division by zero
    if (errorMessage === "") {
        cleaner.cleanAssemblyCode(code, parser.instructionSignals);
        let interpreter = new AssemblyInterpreter(cleaner.lineNumberByLabel);
        try {
            interpreter.interpretCleanAssemblyCode(cleaner.cleanCode);
        } catch (e) {
            if (e.name === "InfiniteLoopException" || e.name === "DivisionByZeroException") {
                errorMessage = e.errorMessage;
            } else {
                throw e;
            }
        }
    }
    errorMessageHolder = new ErrorMessageHolder(errorMessage);
});


Then("the error message is thrown", function (expectedErrorMessage) {
    assert.equal(errorMessageHolder.getErrorMessage().replace(/\t/g, ''),expectedErrorMessage);
});