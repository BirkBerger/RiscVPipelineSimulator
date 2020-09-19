$(document).ready(function() {
    var code = "";

    alert("heyo");

    var editor = CodeMirror.fromTextArea($('#assembly-editor')[0], {
        lineNumbers: true,
        mode: { name : 'verilog'},
        theme: 'eclipse',
    });
    editor.setSize("250","500");

    alert("lleeo");
    $('#pipeline-instructions-button').click(function() {

        code = editor.getValue();
        // var parser = new AssemblyParser();
        // let errormessage = parser.getAllInstructionErrors(code);
        // $('#code-feedback').html(errormessage);
    })
});




