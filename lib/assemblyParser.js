const AssemblyError = require("./assemblyError");

class AssemblyParser {

    constructor() {
        this.arihtmeticOpcodes = new Map([
            ["a", ['add','addw','and']],
            ["d", ['div','divu']],
            ["m", ['mul','mulh','mulhsu']],
            ["o", ['or']],
            ["r", ['rem','remu']],
            ["s", ['sll','sllw','slt','sltu','sra','srl','sraw','srlw','sub','subw']],
            ["x", ['xor']]]);

        this.ae = new AssemblyError();
    }

    getAllInstructionErrors(code) {

        if (code === "") { return "Please type in code to pipeline" }

        var errorMessage = "";
        var codeArray = code.split("\n");
        let numberOfLines = codeArray.length;

        this.ae.collectLabelsDeclared(codeArray);

        for (var i = 0; i < numberOfLines; i++) {
            errorMessage += this.getInstructionErrors(codeArray[i], i, numberOfLines);
        }
        // Add error message title
        if (errorMessage !== "") {
            errorMessage = "Error in...\n" + errorMessage;
        }
        return errorMessage;
    }

    getInstructionErrors(inst, lineNumber, numberOfLines) {

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
            lineErrorMessage += this.ae.newLabelError(inst);
        }
        else {
            lineErrorMessage += this.ae.regNameError(f1);
            if (opcode === "lui" || opcode === "auipc") {
                lineErrorMessage += this.ae.immediateValueError(f2);
            } else if (opcode.charAt(0) === "b") {
                lineErrorMessage += this.ae.regNameError(f2) + this.ae.branchTargetError(f3, lineNumber, numberOfLines);
            }
            else if (opcode.includes("i") && !opcode.includes("div")) {
                lineErrorMessage += this.ae.regNameError(f2) + this.ae.immediateValueError(f3);
            }
            else if (opcode === "lr.d") {
                lineErrorMessage += this.ae.regMemAddressError(f2, true);
            }
            else if (opcode === "sc.d") {
                lineErrorMessage += this.ae.regNameError(f2) + this.ae.regMemAddressError(f3, false);
            }
            else if (opcode.charAt(0) === "l" ||
                (opcode.charAt(0) === "s" && opcode.length === 2) ||
                opcode === "jalr") {
                lineErrorMessage += this.ae.memAddressError(f2);
            }
            else if (opcode === "jal") {
                lineErrorMessage += this.ae.existingLabelError(f2);
            }
            else {
                var libAtChar = this.arihtmeticOpcodes.get(opcode.charAt(0));
                if (!(typeof libAtChar === "undefined" || !libAtChar.includes(opcode))) {
                    lineErrorMessage += this.ae.regNameError(f2) + this.ae.regNameError(f3);
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



