let hazardousSet;
let controlHazardFreeSet;
let dataHazardFreeSet;
let hazardFreeSet;

let value1;
let value2;
let value3;
let value4;

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

        // TODO: run only once?
        let crudeCode = editor.getValue();
        let parser = new AssemblyParser(crudeCode);
        let errormessage = parser.getAllInstructionErrors();
        codeFeedback.html(errormessage);
        console.log("crude code");
        console.log(crudeCode);

        if (errormessage === "") {
            let cleaner = new AssemblyCleaner();
            cleaner.cleanAssemblyCode(crudeCode, parser.instructionSignals);
            hazardousSet = [cleaner.cleanCode,cleaner.highlightingList];
            console.log("cleaned code");
            console.log(hazardousSet[0]);
            value1 = 1;

            try {
                // alert(hazardousSet[0]);
                let hazardSolver1 = new HazardSolver(hazardousSet[0]);
                hazardSolver1.solveControlHazard(parser.labelsByLineNumber);
                controlHazardFreeSet = [hazardSolver1.code,hazardSolver1.highlightingList];
                console.log("solved control hazards");
                console.log(controlHazardFreeSet[0]);
                value2 = 2;

                // alert(2);
                // alert(hazardousSet[0]);
                // alert(controlHazardFreeSet[0]);
                let hazardSolver2 = new HazardSolver(hazardousSet[0]);
                hazardSolver2.solveDataHazards();
                dataHazardFreeSet = [hazardSolver2.code,hazardSolver2.highlightingList];
                console.log("solved data hazards");
                console.log(dataHazardFreeSet[0]);
                value3 = 3;

                // alert(value3);
                // alert(hazardousSet[0]);
                // alert(dataHazardFreeSet[0]);
                let hazardSolver3 = new HazardSolver(controlHazardFreeSet[0]);
                hazardSolver3.solveDataHazards();
                hazardFreeSet = [hazardSolver3.code,hazardSolver3.highlightingList];
                console.log("solved all hazards");
                console.log(hazardFreeSet[0]);
                value4 = 4;

                // alert(value4);
                // alert(hazardousSet[0]);
                // alert(hazardFreeSet[0]);
                beginPipelining = true;
            } catch(e) {
                if (e.name === "InfiniteLoopException") {
                    codeFeedback.html("The code has an infinite loop");
                } else {
                    throw e;
                }
            }

            // alert(value1);
            let tableWrapper = $('.table-wrapper');

            tableWrapper.empty();

            pipelineTable = new PipelineTable();
            pipelineTable.setHazardousHTMLTable(hazardousSet[0]);
            codeInPipeline = hazardousSet[0];
            highlightingList = hazardousSet[1];

            tableWrapper.append(pipelineTable.htmlTable);

            $('#pipeline-table').DataTable();

            alert('hey');
        }
    })

    editor.on("gutterClick", function(cm, n) {
        if (beginPipelining) {
            pipelineTable.highlightPipelineRowsOnClick(highlightingList, n);
        }
    });
});






