var editor;
var parser;
var cleaner;
var interpreter;
var noErrorAssemblyCode;

$(document).ready(function () {

    editor = CodeMirror.fromTextArea($('#assembly-editor')[0], {
        lineNumbers: true,
        mode: {name: 'verilog'},
        theme: 'eclipse',
    });

    $('#pipeline-instructions-button').click(function () {
        noErrorAssemblyCode = false;
        code = editor.getValue();
        parser = new AssemblyParser(code);
        let errormessage = parser.getAllInstructionErrors();
        $('#code-feedback').html(errormessage);

        if (errormessage === "") {
            cleaner = new AssemblyCleaner();
            cleaner.cleanAssemblyCode(code, parser.instructionSignals);
            try {
                interpreter = new AssemblyInterpreter(parser.labelsByLineNumber);
            } catch(e) {
                if (e.name === "InfiniteLoopException") {
                    console.log(e.message);
                } else {
                    throw e
                }
            }
            interpreter.interpretCleanAssemblyCode(cleaner.cleanCode);
            console.log(interpreter.interpretedCode);
            console.log(interpreter.highlightingList);
            noErrorAssemblyCode = true;
        }
    })
});





