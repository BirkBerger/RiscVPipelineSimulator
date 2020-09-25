const {After, Before, Given, When, Then } = require('cucumber');
const assert = require('assert');
const fs = require('fs')
const AssemblyParser = require('/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/assemblyParser');
const ErrorMessageHolder = require('/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/errorMessageHolder');



let errorMessageHolder;


Given("that the assembly editor holds the content of {string}", function (textFileName) {
    let code = fs.readFileSync("features/test_files_assembly_editor/" + textFileName).toString();
    let assemblyParser = new AssemblyParser(code);
    let errorMessage = assemblyParser.getAllInstructionErrors();
    errorMessageHolder = new ErrorMessageHolder(errorMessage);
});


Then("the error message is thrown", function (expectedErrorMessage) {
    assert.equal(expectedErrorMessage, errorMessageHolder.getErrorMessage());
});