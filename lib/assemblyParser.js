function AssemblyParser() {

    this.arihtmeticOpcodes = new Map([
        ["a", ['add','addw','and']],
        ["d", ['div','divu']],
        ["m", ['mul','mulh','mulhsu']],
        ["o", ['or']],
        ["r", ['rem','remu']],
        ["s", ['sll','sllw','slt','sltu','sra','srl','sraw','srlw','sub','subw']],
        ["x", ['xor']]]);

    this.labelsDeclared = [];
    this.memAddressesReserved = [];

    this.getAllInstructionErrors = function(code) {
        var errorMessage = "";
        var codeArray = code.split("\n");
        let numberOfLines = codeArray.length;
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
        var lineErrorMessage = "";
        let instArr = inst.split(",");
        let opcode = instArr[0].split(" ")[0].trim();
        let f1 = instArr[0].split(" ")[1];
        let f2 = instArr[1];
        let f3 = instArr[2];

        // check if field 1 is a valid register name
        lineErrorMessage += regNameError(f1);

        if (instArr.length > 3) {
            lineErrorMessage += "- Unexpected number of instruction fields\n";
        }
        else if (opcode === "lui" || opcode === "auipc") {
            lineErrorMessage += immediateValueError(f2);
        }
        else if (opcode.includes("i")) {
            lineErrorMessage += regNameError(f2) + immediateValueError(f3);
        }
        else if (opcode.charAt(0) === "b") {
            lineErrorMessage += regNameError(f2) + branchTargetError(f3, numberOfLines);
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
            lineErrorMessage += this.labelsDeclared.includes(f2);
        }
        else {
            var libAtChar = this.arihtmeticOpcodes.get(opcode.charAt(0));
            if (!(typeof libAtChar === "undefined" || !libAtChar.includes(opcode))) {
                lineErrorMessage += regNameError(f3);
            } else {
                lineErrorMessage += labelError(inst);
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
        reg.trim();
        if (reg.charAt(0) === "x") {
            var regNumber = reg.substring(1,reg.length);
            let regExp = new RegExp('^([0-9]|([0-9][0-9]))$');
            if (regExp.test(regNumber) && parseInt(regNumber) >=0 && parseInt(regNumber) < 31) {
                return "";
            }
        } return "- the register name \"" + reg + "\" is not recognized\n";
    }

    function regMemAddressError(regAsMem, loadTrue) {
        if (typeof regAsMem === "undefined") {
            return "- register is missing\n";
        }
        regAsMem.trim();
        // if syntax is correct
        if (regAsMem.charAt(0) === "(" && regAsMem.endsWith(")") &&
            regNameError(regAsMem.substring(1, regAsMem.length-1)) === "") {
            // if lr.d
            if (loadTrue) {
                this.memAddressesReserved.push(regAsMem);
                return "";
            } // if sc.d
            else if (!this.memAddressesReserved.includes(regAsMem)){
                return "- memory address has not been reserved\n"
            }
            return "";
        }
        return "the memory address is invalid\n";
    }

    function memAddressError(memAdd) {
        if (typeof memAdd === "undefined") {
            return "- memory address is missing\n";
        }
        memAdd.trim();
        var offset = memAdd.substring(0, memAdd.indexOf("("));
        let reg = memAdd.substring(memAdd.indexOf("(") + 1, memAdd.indexOf(")"));
        if (intExp.test(offset) && regNameError(reg)) {
            return "";
        } return "the memory address is invalid\n";
    }

    function immediateValueError(imm) {
        if (typeof imm === "undefined") {
            return "- immediate value is missing\n";
        }
        imm.trim();
        if (intExp.test(imm)) {
            return "- the immediate value must be an integer\n";
        }
        return "";
    }

    function branchTargetError(branchTarget, numberOfLines) {
        if (typeof branchTarget === "undefined") {
            return "- branch target is missing\n";
        }
        branchTarget.trim();
        if (intExp.test(branchTarget)) {
            let branchAddress = parseInt(branchTarget)*2+this.lineNumber;
            if (branchAddress > 0 && branchAddress <= numberOfLines) {
                return "";
            } return "- branch address is not found in code\n"
        }
        return labelError(branchTarget);
    }

    function labelError(label) {
        if (typeof label === "undefined") {
            return "";
        }
        label.trim();
        if (label.endsWith(":") && !label.includes(" ")) {
            this.labelsDeclared.push(branchTarget);
            return "";
        } return "- the instruction is not recognized\n";
    }

    function missingFieldError(fieldString, fieldType) {
        if (typeof fieldString === "undefined") {
            return "- " + fieldType + " is missing";
        } return fieldString.trim();
    }
}

module.exports = AssemblyParser;



