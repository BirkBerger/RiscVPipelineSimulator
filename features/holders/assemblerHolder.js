class AssemblerHolder {

    constructor(assembler) {
        this.assembler = assembler;
    }
    getAssembler() {
        return this.assembler;
    }
}

module.exports = AssemblerHolder;