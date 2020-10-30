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
let highlightingList;

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
            pipelineTable.highlightPipelineRowsOnClick(highlightingList, n);
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
                // clean code
                let cleaner = new AssemblyCleaner();
                cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);
                hazardousSet = [cleaner.cleanCode, cleaner.highlightingList];
                // if code has no infinite loop => detect and solve hazards
                try {
                    setCodeVersionSets(crudeCode, parser, cleaner);
                } catch (e) {
                    if (e.name === "InfiniteLoopException" || e.name === "DivisionByZeroException") {
                        codeFeedback.html(e.errorMessage);
                    } else {
                        throw e;
                    }
                }
            }
        }
    });
});

function setCodeVersionSets(crudeCode, parser, cleaner) {

    // solve control hazards
    let hazardSolver1 = new HazardSolver(hazardousSet[0]);
    hazardSolver1.solveControlHazard(cleaner.lineNumberByLabel);
    controlHazardFreeSet = [hazardSolver1.code, hazardSolver1.highlightList];
    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

    // set the detected number of control hazards
    numberOfControlHazards = hazardSolver1.numberOfHazards;

    registerLog = hazardSolver1.registerLog;
    dataMemLog = hazardSolver1.dataMemLog;

    console.log(registerLog);
    console.log(dataMemLog);

    // solve data hazards
    let hazardSolver2 = new HazardSolver(hazardousSet[0]);
    hazardSolver2.solveDataHazards();
    dataHazardFreeSet = [hazardSolver2.code, hazardSolver2.highlightList];
    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

    // set the detected number of data hazards
    numberOfDataHazards = hazardSolver2.numberOfHazards;

    // solve all hazards
    let hazardSolver3 = new HazardSolver(controlHazardFreeSet[0]);
    console.log("here");
    hazardSolver3.solveAllHazards(registerLog, dataMemLog);
    hazardFreeSet = [hazardSolver3.code, hazardSolver3.highlightList];

    console.log(registerLog);
    console.log(dataMemLog);

    // set the total number of hazards
    numberOfHazards = numberOfControlHazards + numberOfDataHazards;
    // set number of data hazards once control hazards are solved
    numberOfDataHazardAfterControlSolve = hazardSolver3.numberOfHazards

    // solve control hazards again
    hazardSolver1 = new HazardSolver(hazardousSet[0]);
    hazardSolver1.solveControlHazard(cleaner.lineNumberByLabel);
    controlHazardFreeSet = [hazardSolver1.code, hazardSolver1.highlightList];
    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

    // enable pipelining
    beginPipelining = true;
}





