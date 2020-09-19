$(document).ready(function () {

    var code = "";

    var editor = CodeMirror.fromTextArea($('#assembly-editor')[0], {
        lineNumbers: true,
        mode: {name: 'verilog'},
        theme: 'eclipse',
    });
    editor.setSize("250", "500");

    alert("hello");
    $('#pipeline-instructions-button').click(function () {
        code = editor.getValue();
        var parser = new AssemblyParser();
        let errormessage = parser.getAllInstructionErrors(code);
        $('#code-feedback').html(errormessage);
    })
});





