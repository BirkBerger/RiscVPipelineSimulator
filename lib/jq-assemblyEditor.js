// var editor;
// var parser;
// var cleaner;
// var interpreter;
// var noErrorAssemblyCode;
var code;
var codeCleaned;


$(document).ready(function () {

    let editor = CodeMirror.fromTextArea($('#editor-textarea')[0], {
        lineNumbers: true,
        // mode: {name: 'verilog'},
        // theme: 'eclipse',
        lineWrapping: true,
    });

    editor.setSize("100%", "100%");


    $('#pipeline-instructions-button').click(function () {
        // noErrorAssemblyCode = false;
        code = editor.getValue();
        parser = new AssemblyParser(code);
        let errormessage = parser.getAllInstructionErrors();
        $('#code-feedback').html(errormessage);

        if (errormessage === "") {
            cleaner = new AssemblyCleaner();
            cleaner.cleanAssemblyCode(code, parser.instructionSignals);
            code = cleaner.cleanCode;
            codeCleaned = true;
            // try {
            //     interpreter = new AssemblyInterpreter(parser.labelsByLineNumber);
            //     interpreter.interpretCleanAssemblyCode(cleaner.cleanCode);
            //     console.log(interpreter.interpretedCode);
            //     console.log(interpreter.highlightingList);
            //     noErrorAssemblyCode = true;
            // } catch(e) {
            //     if (e.name === "InfiniteLoopException") {
            //         $('#code-feedback').html("The code has an infinite loop");
            //     } else {
            //         throw e
            //     }
            // }

            console.log(code);
        }
    })

    editor.on("gutterClick", function(cm, n) {
        if (codeCleaned) {
            pipelineTable.highlightPipelineRows(highlightingList, n);

            // $('#pipeline-table tr').css('background', 'white');
            //
            // // highlight all table rows connected to clicked assembly code line
            // let highlightingList = interpreter.highlightingList;
            //
            // for (var i = 0; i < highlightingList[n].length; i++) {
            //     let tableRow = highlightingList[n][i];
            //     let rowHTML = "#pipeline-table tr:nth-child(" + (tableRow+1) + ")";
            //     $(rowHTML).css('background', '#91D8DB');
            // }
        }
    });
});





