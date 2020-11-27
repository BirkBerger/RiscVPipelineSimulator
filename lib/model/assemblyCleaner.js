/**
 * Once assembly code is free of syntax error, the AssemblyStorer cleans it from white space,
 * gives data hazard indications, and stores it in an array.
 */
class AssemblyCleaner {

    /**
     * Constructor.
     */
    constructor() {
        this.cleanCode = [];
        this.highlightingList = [];
        this.lineNumberByLabel = {};
    }

    /**
     * Create for each instruction an instruction array of fields as elements.
     * Remove white space from elements and add a "store flag".
     * Store array as "cleanAssemblyCode".
     * @param code - The crude assembly code string directly from the assembly editor text area (without syntax area).
     * @param instructionSignals - The array of instruction signals
     */
    cleanAssemblyCode(code, instructionSignals) {
        const codeArray = code.split("\n");
        var k = 0;
        // iterate assembly code array
        for (var i = 0; i < codeArray.length; i++) {
            let cleanInst = this.getCleanInstruction(codeArray[i], i, instructionSignals, k);
            if (cleanInst !== null) {
                // concat assembly line number to instruction
                this.cleanCode[k] = cleanInst.concat([i]);
                // connect instruction row number k to assembly line number i
                this.highlightingList[i] = [k];
                k++;
            }
        }
    }

    /**
     * Removes all white space from the input instruction string.
     * Returns the instruction as an array of instruction fields,
     * with a "store flag" as an additional element.
     * @param inst - The input instruction string.
     * @param lineNumber - The input instruction line number.
     * @param instructionSignals - The array of instruction signals - the index matches the instruction line number.
     * @returns {(string|string|*)[]} - The instruction array.
     */
    getCleanInstruction(inst, lineNumber, instructionSignals, k) {
        // create instruction array
        let instArr = inst.split(",");
        // fetch each instruction field and trim, or set to empty string if undefined
        let opcodeAndField1 = typeof instArr[0] !== "undefined" ? instArr[0].trim() : "";
        let opcode = opcodeAndField1.includes(" ") ? opcodeAndField1.substring(0,opcodeAndField1.indexOf(" ")) : opcodeAndField1;
        if (instArr.length === 1) {
            this.lineNumberByLabel[(opcode.substring(0,opcode.length-1))] = k;
            return null;
        }
        let f1 = opcodeAndField1.includes(" ") ? opcodeAndField1.substring(opcodeAndField1.indexOf(" ")+1,opcodeAndField1.length) : "";
        f1 = typeof f1 !== "undefined" ? f1.trim() : "";
        let f2 = typeof instArr[1] !== "undefined" ? instArr[1].trim() : "";
        let f3 = typeof instArr[2] !== "undefined" ? instArr[2].trim() : "";
        let signals = typeof instructionSignals[lineNumber] === "undefined" ? [] : instructionSignals[lineNumber];

        return [opcode,f1,f2,f3,signals,[]];
    }

}

// window.AssemblyCleaner = AssemblyCleaner;
module.exports = AssemblyCleaner;