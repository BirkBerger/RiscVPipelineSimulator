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
                    let hazardSolver1 = new HazardSolver(hazardousSet[0]);
                    hazardSolver1.solveControlHazard(cleaner.lineNumberByLabel);
                    controlHazardFreeSet = [hazardSolver1.code, hazardSolver1.highlightList];
                    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

                    // SOLVE DATA
                    let hazardSolver2 = new HazardSolver(hazardousSet[0]);
                    hazardSolver2.solveDataHazards();
                    dataHazardFreeSet = [hazardSolver2.code, hazardSolver2.highlightList];
                    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

                    // SOLVE BOTH
                    let hazardSolver3 = new HazardSolver(controlHazardFreeSet[0]);
                    hazardSolver3.solveDataHazards();
                    hazardFreeSet = [hazardSolver3.code, hazardSolver3.highlightList];

                    // SOLVE CONTROL AGAIN
                    hazardSolver1 = new HazardSolver(hazardousSet[0]);
                    hazardSolver1.solveControlHazard(cleaner.lineNumberByLabel);
                    controlHazardFreeSet = [hazardSolver1.code, hazardSolver1.highlightList];
                    cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);

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






