/**
 * Once assembly code is free of syntax error, the AssemblyCompiler cleans it from white space,
 * gives data hazard indications, and stores it in an array.
 */
class AssemblyCompiler {

    /**
     * Constructor.
     */
    constructor() {
        this.cleanAssemblyCode = [];
    }

    /**
     * Create for each instruction an instruction array of fields as elements.
     * Remove white space from elements and add a "store flag".
     * Store array as "cleanAssemblyCode".
     * @param code - The crude assembly code string directly from the assembly editor text area (without syntax area).
     * @param doesNotStoreInRD - The array of instruction line numbers belonging to instructions that do not store in rd (created in AssemblyParser)
     */
    storeCode(code, doesNotStoreInRD) {
        var codeArray = code.split("\n");
        // iterate assembly code array
        for (var i = 0; i < codeArray.length; i++) {
            this.cleanAssemblyCode[i] = this.getTrimmedFieldsArray(codeArray[i], i, doesNotStoreInRD);
        }
    }

    /**
     * Removes all white space from the input instruction string.
     * Returns the instruction as an array of instruction fields,
     * with a "store flag" as an additional element.
     * @param inst - The input instruction string.
     * @param lineNumber - The input instruction line number.
     * @param doesNotStoreInRD - The array of instruction line numbers belonging to instructions that do not store in rd.
     * @returns {(string|string|boolean)[]}
     */
    getTrimmedFieldsArray(inst, lineNumber, doesNotStoreInRD) {
        // create instruction array
        let instArr = inst.split(",");
        // fetch each instruction field and trim, or set to empty string if undefined
        let opcodeAndField1 = typeof instArr[0] !== "undefined" ? instArr[0].trim() : "";
        let opcode = opcodeAndField1.includes(" ") ? opcodeAndField1.substring(0,opcodeAndField1.indexOf(" ")) : opcodeAndField1;
        let f1 = opcodeAndField1.includes(" ") ? opcodeAndField1.substring(opcodeAndField1.indexOf(" ")+1,opcodeAndField1.length) : "";
        f1 = typeof f1 !== "undefined" ? f1.trim() : "";
        let f2 = typeof instArr[1] !== "undefined" ? instArr[1].trim() : "";
        let f3 = typeof instArr[2] !== "undefined" ? instArr[2].trim() : "";
        // set store flag - true if the instruction stores in rd, false otherwise
        let storeFlag = !doesNotStoreInRD.includes(lineNumber);

        return [opcode,f1,f2,f3,storeFlag];
    }
}

window.AssemblyCompiler = AssemblyCompiler;