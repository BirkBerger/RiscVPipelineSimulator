class AssemblyCompiler {

    constructor() {
        this.cleanAssemblyCode = [];
    }

    storeCode(code, doesNotStoreInRD) {
        var codeArray = code.split("\n");
        for (var i = 0; i < codeArray.length; i++) {
            this.cleanAssemblyCode[i] = this.getTrimmedFieldsArray(codeArray[i], i, doesNotStoreInRD);
        }
    }

    getTrimmedFieldsArray(inst, lineNumber, doesNotStoreInRD) {
        let instArr = inst.split(",");
        let opcodeAndField1 = typeof instArr[0] !== "undefined" ? instArr[0].trim() : "";
        let opcode = opcodeAndField1.includes(" ") ? opcodeAndField1.substring(0,opcodeAndField1.indexOf(" ")) : opcodeAndField1;
        let f1 = opcodeAndField1.includes(" ") ? opcodeAndField1.substring(opcodeAndField1.indexOf(" ")+1,opcodeAndField1.length) : "";
        f1 = typeof f1 !== "undefined" ? f1.trim() : "";
        let f2 = typeof instArr[1] !== "undefined" ? instArr[1].trim() : "";
        let f3 = typeof instArr[2] !== "undefined" ? instArr[2].trim() : "";
        let storeFlag = !doesNotStoreInRD.includes(lineNumber);

        return [opcode,f1,f2,f3,storeFlag];
    }
}

window.AssemblyCompiler = AssemblyCompiler;