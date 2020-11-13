class Assembler {

    constructor(lineNumberByLabel) {
        this.memLog = [];
        this.lineNumberByLabel = lineNumberByLabel;
        this.rdCompare = BigInt.asUintN(32,31n << 7n);
        this.rs1Compare = BigInt.asUintN(32,31n << 15n);
        this.rs2Compare = BigInt.asUintN(32,31n << 20n);
    }

    putAssemblyInMemory(codeArray) {
        for (var i = 0; i < codeArray.length; i++) {
            let binaryInstruction = this.instToBinary(codeArray[i]);
            this.storeInMemory(binaryInstruction);
        }
    }

    instToBinary(inst) {

        let binaryOpcode = 0n;
        let opcode = inst[0];

        switch (opcode) {
            case "jal": return this.jalFieldsToBinary(inst) | BigInt.asUintN(32, 55n);
            case "jalr": return this.jalrFieldsToBinary(inst) | BigInt.asUintN(32,111n);
            case "lui": return this.uInstFieldsToBinary(inst) | BigInt.asUintN(32, 55n);
            case "auipc": return this.uInstFieldsToBinary(inst) | BigInt.asUintN(32,23n);
            default: break;
        }

        if (opcode.charAt(0) === "b") {
            switch (opcode) {
                case "beq": binaryOpcode = BigInt.asUintN(32, 99n); break;
                case "bne": binaryOpcode =  BigInt.asUintN(32, 4195n); break;
                case "blt": binaryOpcode =  BigInt.asUintN(32, 16483n); break;
                case "bge": binaryOpcode =  BigInt.asUintN(32, 20579n); break;
                case "bgeu": binaryOpcode =  BigInt.asUintN(32, 28771n); break;
                case "bltu": binaryOpcode =  BigInt.asUintN(32, 24675n); break;
                default: break; // TODO: throw error
            } return this.sbInstFieldsToBinary(inst) | binaryOpcode;
        }

        if (opcode.charAt(0) === "l" || opcode.contains("i")) {
            switch (opcode) {
                case "addi": binaryOpcode = BigInt.asUintN(32,19n); break;
                case "addiw": binaryOpcode = BigInt.asUintN(32,27n); break;
                case "slliw": binaryOpcode = BigInt.asUintN(32, 2075n); break;
                case "slti": binaryOpcode = BigInt.asUintN(32,8211n); break;
                case "slli": binaryOpcode = BigInt.asUintN(32,4115n); break; //*00000 0X
                case "sltiu": binaryOpcode = BigInt.asUintN(32,12307n); break;
                case "xori": binaryOpcode = BigInt.asUintN(32,16403n); break;
                case "srli": binaryOpcode = BigInt.asUintN(32,20499n); break; //*00000 0X
                case "srai": binaryOpcode = (BigInt.asUintN(32,20499n) | (2n << 29n)); break; //*01000 0X
                case "srliw": binaryOpcode = BigInt.asUintN(32, 10267n); break; //*00000 00
                case "sraiw": binaryOpcode = (BigInt.asUintN(32, 10267n) | 1073741824n); break;
                case "ori": binaryOpcode = BigInt.asUintN(32,24595n); break;
                case "andi": binaryOpcode = BigInt.asUintN(32,28691n); break;
                case "lw": binaryOpcode = BigInt.asUintN(32,8195n); break;
                case "lb": binaryOpcode = BigInt.asUintN(32,3n); break;
                case "lh": binaryOpcode = BigInt.asUintN(32,4099n); break;
                case "ld": binaryOpcode = BigInt.asUintN(32,12291n); break;
                case "lbu": binaryOpcode = BigInt.asUintN(32,16387n); break;
                case "lhu": binaryOpcode = BigInt.asUintN(32,20483n); break;
                case "lwu": binaryOpcode = BigInt.asUintN(32,24579n); break;
                default: break; // TODO: throw error
            } return this.iInstFieldsToBinary(inst) | binaryOpcode;
        }
        if (opcode.length === 2 && opcode.charAt(0) === "s") {
            switch (opcode) {
                case "sb": binaryOpcode = BigInt.asUintN(32,35n); break;
                case "sh": binaryOpcode = BigInt.asUintN(32,4131n); break;
                case "sw": binaryOpcode = BigInt.asUintN(32,8227n); break;
                case "sd": binaryOpcode = BigInt.asUintN(32,12323n); break;
                default: break; // TODO: throw error
            } return this.sInstFieldsToBinary(inst) | binaryOpcode;
        }
        switch (opcode) {
            case "mulw": binaryOpcode = (BigInt.asUintN(32,59n) | (2n << 24n)); break;
            case "addw": binaryOpcode = BigInt.asUintN(32, 59n); break;
            case "add": binaryOpcode = BigInt.asUintN(32,51n); break;
            case "sub": binaryOpcode = (BigInt.asUintN(32,51n) | (2n << 29n)); break;
            case "subw": binaryOpcode = BigInt.asUintN(32, 59n); break;
            case "mul": binaryOpcode = (BigInt.asUintN(32,51n) | (2n << 24n)); break;
            case "mulh": binaryOpcode = (BigInt.asUintN(32,4157n) | (2n << 24n)); break;
            case "mulhsu": binaryOpcode = (BigInt.asUintN(32,8243n) | (2n << 24n)); break;
            case "mulhu": binaryOpcode = (BigInt.asUintN(32,12339n) | (2n << 24n)); break;
            case "xor": binaryOpcode = BigInt.asUintN(32,16435n); break;
            case "div": binaryOpcode = (BigInt.asUintN(32,16435n) | (2n << 24n)); break;
            case "divw": binaryOpcode = (BigInt.asUintN(32,16443n) | (2n << 24n)); break;
            case "divu": binaryOpcode = (BigInt.asUintN(32,20539n) | (2n << 24n)); break;
            case "divuw": binaryOpcode = (BigInt.asUintN(32, 20539n) | (2n << 24n)); break;
            case "or": binaryOpcode = BigInt.asUintN(32,24627n); break;
            case "rem": binaryOpcode = (BigInt.asUintN(32,24627n) | (2n << 24n)); break;
            case "remw": binaryOpcode = (BigInt.asUintN(32,24635n) | (2n << 24n)); break;
            case "and": binaryOpcode = BigInt.asUintN(32,24595n); break;
            case "remu": binaryOpcode = (BigInt.asUintN(32,28723n) | (2n << 24n)); break;
            case "remuw": binaryOpcode = (BigInt.asUintN(32,28731n) | (2n << 24n)); break;
            case "sll": binaryOpcode = BigInt.asUintN(32,4157n); break;
            case "sllw": binaryOpcode = BigInt.asUintN(32,4155n); break; //*00000 00
            case "slt": binaryOpcode = BigInt.asUintN(32,8243n); break;
            case "sltu": binaryOpcode = BigInt.asUintN(32,12339n); break;
            case "sra": binaryOpcode = (BigInt.asUintN(32, 20531n) | (2n << 29n)); break;
            case "srlw": binaryOpcode = BigInt.asUintN(32, 20539n); break; //*00000 00
            case "sraw": binaryOpcode = (BigInt.asUintN(32, 20539n) | 1073741824n); break;
            case "srl": binaryOpcode = BigInt.asUintN(32,24627n); break;
            default: break; // TODO: throw exception
        } return this.rInstFieldsToBinary(inst) | binaryOpcode;
    }

    regToBinary(registerName) {
        let registerNumber = parseInt(registerName.substring(1, registerName.length));
        return BigInt.asIntN(5, BigInt(registerNumber));
    }

    shortImmToBinary(immValue) {
        return BigInt.asIntN(12, immValue) << 20;
    }

    longImmToBinary(immValue) {
        return BigInt.asIntN(20, immValue) << 12;
    }

    storeMemAddressToBinary(memAddress) {
        // convert instruction field strings to binary
        let offset = memAddress.substring(0,memAddress.indexOf("("));
        let memReg = memAddress.substring(memAddress.indexOf("(") + 1, memAddress.indexOf(")"));
        let binaryOffset = BigInt.asIntN(12,offset);
        let binaryMemReg = this.regToBinary(memReg);
        // 0-extend fields to 32 bits and maintain position
        let upperOffset = (binaryOffset >> 7n) << 25n;
        let lowerOffset = BigInt.asIntN(32, binaryOffset << 7n) ^ this.rdCompare;
        let binaryMemRegExtended = BigInt.asIntN(32, binaryMemReg << 15n) ^ this.rs1Compare;

        return upperOffset | lowerOffset | binaryMemRegExtended;
    }

    loadMemAddressToBinary(memAddress) {
        let offset = memAddress.substring(0,memAddress.indexOf("("));
        let memReg = memAddress.substring(memAddress.indexOf("(") + 1, memAddress.indexOf(")"));
        let binaryOffset = BigInt.asIntN(12,offset) << 20n;
        let binaryMemReg = this.extendAsRs1(memReg);
        return binaryOffset | binaryMemReg;
    }

    branchTargetToBinary(target) {
        let address = new RegExp('^(-?[0-9]+)$').test(target) ?
                      0 :           // TODO
                      this.lineNumberByLabel[target] * 4;
        let binaryAddress = BigInt.asIntN(12, BigInt(address));
        let lowerOffset = ((BigInt.asIntN(5, binaryAddress) >> 1n) << 8n) ^ this.rdCompare;
        let upperOffset = (binaryAddress >> 5n) << 25n;
        return upperOffset | lowerOffset;
    }

    // convert instruction field strings to binary
    // 0-extend fields to 32 bits and maintain position
    extendAsRd(regName) {
        let binaryReg = this.regToBinary(regName);
        return BigInt.asIntN(32, binaryReg << 7n) ^ this.rdCompare;
    }

    extendAsRs1(regName) {
        let binaryReg = this.regToBinary(regName);
        return BigInt.asIntN(32, binaryReg << 15n) ^ this.rs1Compare;
    }

    extendAsRs2(regName) {
        let binaryReg = this.regToBinary(regName);
        return BigInt.asIntN(32, binaryReg << 20n) ^ this.rs2Compare;
    }


    rInstFieldsToBinary(inst) {
        let binaryRd = this.extendAsRd(inst[1]);
        let binaryRs1 = this.extendAsRs1(inst[2]);
        let binaryRs2 = this.extendAsRs2(inst[3]);

        return binaryRd | binaryRs1 | binaryRs2;
    }

    iInstFieldsToBinary(inst) {
        let binaryRd = this.extendAsRd(inst[1]);
        let binaryRs1 = inst[0].charAt(0) === "l" ? this.loadMemAddressToBinary(inst[2]) : this.extendAsRs1(inst[2]);
        let binaryImm = this.shortImmToBinary(inst[3]);
        return binaryRd | binaryRs1 | binaryImm;
    }

    sInstFieldsToBinary(inst) {
        let binaryRs2 = this.extendAsRs2(inst[1]);
        let binaryMemAddress = this.storeMemAddressToBinary(inst[2]);
        return binaryRs2 | binaryMemAddress;
    }

    sbInstFieldsToBinary(inst) {
        let binaryRs1 = this.extendAsRs1(inst[1]);
        let binaryRs2 = this.extendAsRs2(inst[2]);
        let binaryBranchTarget = this.branchTargetToBinary(inst[3]);
        return binaryRs1 | binaryRs2 | binaryBranchTarget;
    }

    uInstFieldsToBinary(inst) {
        let binaryRd = this.extendAsRd(inst[1]);
        let binaryImm = this.longImmToBinary(inst[2]);
        return binaryRd | binaryImm;
    }

    jalFieldsToBinary(inst) {
        let address = this.lineNumberByLabel[inst[2]] * 4;
        let binaryAddress = BigInt.asIntN(20, BigInt(address)) << 12n;
        let binaryRd = this.extendAsRd(inst[1]);
        return binaryAddress | binaryRd;
    }

    jalrFieldsToBinary(inst) {
        let binaryRd = this.extendAsRd(inst[1]);
        let offset = inst[2].substring(0,inst[2].indexOf("("));
        let memReg = inst[2].substring(inst[2].indexOf("(") + 1, inst[2].indexOf(")"));
        let binaryOffset = this.shortImmToBinary(offset);
        let binaryMemReg = this.extendAsRs1(memReg);

        return binaryRd | binaryOffset | binaryMemReg;
    }

    storeInMemory(binaryInst) {
        for (var i = 0; i <= 24; i+=8) {
            let regByte = BigInt.asIntN(8, binaryInst >> BigInt(i));
            this.memLog.push(regByte)
        }
    }






}

window.Assembler = Assembler;
// module.exports = Assembler;