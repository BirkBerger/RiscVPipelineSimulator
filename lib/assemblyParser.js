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
    this.memAddressesReserved = [];

    this.collectAllInstErrors = function(code) {
        var codeArray = code.split("\n");
        var errorMessage = "";
        let numberOfLines = codeArray.length;
        for (var i = 0; i < numberOfLines; i++) {
            this.errorMessage += this.getInstErrors(codeArray[i], i, numberOfLines);
        }
        // Add error message title
        if (this.errorMessage !== "") {
            this.errorMessage = "Error in...\n" + this.errorMessage;
        }
        return errorMessage;
    }

    let intExp = new RegExp('^([0-9]+)$');

    this.getInstErrors = function(inst, lineNumber, numberOfLines) {

        var lineErrorMessage = "";
        let instArr = inst.split(",");
        let opcode = instArr[0].split(" ")[0].trim();
        let f1 = instArr[0].split(" ")[1];
        let f2 = instArr[1];

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
            // define instruction field 3
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
                lineErrorMessage += branchTargetError(f3, numberOfLines);
            } else {
                lineErrorMessage += regNameError(f3);
            }
        } else if (instArr.length === 1) {
            lineErrorMessage += labelError();
        } else {
            lineErrorMessage += "- Unexpected number of instruction fields " + instArr.length + "\n";
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
        } return "- The register name \"" + reg + "\" is not recognized\n";
    }

    function regMemAddressError(regAsMem, loadTrue) {
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
                return "- Memory address has not been reserved"
            }
            return "";
        }
        return "The memory address is invalid\n";
    }

    function memAddressError(memAdd) {
        memAdd.trim();
        var offset = memAdd.substring(0, memAdd.indexOf("("));
        let reg = memAdd.substring(memAdd.indexOf("(") + 1, memAdd.indexOf(")"));
        if (intExp.test(offset) && regNameError(reg)) {
            return "";
        } return "The memory address is invalid\n";
    }

    function immediateValueError(imm) {
        imm.trim();
        if (intExp.test(imm)) {
            return "- The immediate value must be an integer\n";
        } return "";
    }

    function branchTargetError(branchTarget, numberOfLines) {
        branchTarget.trim();
        if (intExp.test(branchTarget)) {
            let branchAddress = parseInt(branchTarget)*2+this.lineNumber;
            if (branchAddress > 0 && branchAddress <= numberOfLines) {
                return "";
            } return "- Branch address is not found in code"
        }
        return labelError(branchTarget);
    }

    function labelError(label) {
        label.trim();
        if (label.endsWith(":") && !label.includes(" ")) {
            this.labelsDeclared.push(branchTarget);
            return "";
        } return "- Invalid label declaration\n";
    }

    // module.exports = {
    //     collectAllInstErrors: this.collectAllInstErrors(code)
    // };
}

module.exports = AssemblyParser;



