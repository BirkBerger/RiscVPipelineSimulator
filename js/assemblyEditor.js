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
        alert(code);
    })
});

function AssemblyEditor() {

    this.instructions = {
        "a": ['add','addi','addiw','addw','and','andi','auipc'],
        "b": ['beq','bge','bgeu','blt','bltu','bne'],
        "d": ['div','divu'],
        "j": ['jal','jalr'],
        "l": ['lb','lbu','ld','lh','lhu','lr.d','lw','lwu','lui'],
        "m": ['mul','mulh','mulhsu','mulhu'],
        "o": ['or','ori'],
        "r": ['rem','remu'],
        "s": ['sb','sc.d','sd','sh','sw','sll','slli','slliw','sllw','slt','slti','sltiu','sltu','sra','srai','srl','sraiw','sraw','srli','srliw','srlw','sub','subw'],
        "x": ['xor','xori']};

    this.instructionHasErrors = function(instruction) {



    }
}



