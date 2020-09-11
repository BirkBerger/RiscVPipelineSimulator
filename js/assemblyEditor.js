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
        var codeArray = code.split("\n");

    })
});

function AssemblyParser() {

    this.opcodeLib2fields = new Map([
        ["a", ['auipc']],
        ["j", ['jal','jalr']],
        ["l", ['lb','lbu','ld','lh','lhu','lw','lwu','lui']],
        ["s", ['sb','sd','sh','sw']]]);

    this.opcodeLib3fields = new Map([
        ["a", ['add','addi','addiw','addw','and','andi']],
        ["b", ['beq','bge','bgeu','blt','bltu','bne']],
        ["d", ['div','divu']],
        ["m", ['mul','mulh','mulhsu','mulhu']],
        ["o", ['or','ori']],
        ["r", ['rem','remu']],
        ["s", ['sc.d','sll','slli','slliw','sllw','slt','slti','sltiu','sltu','sra','srai','srl','sraiw','sraw','srli','srliw','srlw','sub','subw']],
        ["x", ['xor','xori']]]);

    this.labelsDeclared = [];

    this.collectAllInstErrors = function(codeArray) {
        var errorMessage = "";
        for (var i = 0; i < codeArray.length; i++) {
            this.errorMessage += this.getInstErrors(codeArray[i], i);
        }
        // Add error message title
        if (this.errorMessage !== "") {
            this.errorMessage = "Error in...\n" + this.errorMessage;
        }
        return errorMessage;
    }

    this.getInstErrors = function(inst, lineNumber) {
        //$('#code-feedback').html(lineErrorMessage);
        var lineErrorMessage = "";
        var instArr = inst.split(",");
        var opcode = instArr[0].split(" ")[0].trim();
        var f1 = instArr[0].split(" ")[1];
        var f2 = instArr[1];

        if (instArr.length < 2 || instArr.length > 3) {
            lineErrorMessage += "- Expected 2 or 3 instruction fields but found " + instArr.length + "\n";
        }
        // check if field 1 is a valid register name
        lineErrorMessage += regNameError(f1);

        if (instArr.length === 2) {
            // check if opcode is valid
            lineErrorMessage += opcodeNameError(opcode, this.opcodeLib2fields);
            switch (opcode) {
                case "lui" || "auipc":
                    lineErrorMessage += immediateValueError(f2);
                    break;
                case "jal":
                    lineErrorMessage += this.labelsDeclared.includes(f2);
                    break;
                case "lr.d":
                    lineErrorMessage += regMemAddressError(f2);
                    break;
                default:
                    lineErrorMessage += memAddressError(f2);
                    break;

            }
        } else if (instArr.length === 3) {
            let f3 = instArr[2];
            // check if field 2 is a valid register name
            lineErrorMessage += regNameError(f2);
            // check if opcode is valid
            lineErrorMessage += opcodeNameError(opcode, this.opcodeLib3fields);
            // immediate operators
            if (opcode.includes("i")) {
                lineErrorMessage += immediateValueError(f3);
            }  // sc.d
            else if (opcode === "sc.d") {
                lineErrorMessage += regMemAddressError(f3);
            } // arithmetic and logical
            else if (opcode.charAt(0) === "b") {
                lineErrorMessage += labelNameError(f3);
            } else {
                lineErrorMessage += regNameError(f3);
            }
        }
        if (lineErrorMessage !== "") {
            lineErrorMessage = "line " + (lineNumber+1) + ":\n" + lineErrorMessage;
        }
        return lineErrorMessage;
    }

    function opcodeNameError(opcode, library) {
        var libAtChar = library.get(opcode.charAt(0));
        if (!(typeof libAtChar === "undefined" || !libAtChar.includes(opcode))) {
            return "";
        } return "- The instruction opcode \"" + opcode + "\" is not recognized\n";
    }

    function regNameError(reg) {
        reg.trim();
        if (reg.charAt(0) === "x") {
            var regNumber = reg.substring(1,reg.length);
            let regExp = new RegExp('^([0-9] | ([0-9][0-9]))$');
            if (regExp.test(regNumber) && parseInt(regNumber) >=0 && parseInt(regNumber) < 31) {
                return "";
            }
        } return "- The register name \"" + f1 + "\" is not recognized\n";
    }

    function regMemAddressError(regAsMem) {
        regAsMem.trim();
        if (regAsMem.charAt(0) === "(" && regAsMem.endsWith(")") &&
            regNameError(regAsMem.substring(1, regAsMem.length-1)) === "") {
            return "";
        }
        return "The memory address is invalid\n";
    }

    function memAddressError(memAdd) {
        memAdd.trim();
        var offset = memAdd.substring(0, memAdd.indexOf("("));
        var reg = memAdd.substring(memAdd.indexOf("(") + 1, memAdd.indexOf(")"));
        if (offset >= -524288 && offset < 524288 && regNameError(reg)) {
            return "";
        } return "The memory address is invalid\n";

    }

    function immediateValueError(imm) {
        let regExp = new RegExp('^([0-9]+)$');
        if (regExp.test(imm)) {
            return "- The immediate value must be an integer\n";
        } return "";
    }

    function labelNameError(label) {
        label.trim();
        if (!label.includes(" ")) {
            this.labelsDeclared.push(label);
            return "";
        } return "- Label name must not include spaces\n";
    }
}



