const {After, Before, Given, When, Then } = require('cucumber');
const assert = require('assert');
const fs = require('fs')
const AssemblyParser = require("../../lib/model/assemblyParser");
const AssemblyCleaner = require("../../lib/model/assemblyCleaner");
const CleanerHolder = require("../holders/cleanerHolder");
const Assembler = require("../../lib/model/assembler");
const AssemblerHolder = require("../holders/assemblerHolder");

let cleanerHolder;
let assemblerHolder;


Given('that the assembly program {string} is input', function (fileName) {
    let code = fs.readFileSync("features/test_files/assembler/" + fileName).toString();
    let parser = new AssemblyParser(code);
    let cleaner = new AssemblyCleaner();
    cleaner.cleanAssemblyCode(code,parser.instructionSignals);
    cleanerHolder = new CleanerHolder(cleaner);
});

Given('the program is assembled and stored in memory', function () {
    let assembler = new Assembler(cleanerHolder.getCleaner().lineNumberByLabel);
    assembler.initializeMemory(cleanerHolder.getCleaner().cleanCode);
    assemblerHolder = new AssemblerHolder(assembler);
});

Then('there are {int} bytes for every program instruction', function (bytesPerInstruction) {
    let actualMem = assemblerHolder.getAssembler().initialMem;
    assert.equal(actualMem.length,cleanerHolder.getCleaner().cleanCode.length * bytesPerInstruction);
});

Then('the memory byte array starting at address zero is', function (expectedMem) {
    let expectedMemArr = expectedMem.replace(/\n/g, '').split(',');
    let actualMem = assemblerHolder.getAssembler().initialMem;

    // check expected number of bytes in memory
    assert.equal(actualMem.length,expectedMemArr.length);

    // convert actual memory to hexadecimal
    let actualMemHex = formatMem(actualMem);

    var j = 0;
    for (var i = 0; i < expectedMemArr.length; i++) {
        if (i % 4 === 0) {
            j++;
        }
        assert.equal(actualMemHex[i],expectedMemArr[i]);
    }
});

/**
 * Print memory four bytes in each line
 * @param memInHexadecimal - Input memory array with bytes in hexadecimal
 */
function printMem(memInHexadecimal) {
    for (var i = 0; i < memInHexadecimal.length; i+=4) {
        console.log(memInHexadecimal.slice(i,i+4));
    }
}

/**
 * Format memory array from BigInt to hexadecimal
 * @param actualMem - Input memory array
 * @returns {*} - Formatted memory array
 */
function formatMem(actualMem) {
    for (var i = 0; i < actualMem.length; i++) {
        actualMem[i] = formatMemValue(actualMem[i]);
    }
    return actualMem;
}


/**
 * Format BigInt byte to hexadecimal byte
 * @param memSlot - Memory byte
 * @returns {string} - Formatted memory byte
 */
function formatMemValue(memSlot) {
    let hex = BigInt.asUintN(8, memSlot).toString(16);
    if (hex.length < 2) {
        return "0" + hex;
    } return hex;
}