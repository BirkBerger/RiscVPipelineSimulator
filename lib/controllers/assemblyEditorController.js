let hazardousSet;
let controlHazardFreeSet;
let dataHazardFreeSet;
let hazardFreeSet;

let numberOfDataHazards;
let numberOfControlHazards;
let numberOfHazards;
let numberOfDataHazardAfterControlSolve;

let registerLog;
let dataMemLog;

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
                hazardousSet = [cleaner.cleanCode, cleaner.highlightingList];
                // assemble code => set initial memory
                let assembler = new Assembler(cleaner.lineNumberByLabel);
                assembler.initializeMemory(cleaner.cleanCode);
                let initialMemory = assembler.initialMem;
                // if code has no infinite loop => detect and solve hazards
                try {
                    // the remaining three hazard free sets
                    setHazardFreeSets(crudeCode, parser, cleaner, initialMemory);
                } catch (e) {
                    if (e.name === "InfiniteLoopException" || e.name === "DivisionByZeroException"  || e.name === "AddressOutOfBoundsException") {
                        codeFeedback.html(e.errorMessage);
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

function setHazardFreeSets(crudeCode, parser, cleaner, initialMemory) {
    // set the three hazard free code/highlighting-sets
    setControlHazardFreeSet(crudeCode, parser, cleaner, true, initialMemory);
    setDataHazardFreeSet(crudeCode, parser, cleaner);
    setHazardFreeSet();
    // setControlHazardFreeSet(crudeCode, parser, cleaner, false);
    // enable pipelining
    beginPipelining = true;

    console.log("hazardous set");
    console.log(hazardousSet[0]);
    console.log("data hazard free set");
    console.log(dataHazardFreeSet[0]);
    console.log("hazard free set");
    console.log(hazardFreeSet[0]);
}

function setControlHazardFreeSet(crudeCode, parser, cleaner, setLogs, initialMemory) {
    // solve control hazards
    const hazardSolver = new HazardHandler(hazardousSet[0]);
    hazardSolver.detectAndSolveControlHazard(cleaner.lineNumberByLabel, initialMemory);
    controlHazardFreeSet = [hazardSolver.code, hazardSolver.highlightList];
    // reset hazardousSet
    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);
    // set the detected number of control hazards
    numberOfControlHazards = hazardSolver.numberOfHazards;

    if (setLogs) {
        registerLog = hazardSolver.registerLog;
        dataMemLog = hazardSolver.dataMemLog;
    }
}

function setDataHazardFreeSet(crudeCode, parser, cleaner) {
    // solve data hazards
    const hazardSolver = new HazardHandler(hazardousSet[0]);
    hazardSolver.detectAndSolveDataHazards([],[]);
    dataHazardFreeSet = [hazardSolver.code, hazardSolver.highlightList];
    // reset hazardousSet
    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);
    // set the detected number of data hazards
    numberOfDataHazards = hazardSolver.numberOfHazards;
}

function setHazardFreeSet() {
    // solve all hazards
    const hazardSolver = new HazardHandler(controlHazardFreeSet[0]);
    hazardSolver.detectAndSolveDataHazards(registerLog, dataMemLog);
    hazardFreeSet = [hazardSolver.code, hazardSolver.highlightList];
    // set Logs
    registerLog = hazardSolver.registerLog;
    dataMemLog = hazardSolver.dataMemLog;

    // set the total number of hazards
    numberOfHazards = numberOfControlHazards + numberOfDataHazards;
    // set number of data hazards once control hazards are solved
    numberOfDataHazardAfterControlSolve = hazardSolver.numberOfHazards
}





