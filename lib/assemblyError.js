/**
 * Holds all functions to find errors in a single assembly instruction field.
 * Used by assemblyParser.js.
 */
class AssemblyError {

    /**
     * Constructor.
     * Initializes instance variables.
     */
    constructor() {
        this.positiveIntegerExp = new RegExp('^([0-9]+)$');
        this.integerExp = new RegExp('^(-?[0-9]+)$');
        this.labelsDeclared = {};
        this.memAddressesReserved = [];
    }

    /**
     * Finds errors in register field - if applicable.
     * @param reg - The register field string
     * @returns {string} - The error string
     */
    regNameError(reg) {
        if (typeof reg === "undefined") {
            return "- register is missing\n";
        }
        reg = reg.trim();
        // if syntax is correct
        if (reg.charAt(0) === "x") {
            var regNumber = reg.substring(1,reg.length);
            let regExp = new RegExp('^([0-9]|([0-9][0-9]))$');
            if (regExp.test(regNumber) && parseInt(regNumber) >=0 && parseInt(regNumber) < 32) {
                return "";
            }
        } return "- the register name \"" + reg + "\" is not recognized\n";
    }

    /**
     * Finds errors in field with a register holding a memory address - if applicable.
     * @param regAsMem - The memory address register field string
     * @param loadTrue - true if opcode is "lr.d", false if opcode is "sc.d"
     * @returns {string} - The error string
     */
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
            } return "";
        } return "- the memory address is invalid\n";
    }

    /**
     * Finds errors in memory address field - if applicable.
     * @param memAdd - The memory address field string
     * @returns {string} - The error string
     */
    memAddressError(memAdd) {
        if (typeof memAdd === "undefined") {
            return "- memory address is missing\n";
        }
        memAdd = memAdd.trim();
        var offset = memAdd.substring(0, memAdd.indexOf("("));
        let reg = memAdd.substring(memAdd.indexOf("(") + 1, memAdd.indexOf(")"));
        // if syntax is correct
        if (this.positiveIntegerExp.test(offset) && this.regNameError(reg) === "") {
            return "";
        } return "- the memory address is invalid\n";
    }

    /**
     * Finds errors in immediate field - if applicable.
     * @param imm - The immediate field string
     * @returns {string} - The error string
     */
    immediateValueError(imm) {
        if (typeof imm === "undefined") {
            return "- immediate value is missing\n";
        }
        imm = imm.trim();
        // if syntax is correct
        if (this.integerExp.test(imm)) {
            return "";
        }
        return "- the immediate value is invalid\n";
    }

    /**
     * Finds errors in branch target field - if applicable.
     * @param branchTarget - The branch target field string (either a label or an instruction address)
     * @param lineNumber - The line number of current instruction
     * @param numberOfLines - The total number of lines in assembly code
     * @returns {string} - The error string
     */
    branchTargetError(branchTarget, lineNumber, numberOfLines) {
        if (typeof branchTarget === "undefined") {
            return "- branch target is missing\n";
        }
        branchTarget = branchTarget.trim();
        // if branch target is an instruction address
        if (this.positiveIntegerExp.test(branchTarget)) {
            let branchAddress = parseInt(branchTarget) * 2 + lineNumber * 4;
            // if instruction at address is defined in assembly code
            if (branchAddress > 0 && branchAddress <= (numberOfLines * 4)) {
                return "";
            } return "- branch address " + branchAddress + " is not found in code\n";
        } // if branch target is a label
        return this.existingLabelError(branchTarget);
    }

    /**
     * Finds errors in label declaration - if applicable.
     * @param label - The label string
     * @returns {string} - The error string
     */
    newLabelError(label) {
        label = label.trim();
        // if label syntax is invalid
        if (typeof this.labelsDeclared[label] === "undefined") {
            return "- invalid label syntax\n";
        } // if label is not already declared (it is undiscovered)
        if ((this.labelsDeclared)[label] === 0) {
            // set label value to 1 in labelsDeclared array, to mark it as discovered
            (this.labelsDeclared)[label] = 1;
            return "";
        } return "- the label name is already in use\n";
    }

    /**
     * Finds errors in branch/jump label - if applicable.
     * @param label - The label string
     * @returns {string} - The error string
     */
    existingLabelError(label) {
        if (typeof label === "undefined") {
            return "- label is missing\n";
        }
        label = label.trim();
        // if branch/jump is a valid label declared in code
        if (typeof this.labelsDeclared[label + ":"] !== "undefined") {
            return "";
        } return "- the label is not found in code\n";
    }

    /**
     * Sets labelsDeclared array.
     * @param codeArray - Array of assembly code lines
     */
    collectLabelsDeclared(codeArray) {
        let labelsByLineNumber = {};
        // iterate instructions
        for (var i = 0; i < codeArray.length; i++) {
            // identify label declarations
            if (codeArray[i].includes(":")) {
                var label = codeArray[i].trim();
                // if label syntax is correct
                if (!label.includes(" ") &&
                    label.endsWith(":") &&
                    !label.includes(",")) {
                    // add to labelsDeclared array and set value to 0, to mark it as undiscovered
                    this.labelsDeclared[label] = 0;
                    labelsByLineNumber[label.substring(0,label.length-1)] = i;
                }
            }
        } return labelsByLineNumber;
    }
}

// window.AssemblyError = AssemblyError;
module.exports = AssemblyError;