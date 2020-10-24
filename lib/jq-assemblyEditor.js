let hazardousSet;
let controlHazardFreeSet;
let dataHazardFreeSet;
let hazardFreeSet;

let beginPipelining;
let highlightingList;

$(document).ready(function () {

    let codeFeedback = $('#code-feedback');

    let editor = CodeMirror.fromTextArea($('#editor-textarea')[0], {
        lineNumbers: true,
        lineWrapping: true,
    });

    editor.setSize("100%", "100%");

    $('#pipeline-instructions-button').click(function () {
        if (!beginPipelining) {

            // TODO: run only once?
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
                    hazardSolver1.solveControlHazard(parser.labelsByLineNumber);
                    controlHazardFreeSet = [hazardSolver1.code, hazardSolver1.highlightingList];
                    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

                    // SOLVE DATA
                    let hazardSolver2 = new HazardSolver(hazardousSet[0]);
                    hazardSolver2.solveDataHazards();
                    dataHazardFreeSet = [hazardSolver2.code, hazardSolver2.highlightingList];
                    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

                    // SOLVE BOTH
                    console.log("SOLVE THEM ALL!");
                    let hazardSolver3 = new HazardSolver(controlHazardFreeSet[0]);
                    hazardSolver3.solveDataHazards();
                    hazardFreeSet = [hazardSolver3.code, hazardSolver3.highlightingList];

                    // SOLVE CONTROL AGAIN
                    hazardSolver1 = new HazardSolver(hazardousSet[0]);
                    hazardSolver1.solveControlHazard(parser.labelsByLineNumber);
                    controlHazardFreeSet = [hazardSolver1.code, hazardSolver1.highlightingList];
                    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);


                    // hazardSolver1.solveControlHazard(parser.labelsByLineNumber);

                    // var dataHazardFreeCodeClone = dataHazardFreeSet[0].slice();
                    // let hazardSolver3 = new HazardSolver(dataHazardFreeCodeClone);
                    // hazardSolver3.solveControlHazard(parser.labelsByLineNumber);
                    // hazardFreeSet = [hazardSolver3.code, hazardSolver3.highlightingList];


                    console.log("crude code");
                    console.log(crudeCode);
                    console.log("hazardous code");
                    console.log(hazardousSet[0]);
                    console.log("solved control hazards");
                    console.log(controlHazardFreeSet[0]);
                    console.log("solved data hazards");
                    console.log(dataHazardFreeSet[0]);
                    console.log("solved all hazards");
                    console.log(hazardFreeSet[0]);

                    beginPipelining = true;
                } catch (e) {
                    if (e.name === "InfiniteLoopException") {
                        codeFeedback.html("The code has an infinite loop");
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






