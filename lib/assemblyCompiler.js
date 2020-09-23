class AssemblyCompiler {

    constructor() {
        this.assemblyCode = [];
    }

    storeCode(code) {
        var codeArray = code.split("\n");
        for (var i = 0; i < codeArray.length; i++) {
            this.assemblyCode[i] = this.getTrimmedFieldsArray(codeArray[i]);
        }
    }

    getTrimmedFieldsArray(inst) {
        let instArr = inst.split(",");
        let opcodeAndField1 = typeof instArr[0] !== "undefined" ? instArr[0].trim() : "";
        let opcode = opcodeAndField1.includes(" ") ? opcodeAndField1.substring(0,opcodeAndField1.indexOf(" ")) : opcodeAndField1;
        let f1 = opcodeAndField1.includes(" ") ? opcodeAndField1.substring(opcodeAndField1.indexOf(" ")+1,opcodeAndField1.length) : "";
        f1 = typeof f1 !== "undefined" ? f1.trim() : "";
        let f2 = typeof instArr[1] !== "undefined" ? instArr[1].trim() : "";
        let f3 = typeof instArr[2] !== "undefined" ? instArr[2].trim() : "";
        return [opcode,f1,f2,f3];
    }
}

window.AssemblyParser = AssemblyParser;