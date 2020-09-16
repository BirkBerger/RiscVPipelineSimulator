function AssemblyParser() {

    this.arihtmeticOpcodes = new Map([
        ["a", ['add','addw','and']],
        ["d", ['div','divu']],
        ["m", ['mul','mulh','mulhsu']],
        ["o", ['or']],
        ["r", ['rem','remu']],
        ["s", ['sll','sllw','slt','sltu','sra','srl','sraw','srlw','sub','subw']],
        ["x", ['xor']]]);

    var labelsDeclared = [];
    var memAddressesReserved = [];

    this.getAllInstructionErrors = function(code) {
        var errorMessage = "";
        var codeArray = code.split("\n");
        let numberOfLines = codeArray.length;
        labelsDeclared = collectLabelsFromCode(codeArray);

        for (var i = 0; i < numberOfLines; i++) {
            errorMessage += this.getInstructionErrors(codeArray[i], i, numberOfLines);
        }
        // Add error message title
        if (errorMessage !== "") {
            errorMessage = "Error in...\n" + errorMessage;
        }
        return errorMessage;
    }

    let intExp = new RegExp('^([0-9]+)$');

    this.getInstructionErrors = function(inst, lineNumber, numberOfLines) {

        if (inst === "") {
            return "";
        }

        var lineErrorMessage = "";
        let instArr = inst.split(",");
        let opcode = instArr[0].split(" ")[0].trim();
        let f1 = instArr[0].split(" ")[1];
        let f2 = instArr[1];
        let f3 = instArr[2];

        if (instArr.length > 3) {
            lineErrorMessage += "- Unexpected number of instruction fields\n";
        }
        else if (inst.includes(":")) {
            lineErrorMessage += newLabelError(inst);
        }
        else {
            lineErrorMessage += regNameError(f1);
            if (opcode === "lui" || opcode === "auipc") {
                lineErrorMessage += immediateValueError(f2);
            } else if (opcode.charAt(0) === "b") {
                lineErrorMessage += regNameError(f2) + branchTargetError(f3, lineNumber, numberOfLines);
            }
            else if (opcode.includes("i") && !opcode.includes("div")) {
                lineErrorMessage += regNameError(f2) + immediateValueError(f3);
            }
            else if (opcode === "lr.d") {
                lineErrorMessage += regMemAddressError(f2);
            }
            else if (opcode === "sc.d") {
                lineErrorMessage += regNameError(f2) + regMemAddressError(f3);
            }
            else if (opcode.charAt(0) === "l" ||
                (opcode.charAt(0) === "s" && opcode.length === 2) ||
                opcode === "jalr") {
                lineErrorMessage += memAddressError(f2);
            }
            else if (opcode === "jal") {
                lineErrorMessage += existingLabelError(f2);
            }
            else {
                var libAtChar = this.arihtmeticOpcodes.get(opcode.charAt(0));
                if (!(typeof libAtChar === "undefined" || !libAtChar.includes(opcode))) {
                    lineErrorMessage += regNameError(f2) + regNameError(f3);
                } else {
                    lineErrorMessage += "- the instruction is not recognized\n";
                }
            }
        }

        if (lineErrorMessage !== "") {
            lineErrorMessage = "line " + (lineNumber + 1) + ":\n" + lineErrorMessage;
        }
        return lineErrorMessage;
    }

    function regNameError(reg) {
        if (typeof reg === "undefined") {
            return "- register is missing\n";
        }
        reg = reg.trim();
        if (reg.charAt(0) === "x") {
            var regNumber = reg.substring(1,reg.length);
            let regExp = new RegExp('^([0-9]|([0-9][0-9]))$');
            if (regExp.test(regNumber) && parseInt(regNumber) >=0 && parseInt(regNumber) < 32) {
                return "";
            }
        } return "- the register name \"" + reg + "\" is not recognized\n";
    }

    function regMemAddressError(regAsMem, loadTrue) {
        if (typeof regAsMem === "undefined") {
            return "- memory address is missing\n";
        }
        regAsMem = regAsMem.trim();
        // if syntax is correct
        if (regAsMem.charAt(0) === "(" && regAsMem.endsWith(")") &&
            regNameError(regAsMem.substring(1, regAsMem.length-1)) === "") {
            // if lr.d
            if (loadTrue) {
                memAddressesReserved.push(regAsMem);
                return "";
            } // if sc.d
            else if (!memAddressesReserved.includes(regAsMem)){
                return "- memory address has not been reserved\n"
            }
            return "";
        }
        return "- the memory address is invalid\n";
    }

    function memAddressError(memAdd) {
        if (typeof memAdd === "undefined") {
            return "- memory address is missing\n";
        }
        memAdd = memAdd.trim();
        var offset = memAdd.substring(0, memAdd.indexOf("("));
        let reg = memAdd.substring(memAdd.indexOf("(") + 1, memAdd.indexOf(")"));
        if (intExp.test(offset) && regNameError(reg) === "") {
            return "";
        } return "- the memory address is invalid\n";
    }

    function immediateValueError(imm) {
        if (typeof imm === "undefined") {
            return "- immediate value is missing\n";
        }
        imm = imm.trim();
        if (!intExp.test(imm)) {
            return "- the immediate value is invalid\n";
        }
        return "";
    }

    function branchTargetError(branchTarget, lineNumber, numberOfLines) {
        if (typeof branchTarget === "undefined") {
            return "- branch target is missing\n";
        }
        branchTarget = branchTarget.trim();
        // if branch target is a memory address
        if (intExp.test(branchTarget)) {
            let branchAddress = parseInt(branchTarget) * 2 + lineNumber * 4;
            if (branchAddress > 0 && branchAddress <= (numberOfLines * 4)) {
                return "";
            } return "- branch address " + branchAddress + " is not found in code\n";
        } // if branch target is a label
        return existingLabelError(branchTarget);
    }

    function newLabelError(label) {
        if (labelsDeclared[label] === 0) {
            labelsDeclared[label] = 1;
            return "";
        } return "- the label name is already in use\n";
    }

    function existingLabelError(label) {
        if (typeof label === "undefined") {
            return "- label is missing\n";
        }
        label = label.trim();
        if (typeof labelsDeclared[label + ":"] !== "undefined") {
            return "";
        } return "- the label is not found in code\n";
    }

    function collectLabelsFromCode(codeArray) {
        var labels = {};
        for (var i = 0; i < codeArray.length; i++) {
            if (codeArray[i].includes(":")) {
                var label = codeArray[i].trim();
                if (!label.includes(" ") && label.endsWith(":") && !label.includes(",")) {
                    labels[label] = 0;
                }
            }
        } return labels;
    }

}

module.exports = AssemblyParser;



