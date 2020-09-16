const AssemblyError = require("./assemblyError");

function AssemblyParser() {

    this.arihtmeticOpcodes = new Map([
        ["a", ['add','addw','and']],
        ["d", ['div','divu']],
        ["m", ['mul','mulh','mulhsu']],
        ["o", ['or']],
        ["r", ['rem','remu']],
        ["s", ['sll','sllw','slt','sltu','sra','srl','sraw','srlw','sub','subw']],
        ["x", ['xor']]]);

    let ae = new AssemblyError();

    this.getAllInstructionErrors = function(code) {

        if (code === "") { return "Please type in code to pipeline" }

        var errorMessage = "";
        var codeArray = code.split("\n");
        let numberOfLines = codeArray.length;

        ae.collectLabelsDeclared(codeArray);

        for (var i = 0; i < numberOfLines; i++) {
            errorMessage += this.getInstructionErrors(codeArray[i], i, numberOfLines);
        }
        // Add error message title
        if (errorMessage !== "") {
            errorMessage = "Error in...\n" + errorMessage;
        }
        return errorMessage;
    }

    this.getInstructionErrors = function(inst, lineNumber, numberOfLines) {

        if (inst === "") { return "";}
        var lineErrorMessage = "";
        let instArr = inst.split(",");
        let opcodeAndField1 = instArr[0].trim();
        let opcode = opcodeAndField1.substring(0,opcodeAndField1.indexOf(" "));
        let f1 = opcodeAndField1.substring(opcodeAndField1.indexOf(" ")+1,opcodeAndField1.length);
        let f2 = instArr[1];
        let f3 = instArr[2];

        if (instArr.length > 3) {
            lineErrorMessage += "- Unexpected number of instruction fields\n";
        }
        else if (inst.includes(":")) {
            lineErrorMessage += ae.newLabelError(inst);
        }
        else {
            lineErrorMessage += ae.regNameError(f1);
            if (opcode === "lui" || opcode === "auipc") {
                lineErrorMessage += ae.immediateValueError(f2);
            } else if (opcode.charAt(0) === "b") {
                lineErrorMessage += ae.regNameError(f2) + ae.branchTargetError(f3, lineNumber, numberOfLines);
            }
            else if (opcode.includes("i") && !opcode.includes("div")) {
                lineErrorMessage += ae.regNameError(f2) + ae.immediateValueError(f3);
            }
            else if (opcode === "lr.d") {
                lineErrorMessage += ae.regMemAddressError(f2, true);
            }
            else if (opcode === "sc.d") {
                lineErrorMessage += ae.regNameError(f2) + ae.regMemAddressError(f3, false);
            }
            else if (opcode.charAt(0) === "l" ||
                (opcode.charAt(0) === "s" && opcode.length === 2) ||
                opcode === "jalr") {
                lineErrorMessage += ae.memAddressError(f2);
            }
            else if (opcode === "jal") {
                lineErrorMessage += ae.existingLabelError(f2);
            }
            else {
                var libAtChar = this.arihtmeticOpcodes.get(opcode.charAt(0));
                if (!(typeof libAtChar === "undefined" || !libAtChar.includes(opcode))) {
                    lineErrorMessage += ae.regNameError(f2) + ae.regNameError(f3);
                } else {
                    lineErrorMessage += "- the opcode \"" + opcode + "\" is not recognized\n";
                }
            }
        }

        if (lineErrorMessage !== "") {
            lineErrorMessage = "line " + (lineNumber + 1) + ":\n" + lineErrorMessage;
        }
        return lineErrorMessage;
    }
}

module.exports = AssemblyParser;



