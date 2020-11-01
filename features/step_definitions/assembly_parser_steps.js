const {After, Before, Given, When, Then } = require('cucumber');
const assert = require('assert');
const fs = require('fs')
const AssemblyParser = require('/Users/birkberger/Documents/DTU/Bachelorprojekt/RiscVPipelineSimulator/lib/assemblyParser');
const ErrorMessageHolder = require('/Users/birkberger/Documents/DTU/Bachelorprojekt/RiscVPipelineSimulator/lib/holders/errorMessageHolder');

let errorMessageHolder;

Given("that the assembly editor holds the content of {string}", function (textFileName) {
    let code = fs.readFileSync("features/test_files/assembly_parser/" + textFileName).toString();
    let assemblyParser = new AssemblyParser(code);
    let errorMessage = assemblyParser.getAllInstructionErrors();
    errorMessageHolder = new ErrorMessageHolder(errorMessage);
});


Then("the error message is thrown", function (expectedErrorMessage) {
    assert.equal(expectedErrorMessage, errorMessageHolder.getErrorMessage());
});