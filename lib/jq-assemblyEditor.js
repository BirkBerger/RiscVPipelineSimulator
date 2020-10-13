var parser;
var cleaner;
var noErrorAssemblyCode;

$(document).ready(function () {

    var editor = CodeMirror.fromTextArea($('#assembly-editor')[0], {
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
            var interpreter = new AssemblyInterpreter();
            interpreter.interpretCleanAssemblyCode(cleaner.cleanAssemblyCode);
            noErrorAssemblyCode = true;
        }
    })
});





