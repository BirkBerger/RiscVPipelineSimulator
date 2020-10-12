

class AssemblyInterpreter {

    constructor() {
        this.pc = 0n;
        this.pcChange = false;
        this.gpRegisters = new BigInt64Array(32).fill(0n);
        this.if_id = BigInt.asIntN(96, 0n);
        this.id_ex = BigInt.asIntN(256, 0n);
        this.ex_mem = BigInt.asIntN(193, 0n);
        this.mem_wb = BigInt.asIntN(128, 0n);
        this.dataMem = {};
        this.labelsByLineNumber= {};
        this.inst = [];

        //TODO: set pipeline registers continously
        //TODO: test
    }

    setLabelsByLineNumber(labelsByLineNumber) {
        this.labelsByLineNumber = labelsByLineNumber;
    }

    interpretCleanAssemblyCode(cleanCode) {

        while (this.pc < cleanCode.length) {

            this.inst = cleanCode[this.pc];

            switch (this.inst[0]) {

                // TODO: x0 condition for all
                case "add": if (cleanCode[i][1] !== "x0") {this.add(cleanCode[i]);} break;
                case "addi": break;
                case "addiw": break;
                case "addw": break;
                case "and": break;
                case "andi": break;
                case "auipc": break;
                case "beq": break;
                case "bge": break;
                case "bgeu": break;
                case "blt": break;
                case "bltu": break;
                case "bne": break;
                case "jal": break;
                case "jalr": break;
                case "lb": break;
                case "lbu": break;
                case "ld": break;
                case "lh": break;
                case "lhu": break;
                case "lw": break;
                case "lwu": break;
                case "lui": break;
                case "or": break;
                case "ori": break;
                case "sb": break;
                case "sd": break;
                case "sh": break;
                case "sw": break;
                case "sll": break;
                case "slli": break;
                case "slliw": break;
                case "sllw": break;
                case "slt": break;
                case "slti": break;
                case "sltiu": break;
                case "sltu": break;
                case "sra": break;
                case "srai": break;
                case "sraiw": break;
                case "sraw": break;
                case "srl": break;
                case "srli": break;
                case "srliw": break;
                case "srlw": break;
                case "sub": break;
                case "subw": break;
                case "xor": break;
                case "xori": break;
                case "div": break;
                case "divu": break;
                case "divuw": break;
                case "divw": break;
                case "mul": break;
                case "mulh": break;
                case "mulhsu": break;
                case "mulhu": break;
                case "mulw": break;
                case "rem": break;
                case "remu": break;
                case "remuw": break;
                case "remw": break;
            }
            if (this.pcChange) {
                this.pcChange = false;
            } else {
                this.pc++;
            }
        }
    }

    getArithmeticFields() {
        return [this.inst[1].substring(1,2), this.inst[2].substring(1,2), this.inst[3].substring(1,2)];
    }

    getImmediateFields() {
        return [this.inst[1].substring(1,2),
                this.inst[2].substring(1,2),
                BigInt.asIntN(12, this.inst[3])];
    }

    getBranchFields() {
        let imm = this.inst[3];
        let branchAddress = new RegExp('^([0-9]+)$').test(imm) ?
                            (4 * this.pc) + (2 * BigInt.asIntN(12, imm)) :
                            this.labelsByLineNumber[imm]*4;
        return [this.inst[1].substring(1,2),
                this.inst[2].substring(1,2),
                branchAddress];
    }

    getMemAccessFields() {
        let offset = this.inst[2].substring(0,this.inst[2].indexOf("("));
        let memReg = this.inst[2].substring(this.inst[2].indexOf("(") + 1, this.inst[2].length-1);
        let memAddress = offset + this.gpRegisters[memReg];
        return [this.inst[1].substring(1,2), memAddress];
    }

    add() {
        let rsNumbers = this.getArithmeticFields[this.inst];
        this.gpRegisters[rsNumbers[0]] = this.gpRegisters[rsNumbers[1]] + this.gpRegisters[rsNumbers[2]];
    }

    addi() {
        let fields = this.getImmediateFields(this.inst);
        this.gpRegisters[fields[0]] = this.gpRegisters[fields[1]] + fields[2];
    }

    addiw() {
        let fields = this.getImmediateFields(this.inst);
        let rs1 = BigInt.asIntN(32, this.gpRegisters[fields[1]]);
        this.gpRegisters[fields[0]] = BigInt.asIntN(64, rs1 + fields[2]);
    }

    addw() {
        let rsNumbers = this.getArithmeticFields[this.inst];
        let rs1 = BigInt.asIntN(32, this.gpRegisters[rsNumbers[1]]);
        let rs2 = BigInt.asIntN(32, this.gpRegisters[rsNumbers[2]]);
        this.gpRegisters[rsNumbers[0]] = BigInt.asIntN(64, rs1 + rs2);
    }

    and() {
        let rsNumbers = this.getArithmeticFields[this.inst];
        this.gpRegisters[rsNumbers[0]] = this.gpRegisters[rsNumbers[1]] & this.gpRegisters[rsNumbers[2]];
    }

    andi() {
        let fields = this.getImmediateFields(this.inst);
        this.gpRegisters[fields[0]] = this.gpRegisters[fields[1]] & fields[2];
    }

    auipc() {
        this.pc = BigInt.asIntN(20, this.inst[3]) << 12n;
        this.pcChange = true;
    }

    beq() {
        let fields = this.getBranchFields[this.inst];
        if (this.gpRegisters[fields[0]] === this.gpRegisters[fields[1]]) {
            this.pc =  fields[2];
            this.pcChange = true;
        }
    }

    bge_bgeu() {
        let fields = this.getBranchFields[this.inst];
        if (this.gpRegisters[fields[0]] >= this.gpRegisters[fields[1]]) {
            this.pc =  fields[2];
            this.pcChange = true;
        }
    }

    blt_bltu() {
        let fields = this.getBranchFields[this.inst];
        if (this.gpRegisters[fields[0]] < this.gpRegisters[fields[1]]) {
            this.pc = fields[2];
            this.pcChange = true;
        }
    }

    bne() {
        let fields = this.getBranchFields[this.inst];
        if (this.gpRegisters[fields[0]] !== this.gpRegisters[fields[1]]) {
            this.pc =  fields[2];
            this.pcChange = true;
        }
    }

    jal() {
        let rdNumber = this.inst[1].substring(1,2);
        this.pc = this.labelsByLineNumber[this.inst[2]]*4;
        this.gpRegisters[rdNumber] = this.pc;
    }

    jalr() {
        let fields = this.getMemAccessFields(this.inst);
        this.pc = fields[1];
        this.gpRegisters[fields[0]] = this.pc;
    }

    load(signed, numberOfBytes) {
        let fields = this.getMemAccessFields(this.inst);
        let k = 0n;
        let memValue = BigInt.asUintN(64,0n);
        for (var i = fields[2]; i < fields[2]+numberOfBytes; i++) {
            memValue += BigInt.asUintN(64, this.dataMem[i]) << k;
            k += 8n;
        }
        this.gpRegisters[fields[0]] = signed ? BigInt.asIntN(64, memValue) : BigInt.asUintN(64, memValue);
    }

    lui() {
        // extend 20-bit immediate with zeros
        let imm = BigInt.asUintN(64, BigInt.asIntN(20, this.inst[2]));
        let rdNumber = this.inst[1].substring(1,2);
        var rd = this.gpRegisters[rdNumber];
        // free bit [12;31] in rd and load imm into that space
        rd = ((rd << 20n) >>> 20n) & imm;
        this.gpRegisters[rdNumber] = rd;
    }

    or() {
        let fields = this.getArithmeticFields(this.inst);
        this.gpRegisters[fields[0]] = this.gpRegisters[fields[1]] | this.gpRegisters[fields[2]];
    }

    ori() {
        let fields = this.getImmediateFields(this.inst);
        this.gpRegisters[fields[0]] = this.gpRegisters[fields[1]] | fields[2];
    }

    store(memAddress, numberOfBytes) {
        var rd = this.gpRegisters[this.inst[1].substring(1,2)];
        for (var i = memAddress; i < memAddress + numberOfBytes; i++) {
            // initialize memory if it isn't already
            if (typeof this.dataMem[i] === "undefined") {
                this.dataMem[i] = BigInt.asIntN(8, 0n);
            }
            // save the right-most 8 bits into memory at memAddress
            this.dataMem[i] = BigInt.asIntN(8, rd);
            // right-shift value with 8 bits
            rd = rd >>> 8n;
        }
    }

    regShift(left, bitsOfRs1, logical) {
        let fields = this.getArithmeticFields(this.inst);
        let shifts = BigInt.asIntN(5,this.gpRegisters[fields[2]]);
        let rs1 = BigInt.asIntN(bitsOfRs1, this.gpRegisters[fields[1]]);
        this.gpRegisters[fields[0]] = left ? (logical ? rs1 >>> shifts : rs1 >> shifts) : rs1 << shifts;
    }

    immShift(left, bitsOfRs1, logical) {
        let fields = this.getImmediateFields(this.inst);
        let shifts = BigInt.asIntN(5,fields[2]);
        let rs1 = BigInt.asIntN(bitsOfRs1, this.gpRegisters[fields[1]]);
        this.gpRegisters[fields[0]] = left ? (logical ? rs1 >>> shifts : rs1 >> shifts) : rs1 << shifts;
    }




    // case "slt": break;
    // case "slti": break;
    // case "sltiu": break;
    // case "sltu": break;



    // case "sub": break;
    // case "subw": break;
    // case "xor": break;
    // case "xori": break;
    // case "div": break;
    // case "divu": break;
    // case "divuw": break;
    // case "divw": break;
    // case "mul": break;
    // case "mulh": break;
    // case "mulhsu": break;
    // case "mulhu": break;
    // case "mulw": break;
    // case "rem": break;
    // case "remu": break;
    // case "remuw": break;
    // case "remw": break;



}