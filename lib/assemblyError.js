class AssemblyError {

    constructor() {
        this.posIntExp = new RegExp('^([0-9]+)$');
        this.intExp = new RegExp('^(-?[0-9]+)$');
        this.labelsDeclared = {};
        this.memAddressesReserved = [];
    }

    regNameError(reg) {
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

    regMemAddressError(regAsMem, loadTrue) {
        if (typeof regAsMem === "undefined") {
            return "- memory address is missing\n";
        }
        regAsMem = regAsMem.trim();
        // if syntax is correct
        if (regAsMem.charAt(0) === "(" && regAsMem.endsWith(")") &&
            this.regNameError(regAsMem.substring(1, regAsMem.length-1)) === "") {
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
        return "- the memory address is invalid\n";
    }

    memAddressError(memAdd) {
        if (typeof memAdd === "undefined") {
            return "- memory address is missing\n";
        }
        memAdd = memAdd.trim();
        var offset = memAdd.substring(0, memAdd.indexOf("("));
        let reg = memAdd.substring(memAdd.indexOf("(") + 1, memAdd.indexOf(")"));
        if (this.posIntExp.test(offset) && this.regNameError(reg) === "") {
            return "";
        } return "- the memory address is invalid\n";
    }

    immediateValueError(imm) {
        if (typeof imm === "undefined") {
            return "- immediate value is missing\n";
        }
        imm = imm.trim();
        if (!this.intExp.test(imm)) {
            return "- the immediate value is invalid\n";
        }
        return "";
    }

    branchTargetError(branchTarget, lineNumber, numberOfLines) {
        if (typeof branchTarget === "undefined") {
            return "- branch target is missing\n";
        }
        branchTarget = branchTarget.trim();
        // if branch target is a memory address
        if (this.posIntExp.test(branchTarget)) {
            let branchAddress = parseInt(branchTarget) * 2 + lineNumber * 4;
            if (branchAddress > 0 && branchAddress <= (numberOfLines * 4)) {
                return "";
            } return "- branch address " + branchAddress + " is not found in code\n";
        } // if branch target is a label
        return this.existingLabelError(branchTarget);
    }

    newLabelError(label) {
        label = label.trim();
        if ((this.labelsDeclared)[label] === 0) {
            (this.labelsDeclared)[label] = 1;
            return "";
        } return "- the label name is already in use\n";
    }

    existingLabelError(label) {
        if (typeof label === "undefined") {
            return "- label is missing\n";
        }
        label = label.trim();
        if (typeof this.labelsDeclared[label + ":"] !== "undefined") {
            return "";
        } return "- the label is not found in code\n";
    }

    collectLabelsDeclared(codeArray) {
        for (var i = 0; i < codeArray.length; i++) {
            if (codeArray[i].includes(":")) {
                var label = codeArray[i].trim();
                if (!label.includes(" ") && label.endsWith(":") && !label.includes(",")) {
                    this.labelsDeclared[label] = 0;
                }
            }
        }
    }
}

module.exports = AssemblyError;