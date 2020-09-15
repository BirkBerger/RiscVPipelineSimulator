$(document).ready(function() {

    var code = "";

    var editor = CodeMirror.fromTextArea($('#assembly-editor')[0], {
        lineNumbers: true,
        mode: 'lib/verilog',
        theme: 'eclipse',
    });
    editor.setSize("250","500");

    $('#pipeline-instructions-button').click(function() {
        code = editor.getValue();
        var parser = new AssemblyParser();
        let errormessage = parser.getAllInstructionErrors(codeArray);
        $('#code-feedback').html(errormessage);
    })
});




