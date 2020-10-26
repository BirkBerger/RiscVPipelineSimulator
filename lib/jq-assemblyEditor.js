let hazardousSet;
let controlHazardFreeSet;
let dataHazardFreeSet;
let hazardFreeSet;

let hazardDetection;
let dataHazardDetection;
let controlHazardDetection;

let currentDetection;

let beginPipelining;
let highlightingList;

$(document).ready(function () {

    let codeFeedback = $('#code-feedback');

    let editor = CodeMirror.fromTextArea($('#editor-textarea')[0], {
        lineNumbers: true,
        lineWrapping: true,
    });

    editor.setSize("100%", "100%");
    let crudeCode = "";

    $('#pipeline-instructions-button').click(function () {
        if (editor.getValue() !== crudeCode) {

            crudeCode = editor.getValue();
            let parser = new AssemblyParser(crudeCode);
            let errormessage = parser.getAllInstructionErrors();
            codeFeedback.html(errormessage);

            if (errormessage === "") {
                let cleaner = new AssemblyCleaner();
                cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);
                hazardousSet = [cleaner.cleanCode, cleaner.highlightingList];

                try {
                    // SOLVE CONTROL
                    let hazardSolver1 = new HazardSolver(hazardousSet[0],  0,[]);
                    hazardSolver1.solveControlHazard(cleaner.lineNumberByLabel);
                    controlHazardFreeSet = [hazardSolver1.code, hazardSolver1.highlightList];
                    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

                    controlHazardDetection = [hazardSolver1.numberOfHazards,hazardSolver1.lineNumbersWithHazards];

                    // SOLVE DATA
                    let hazardSolver2 = new HazardSolver(hazardousSet[0], 0,[]);
                    hazardSolver2.solveDataHazards();
                    dataHazardFreeSet = [hazardSolver2.code, hazardSolver2.highlightList];
                    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

                    dataHazardDetection = [hazardSolver2.numberOfHazards,hazardSolver2.lineNumbersWithHazards];

                    // SOLVE BOTH
                    let hazardSolver3 = new HazardSolver(controlHazardFreeSet[0], controlHazardDetection[0], controlHazardDetection[1]);
                    console.log("here");
                    hazardSolver3.solveDataHazards();
                    hazardFreeSet = [hazardSolver3.code, hazardSolver3.highlightList];

                    hazardDetection = [hazardSolver3.numberOfHazards,hazardSolver3.lineNumbersWithHazards];

                    // SOLVE CONTROL AGAIN
                    hazardSolver1 = new HazardSolver(hazardousSet[0], 0,[]);
                    hazardSolver1.solveControlHazard(cleaner.lineNumberByLabel);
                    controlHazardFreeSet = [hazardSolver1.code, hazardSolver1.highlightList];
                    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

                    console.log("control hazard detection:");
                    console.log(controlHazardDetection[0]);
                    console.log(controlHazardDetection[1]);
                    console.log("data hazard detection:");
                    console.log(dataHazardDetection[0]);
                    console.log(dataHazardDetection[1]);
                    console.log("hazard detection:");
                    console.log(hazardDetection[0]);
                    console.log(hazardDetection[1]);

                    beginPipelining = true;
                } catch (e) {
                    if (e.name === "InfiniteLoopException" || e.name === "DivisionByZeroException") {
                        codeFeedback.html(e.errorMessage);
                    } else {
                        throw e;
                    }
                }
            }
        }
    })

    editor.on("gutterClick", function(cm, n) {
        if (beginPipelining) {
            pipelineTable.highlightPipelineRowsOnClick(highlightingList, n);
        }
    });
});

function setCodeVersions() {

}






