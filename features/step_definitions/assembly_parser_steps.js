const { setWorldConstructor } = require('cucumber')
const { Given, When, Then } = require('cucumber');
const assert = require('assert');
const fs = require('fs')
const AssemblyParser = require('/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/assemblyParser');



var CustomWorld = function() {
    this.errorMessage = "";
};

CustomWorld.prototype.setErrorMessage = function(message) {
    this.errorMessage = message;
};

setWorldConstructor(CustomWorld);

Given("that the assembly editor holds the content of {string}", function (textFileName) {
    var code = "";
    fs.readFile("features/test_files/" + textFileName, (err, data) => {
        if (err) throw err;
        code = data.toString();
        let assemblyParser = new AssemblyParser();
        let errorMessage = assemblyParser.collectAllInstErrors(code);
        this.setErrorMessage(errorMessage);
    })
});


Then("the error message {string}", function (expectedErrorMessage) {
    assert.equal(expectedErrorMessage, this.errorMessage);
});

