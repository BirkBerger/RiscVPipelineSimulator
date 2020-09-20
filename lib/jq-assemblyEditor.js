var fillPipeline;
var parser;

$(document).ready(function () {

    var editor = CodeMirror.fromTextArea($('#assembly-editor')[0], {
        lineNumbers: true,
        mode: {name: 'verilog'},
        theme: 'eclipse',
    });
    editor.setSize("250", "500");

    $('#pipeline-instructions-button').click(function () {
        fillPipeline = false;
        code = editor.getValue();
        parser = new AssemblyParser(code);
        let errormessage = parser.getAllInstructionErrors();
        $('#code-feedback').html(errormessage);

        if (errormessage === "") {
            fillPipeline = true;
        }
    })
});





