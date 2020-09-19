$(document).ready(function () {

    var code = "";

    var editor = CodeMirror.fromTextArea($('#assembly-editor')[0], {
        lineNumbers: true,
        mode: {name: 'verilog'},
        theme: 'eclipse',
    });
    editor.setSize("250", "500");

    $('#pipeline-instructions-button').click(function () {
        code = editor.getValue();
        var parser = new AssemblyParser();
        let errormessage = parser.getAllInstructionErrors(code);
        alert(code);
        alert(errormessage);
        $('#code-feedback').html(errormessage);
    })
});

// const AssemblyParser = require("./assemblyParser");





