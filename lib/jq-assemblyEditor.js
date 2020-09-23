var fillPipeline;
var parser;
var compiler;

$(document).ready(function () {

    var editor = CodeMirror.fromTextArea($('#assembly-editor')[0], {
        lineNumbers: true,
        mode: {name: 'verilog'},
        theme: 'eclipse',
    });

    $('#pipeline-instructions-button').click(function () {
        fillPipeline = false;
        code = editor.getValue();
        parser = new AssemblyParser(code);
        let errormessage = parser.getAllInstructionErrors();
        $('#code-feedback').html(errormessage);

        if (errormessage === "") {
            compiler = new AssemblyCompiler();
            compiler.storeCode(code);
            fillPipeline = true;
            console.log(compiler.assemblyCode);
        }
    })
});





