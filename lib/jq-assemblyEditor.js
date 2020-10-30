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

    let editor = CodeMirror.fromTextArea($('#editor-textarea')[0], {
        lineNumbers: true,
        lineWrapping: true,
        // gutters: ["breakpoints","CodeMirror-linenumbers"]
    });

    editor.setSize("100%", "100%");

    $('#pipeline-instructions-button').click(function () {
        if (editor.getValue() === "") {
            codeFeedback.html("Please type in assembly code before pipelining");
            beginPipelining = false;
        }
        else {
            let crudeCode = editor.getValue();
            let parser = new AssemblyParser(crudeCode);
            let errormessage = parser.getAllInstructionErrors();
            codeFeedback.html(errormessage);

            if (errormessage === "") {
                let cleaner = new AssemblyCleaner();
                cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);
                hazardousSet = [cleaner.cleanCode, cleaner.highlightingList];

                try {
                    // SOLVE CONTROL
                    let hazardSolver1 = new HazardSolver(hazardousSet[0]);
                    hazardSolver1.solveControlHazard(cleaner.lineNumberByLabel);
                    controlHazardFreeSet = [hazardSolver1.code, hazardSolver1.highlightList];
                    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

                    numberOfControlHazards = hazardSolver1.numberOfHazards;

                    registerLog = hazardSolver1.registerLog;
                    dataMemLog = hazardSolver1.dataMemLog;

                    // SOLVE DATA
                    let hazardSolver2 = new HazardSolver(hazardousSet[0]);
                    hazardSolver2.solveDataHazards();
                    dataHazardFreeSet = [hazardSolver2.code, hazardSolver2.highlightList];
                    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

                    // dataHazardDetection = [hazardSolver2.numberOfHazards,hazardSolver2.lineNumbersWithHazards];
                    numberOfDataHazards = hazardSolver2.numberOfHazards;

                    // SOLVE BOTH
                    let hazardSolver3 = new HazardSolver(controlHazardFreeSet[0]);
                    console.log("here");
                    hazardSolver3.solveDataHazards();
                    hazardFreeSet = [hazardSolver3.code, hazardSolver3.highlightList];

                    numberOfHazards = numberOfControlHazards + numberOfDataHazards;
                    numberOfDataHazardAfterControlSolve = hazardSolver3.numberOfHazards

                    // hazardDetection = [hazardSolver3.numberOfHazards,hazardSolver3.lineNumbersWithHazards];

                    // SOLVE CONTROL AGAIN
                    hazardSolver1 = new HazardSolver(hazardousSet[0]);
                    hazardSolver1.solveControlHazard(cleaner.lineNumberByLabel);
                    controlHazardFreeSet = [hazardSolver1.code, hazardSolver1.highlightList];
                    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

                    beginPipelining = true;

                    console.log(hazardFreeSet[0]);
                    console.log(registerLog);
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


    editor.on("gutterClick", function(cm, n) {
        if (beginPipelining) {
            pipelineTable.highlightPipelineRowsOnClick(highlightingList, n);
        }
    });
});







