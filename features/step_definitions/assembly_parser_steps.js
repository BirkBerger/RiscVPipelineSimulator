const {After, Before, Given, When, Then } = require('cucumber');
const assert = require('assert');
const fs = require('fs')
const AssemblyParser = require('/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/assemblyParser');
const ErrorMessageHolder = require('/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/errorMessageHolder');



let errorMessageHolder;


Given("that the assembly editor holds the content of {string}", function (textFileName) {
    let code = fs.readFileSync("features/test_files/" + textFileName).toString();
    let assemblyParser = new AssemblyParser();
    let errorMessage = assemblyParser.getAllInstructionErrors(code);
    errorMessageHolder = new ErrorMessageHolder(errorMessage);
});


Then("the error message is thrown", function (expectedErrorMessage) {
    console.log("expected: " + expectedErrorMessage);
    console.log("actual: " + errorMessageHolder.getErrorMessage());
    assert.equal(expectedErrorMessage, errorMessageHolder.getErrorMessage());
});