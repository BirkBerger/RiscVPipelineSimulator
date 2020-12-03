let hazardousSet;
let controlHazardFreeSet;
let dataHazardFreeSet;
let hazardFreeSet;

let numberOfDataHazards;
let numberOfControlHazards;
let numberOfHazards;
let numberOfDataHazardAfterControlSolve;

let currentRegisterLog;
let currentMemLog;

let beginPipelining;
let currentHighlightingList;

$(document).ready(function () {

    let codeFeedback = $('#code-feedback');

    // set assembly editor properties
    let editor = CodeMirror.fromTextArea($('#editor-textarea')[0], {
        lineNumbers: true,
        lineWrapping: true,
    });

    editor.setSize("100%", "100%");

    // highlight pipeline rows on editor gutter clicks
    editor.on("gutterClick", function(cm, n) {
        if (beginPipelining) {
            pipelineVisuals.highlightPipelineRowsOnClick(currentHighlightingList, n);
        }
    });

    // on "pipeline instruction" click
    $('#pipeline-instructions-button').click(function () {
        // if no code is input
        if (editor.getValue() === "") {
            codeFeedback.html("Please type in assembly code before pipelining");
            beginPipelining = false;
        }
        else {
            // parse code
            let crudeCode = editor.getValue();
            let parser = new AssemblyParser(crudeCode);
            let errormessage = parser.getAllInstructionErrors();
            // send syntax error message if applicable
            codeFeedback.html(errormessage);

            // if code has no syntax error
            if (errormessage === "") {
                // clean code => set hazardous set
                let cleaner = new AssemblyCleaner();
                cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);
                // assemble code => set initial memory
                let assembler = new Assembler(cleaner.lineNumberByLabel);
                assembler.initializeMemory(cleaner.cleanCode);
                let initialMemory = assembler.initialMem;
                // if code has no infinite loop => detect and solve hazards
                try {
                    // the remaining three hazard free sets
                    setHazardFreeSets(crudeCode, parser.instructionSignals, cleaner, initialMemory);
                    // enable pipelining
                    beginPipelining = true;
                } catch (e) {
                    if (e.name === "InfiniteLoopException" || e.name === "DivisionByZeroException"  || e.name === "AddressOutOfBoundsException") {
                        codeFeedback.html(e.errorMessage);
                        beginPipelining = false;
                    } else {
                        throw e;
                    }
                }
            } else {
                beginPipelining = false;
            }
        }
    });
});

function setHazardFreeSets(crudeCode, instructionSignals, cleaner, initialMemory) {

    // hazardous set
    setHazardousSet(cleaner,initialMemory);
    cleaner.cleanAssemblyCode(crudeCode, instructionSignals);
    // control-hazard-free set
    setControlHazardFreeSet(cleaner,initialMemory);
    cleaner.cleanAssemblyCode(crudeCode, instructionSignals);
    // data-hazard-free set
    setDataHazardFreeSet(cleaner,initialMemory);
    cleaner.cleanAssemblyCode(crudeCode, instructionSignals);
    // hazard-free set
    setHazardFreeSet(cleaner,initialMemory);

    console.log("hazardous set");
    console.log(hazardousSet[0]);
    console.log("control hazard free set");
    console.log(controlHazardFreeSet[0]);
    console.log("data hazard free set");
    console.log(dataHazardFreeSet[0]);
    console.log("hazard free set");
    console.log(hazardFreeSet[0]);
}

/**
 * Interprets code on hazardous code array.
 * Sets hazardous set.
 * @param cleaner
 * @param initialMemory - Assembled instructions
 */
function setHazardousSet(cleaner, initialMemory) {
    const hazardHandler = new HazardHandler(cleaner.cleanCode, cleaner.lineNumberByLabel, initialMemory);
    hazardHandler.interpretCode(true,true);
    hazardousSet = [hazardHandler.code, hazardHandler.highlightList, hazardHandler.registerLog, hazardHandler.memLog];
}

/**
 * Detects and solves control hazards.
 * Sets numberOfControlHazards.
 * Sets control-hazard-free set.
 * @param cleaner
 * @param initialMemory - Assembled instructions
 */
function setControlHazardFreeSet(cleaner, initialMemory) {
    const hazardHandler = new HazardHandler(cleaner.cleanCode, cleaner.lineNumberByLabel, initialMemory);
    hazardHandler.detectControlHazards();
    numberOfControlHazards = hazardHandler.numberOfHazards;
    hazardHandler.solveControlHazards();
    controlHazardFreeSet = [hazardHandler.code,hazardHandler.highlightList,hazardHandler.registerLog,hazardHandler.memLog];
}

/**
 * Detects and solves data hazards.
 * Sets numberOfDataHazards.
 * Sets data-hazard-free set.
 * @param cleaner
 * @param initialMemory - Assembled instructions
 */
function setDataHazardFreeSet(cleaner, initialMemory) {
    const hazardHandler = new HazardHandler(cleaner.cleanCode, cleaner.lineNumberByLabel, initialMemory);
    hazardHandler.detectDataHazards();
    numberOfDataHazards = hazardHandler.numberOfHazards;
    hazardHandler.solveDataHazards();
    dataHazardFreeSet = [hazardHandler.code,hazardHandler.highlightList,hazardHandler.registerLog,hazardHandler.memLog];
}

/**
 * Solves data and control hazards.
 * Sets numberOfHazards.
 * Sets hazard-free set.
 * @param cleaner
 * @param initialMemory - Assembled instructions
 */
function setHazardFreeSet(cleaner, initialMemory) {
    const hazardHandler = new HazardHandler(cleaner.cleanCode, cleaner.lineNumberByLabel, initialMemory);
    hazardHandler.solveAllHazards();
    numberOfHazards = numberOfDataHazards + numberOfControlHazards;
    hazardFreeSet = [hazardHandler.code,hazardHandler.highlightList,hazardHandler.registerLog,hazardHandler.memLog];
}





