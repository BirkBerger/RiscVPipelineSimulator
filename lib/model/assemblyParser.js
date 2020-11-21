// For testing:
// const AssemblyErrorDetector = require("../../lib/model/assemblyErrorDetector");
/**
 * Finds error in assembly code if applicable.
 * Returns the error as a string to be shown in the "code-feedback" textarea.
 */
class AssemblyParser {

    /**
     * Constructor.
     * @param code - The crude assembly code string directly from the assembly editor text area (with or without syntax area).
     */
    constructor(code) {
        this.arihtmeticOpcodes = new Map([
            ["a", ['add','addw','and']],
            ["d", ['div','divu','divw','divuw']],
            ["m", ['mul','mulh','mulhsu','mulw']],
            ["o", ['or']],
            ["r", ['rem','remu','remuw','remw']],
            ["s", ['sll','sllw','slt','sltu','sra','srl','sraw','srlw','sub','subw']],
            ["x", ['xor']]]);
        this.branchOpcodes = ['beq','bne','blt','bge','bltu','bgeu'];
        this.immediateOpcodes = ['addi','andi','addiw','ori','srai','srli','slli','slti','sltiu','slliw','srliw','sraiw','xori'];
        this.ae = new AssemblyErrorDetector();
        this.code = code;
        this.codeArray = {};
        this.instructionSignals = [];
        this.lineNumberByLabels = {};
    }

    initializeInstructionSignals(numberOfLines) {
        this.instructionSignals = new Array(numberOfLines);
        // initialize the two signals for each instruction
        // 1st: if instruction writes rd
        // 2nd: the register name from a mem address access
        // 3rd: if store, load or jalr instruction
        for (var i = 0; i < numberOfLines; i++) {
            this.instructionSignals[i] = [true, "", false];
        }
    }

    /**
     * Iterates over each line of assembly code,
     * and appends each local error string (related to that line)
     * to one large global error string.
     * @returns {string} - The global error string.
     */
    getAllInstructionErrors() {
        // return error if assembly editor is empty
        if (this.code === "") { return "Please type in code to pipeline" }

        var errorMessage = "";
        this.codeArray = this.code.split("\n");
        let numberOfLines = this.codeArray.length;
        this.initializeInstructionSignals(numberOfLines);

        // detect all labels declared in code
        this.lineNumberByLabels = this.ae.collectLabelsDeclared(this.codeArray);

        // iterate over each assembly code line
        for (var i = 0; i < numberOfLines; i++) {
            errorMessage += this.getInstructionErrors(this.codeArray[i], i, numberOfLines);
        }
        // add error message title
        if (errorMessage !== "") {
            errorMessage = "Error in...\n" + errorMessage;
        }
        return errorMessage;
    }

    /**
     * Computes the error string of one input assembly line.
     * Returns the empty string if the assembly line contains no errors.
     * @param inst - The assembly line (or instruction).
     * @param lineNumber - The line number of the input instruction.
     * @param numberOfLines - The total number of lines in assembly code.
     * @returns {string} - The error string of the input instruction.
     */
    getInstructionErrors(inst, lineNumber, numberOfLines) {

        // allow instruction to be empty
        if (inst === "") { return "";}
        var lineErrorMessage = "";
        // split instruction into fields
        let instArr = inst.split(",");
        let opcodeAndField1 = instArr[0].trim();
        let opcode = opcodeAndField1.substring(0,opcodeAndField1.indexOf(" "));
        let f1 = opcodeAndField1.substring(opcodeAndField1.indexOf(" ")+1,opcodeAndField1.length);
        let f2 = instArr[1];
        let f3 = instArr[2];

        // allow no more than opcode and 3 potential fields
        if (instArr.length > 3) {
            lineErrorMessage += "\t\t- unexpected number of instruction fields\n";
        }
        // if the instruction is a label declaration
        else if (inst.includes(":")) {
            lineErrorMessage += this.ae.newLabelError(inst);
            this.instructionSignals[lineNumber][0] = false;
        }
        // find the group of opcodes that the instruction belongs to
        // check syntax of fields and set instruction signals according to group
        else {
            // check that field 1 is a valid register name - applies to all non-label instruction
            lineErrorMessage += this.ae.regNameError(f1);

            // if "lui" or "auipc" instruction
            if (opcode === "lui" || opcode === "auipc") {
                lineErrorMessage += this.ae.immediateValueError(f2);
                if (opcode === "auipc") {
                    this.instructionSignals[lineNumber][0] = false;
                }
            }
            // if branch instruction
            else if (opcode.charAt(0) === "b" && this.branchOpcodes.includes(opcode)) {
                lineErrorMessage += this.ae.regNameError(f2) + this.ae.branchTargetError(f3, lineNumber, numberOfLines);
                this.instructionSignals[lineNumber][0] = false;
            }
            // if immediate instruction
            else if (opcode.includes("i") && this.immediateOpcodes.includes(opcode)) {
                lineErrorMessage += this.ae.regNameError(f2) + this.ae.immediateValueError(f3);
            }
            // if load, store, or "jalr" instruction
            else if (opcode.charAt(0) === "l" && (opcode.length === 2 || (opcode.length === 3 && opcode.charAt(opcode.length-1) === "u")) ||
                (opcode.charAt(0) === "s" && opcode.length === 2) ||
                opcode === "jalr") {
                lineErrorMessage += this.ae.memAddressError(f2);
                this.instructionSignals[lineNumber][1] = f2.substring(f2.indexOf("(") + 1, f2.indexOf(")"));
                this.instructionSignals[lineNumber][2] = true;
                if (opcode.charAt(0) === "s") {
                    this.instructionSignals[lineNumber][0] = false;
                }
            }
            // if "jal" instruction
            else if (opcode === "jal") {
                lineErrorMessage += this.ae.existingLabelError(f2);
            }
            // if arithmetic or logical instruction
            else {
                // get array of opcodes with matching first letter
                var libAtChar = this.arihtmeticOpcodes.get(opcode.charAt(0));
                // if the opcode is in array
                if (!(typeof libAtChar === "undefined" || !libAtChar.includes(opcode))) {
                    lineErrorMessage += this.ae.regNameError(f2) + this.ae.regNameError(f3);
                } else {
                    lineErrorMessage += "\t\t- the opcode \"" + opcode + "\" is not recognized\n";
                }
            }
        }

        // add line number to head of line error string
        if (lineErrorMessage !== "") {
            lineErrorMessage = "\tline " + (lineNumber + 1) + ":\n" + lineErrorMessage;
        }
        return lineErrorMessage;
    }
}

window.AssemblyParser = AssemblyParser;
// module.exports = AssemblyParser;


