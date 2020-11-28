/**
 * Converts input assembly program to binary and stores it using little-endianness in an initial memory.
 */
class Assembler {

    constructor(lineNumberByLabel) {
        this.initialMem = new Map();
        this.lineNumberByLabel = lineNumberByLabel;
        this.rdCompare = BigInt.asUintN(32,31n << 7n);
        this.rs1Compare = BigInt.asUintN(32,31n << 15n);
        this.rs2Compare = BigInt.asUintN(32,31n << 20n);

        this.imm20compare = BigInt.asUintN(32, 1n << 31n);
        this.imm101compare = BigInt.asUintN(32, 1023n << 21n);
        this.imm11compare = BigInt.asUintN(32, 1n << 20n);
        this.imm1912compare = BigInt.asUintN(32, 255n << 12n);
    }

    /**
     * Iterates through the code array, converts each instruction to binary and stores it in memory
     * @param cleanCode - The hazardous code array
     */
    initializeMemory(cleanCode) {
        let address = 0n;
        for (var i = 0; i < cleanCode.length; i++) {
            let binaryInstruction = this.instToBinary(cleanCode[i], i);
            this.storeInstInMemory(address, binaryInstruction);
            address += 4n;
        }
    }

    /**
     * Stores binary instruction in memory using little-endianness
     * @param address - Instruction memory address
     * @param binaryInst - Binary instruction
     */
    storeInstInMemory(address, binaryInst) {
        for (var i = 0; i <= 24; i+=8) {
            let regByte = BigInt.asIntN(8, binaryInst >> BigInt(i));
            this.initialMem.set(address, regByte)
            address++;
        }
    }

    /**
     * Converts an instruction array to its binary equivalent according to the RISC-V ISA specifications:
     * Sets the 10-17 constant bits depending the instruction opcode.
     * Calls a function depending on the instruction type.
     * Merges the two by logical or.
     * @param inst - Instruction array
     * @param lineNumber - Instruction assembly line number
     * @returns {bigint} - The 32-bit binary instruction
     */
    instToBinary(inst, lineNumber) {

        let binaryOpcode = 0n;
        let opcode = inst[0];

        switch (opcode) {
            case "jal": return this.jalFieldsToBinary(inst, lineNumber) | BigInt.asUintN(32, 111n);
            case "jalr": return this.jalrFieldsToBinary(inst) | BigInt.asUintN(32,103n);
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
            } return this.sbInstFieldsToBinary(inst, lineNumber) | binaryOpcode;
        }

        if (opcode.charAt(0) === "l" || opcode.indexOf("i") > 1) {
            switch (opcode) {
                case "addi": binaryOpcode = BigInt.asUintN(32,19n); break;
                case "addiw": binaryOpcode = BigInt.asUintN(32,27n); break;
                case "slliw": binaryOpcode = BigInt.asUintN(32, 4123n); break;
                case "slti": binaryOpcode = BigInt.asUintN(32,8211n); break;
                case "slli": binaryOpcode = BigInt.asUintN(32,4115n); break;
                case "sltiu": binaryOpcode = BigInt.asUintN(32,12307n); break;
                case "xori": binaryOpcode = BigInt.asUintN(32,16403n); break;
                case "srli": binaryOpcode = BigInt.asUintN(32,20499n); break;
                case "srai": binaryOpcode = (BigInt.asUintN(32,20499n) | (2n << 29n)); break;
                case "srliw": binaryOpcode = BigInt.asUintN(32, 20507n); break;
                case "sraiw": binaryOpcode = (BigInt.asUintN(32, 20507n) | 1073741824n); break;
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
            case "mulw": binaryOpcode = (BigInt.asUintN(32,16443n) | (2n << 24n)); break;
            case "addw": binaryOpcode = BigInt.asUintN(32, 59n); break;
            case "add": binaryOpcode = BigInt.asUintN(32,51n); break;
            case "sub": binaryOpcode = (BigInt.asUintN(32,51n) | (2n << 29n)); break;
            case "subw": binaryOpcode = BigInt.asUintN(32, 59n) | (2n << 29n) ; break;
            case "mul": binaryOpcode = (BigInt.asUintN(32,51n) | (2n << 24n)); break;
            case "mulh": binaryOpcode = (BigInt.asUintN(32,4147n) | (2n << 24n)); break;
            case "mulhsu": binaryOpcode = (BigInt.asUintN(32,8243n) | (2n << 24n)); break;
            case "mulhu": binaryOpcode = (BigInt.asUintN(32,12339n) | (2n << 24n)); break;
            case "xor": binaryOpcode = BigInt.asUintN(32,16435n); break;
            case "div": binaryOpcode = (BigInt.asUintN(32,16435n) | (2n << 24n)); break;
            case "divw": binaryOpcode = (BigInt.asUintN(32,16443n) | (2n << 24n)); break;
            case "divu": binaryOpcode = (BigInt.asUintN(32,20531n) | (2n << 24n)); break;
            case "divuw": binaryOpcode = (BigInt.asUintN(32, 20539n) | (2n << 24n)); break;
            case "or": binaryOpcode = BigInt.asUintN(32,24627n); break;
            case "rem": binaryOpcode = (BigInt.asUintN(32,24627n) | (2n << 24n)); break;
            case "remw": binaryOpcode = (BigInt.asUintN(32,24635n) | (2n << 24n)); break;
            case "and": binaryOpcode = BigInt.asUintN(32,28723n); break;
            case "remu": binaryOpcode = (BigInt.asUintN(32,28723n) | (2n << 24n)); break;
            case "remuw": binaryOpcode = (BigInt.asUintN(32,28731n) | (2n << 24n)); break;
            case "sll": binaryOpcode = BigInt.asUintN(32,4147n); break;
            case "sllw": binaryOpcode = BigInt.asUintN(32,4155n); break;
            case "slt": binaryOpcode = BigInt.asUintN(32,8243n); break;
            case "sltu": binaryOpcode = BigInt.asUintN(32,12339n); break;
            case "sra": binaryOpcode = (BigInt.asUintN(32, 20531n) | (2n << 29n)); break;
            case "srlw": binaryOpcode = BigInt.asUintN(32, 20539n); break;
            case "sraw": binaryOpcode = (BigInt.asUintN(32, 20539n) | 1073741824n); break;
            case "srl": binaryOpcode = BigInt.asUintN(32,20531n); break;
            default: break; // TODO: throw exception
        } return this.rInstFieldsToBinary(inst) | binaryOpcode;
    }

    /**
     * Converts register name to its binary equivalent
     * @param registerName - The input string register name
     * @returns {bigint} - The 5-bit binary register name
     */
    regToBinary(registerName) {
        let registerNumber = parseInt(registerName.substring(1, registerName.length));
        return BigInt.asUintN(5, BigInt(registerNumber));
    }

    /**
     * Converts 12-bit immediate value to its binary equivalent and places in a double word.
     * @param immValue - The immediate string
     * @param opcode - The opcode of the instruction holding the immediate
     * @returns {bigint} - The binary immediate extended to a double word
     */
    shortImmToBinary(immValue, opcode) {
        let binaryImm = BigInt.asIntN(12, immValue);
        // if slliw, srliw or sraiw => set upper 7 bits to zero
        if (opcode.charAt(0) === "s" && opcode.includes("iw")) {
            binaryImm = binaryImm & 31n;
        }
        // place in the [32-20] bits of a double word
        return binaryImm << 20n;
    }

    /**
     * Converts 20-bit immediate value to its binary equivalent and places in a double word.
     * @param immValue - The immediate string
     * @returns {bigint} - The binary immediate extended to a double word
     */
    longImmToBinary(immValue) {
        return BigInt.asIntN(20, immValue) << 12n;
    }

    /**
     * Converts memory address of store instructions to its binary equivalent and places in a double word.
     * @param memAddress - Memory address string
     * @returns {bigint} - The 17-bit binary memory address extended to a double word
     */
    storeMemAddressToBinary(memAddress) {
        // convert instruction field strings to binary
        let offset = memAddress.substring(0,memAddress.indexOf("("));
        let memReg = memAddress.substring(memAddress.indexOf("(") + 1, memAddress.indexOf(")"));
        let binaryOffset = BigInt.asIntN(12,offset);
        let binaryMemReg = this.regToBinary(memReg);
        // 0-extend fields to 32 bits and maintain position
        let lowerOffset = (BigInt.asIntN(5, binaryOffset) << 7n) & this.rdCompare;
        let upperOffset = (binaryOffset >> 5n) << 25n;
        let binaryMemRegExtended = BigInt.asIntN(32, binaryMemReg << 15n) & this.rs1Compare;

        return upperOffset | lowerOffset | binaryMemRegExtended;
    }

    /**
     * Converts memory address of load instructions to its binary equivalent and places in a double word.
     * @param memAddress - Memory address string
     * @returns {bigint} - The 17-bit binary memory address extended to a double word
     */
    loadMemAddressToBinary(memAddress) {
        let offset = memAddress.substring(0,memAddress.indexOf("("));
        let memReg = memAddress.substring(memAddress.indexOf("(") + 1, memAddress.indexOf(")"));
        let binaryOffset = BigInt.asIntN(12,offset) << 20n;
        let binaryMemReg = this.extendAsRs1(memReg);
        return binaryOffset | binaryMemReg;
    }

    /**
     * Converts branch targets (labels or integers) to its binary equivalent and places in a double word.
     * @param target - The target string
     * @param lineNumber - The branch instruction line number
     * @returns {bigint} - The 12-bit binary branch target extended to a double word
     */
    branchTargetToBinary(target, lineNumber) {
        let address = new RegExp('^(-?[0-9]+)$').test(target) ?
                      (lineNumber * 4) + parseInt(target) * 4:
                      this.getLabelAddress(target,lineNumber);

        let binaryAddress = BigInt.asIntN(12, BigInt(address));
        let lowerOffset = this.extendLowerOffsetForBranch(binaryAddress);
        let upperOffset = (binaryAddress >> 5n) << 25n;
        return upperOffset | lowerOffset;
    }

    /**
     * Calculates memory address referenced by label.
     * @param label - The label string
     * @param lineNumber - The branch/jump instruction line number
     * @returns {bigint} - The memory address
     */
    getLabelAddress(label, lineNumber) {
        return BigInt(this.lineNumberByLabel[label] * 4 - lineNumber * 4);
    }

    /**
     * Places the lower 5 bits of the branch target in a double word.
     * @param binaryAddress - The binary branch target
     * @returns {bigint} - The lower 5 bits extended to a double word
     */
    extendLowerOffsetForBranch(binaryAddress) {
        if (binaryAddress < 0) {
            return (BigInt.asIntN(5, binaryAddress) | 1n) << 7n & this.rdCompare;
        } return BigInt.asIntN(5, binaryAddress >> 1n) << 8n & this.rdCompare;
    }

    /**
     * Places the 5-bit binary register on the rd-position of a double word.
     * @param regName - The register name
     * @returns {bigint} - The binary register extended to a double word
     */
    extendAsRd(regName) {
        let binaryReg = this.regToBinary(regName);
        return BigInt.asIntN(32, binaryReg << 7n) & this.rdCompare;
    }

    /**
     * Places the 5-bit binary register on the rs1-position of a double word.
     * @param regName - The register name
     * @returns {bigint} - The binary register extended to a double word
     */
    extendAsRs1(regName) {
        let binaryReg = this.regToBinary(regName);
        return BigInt.asIntN(32, binaryReg << 15n) & this.rs1Compare;
    }

    /**
     * Places the 5-bit binary register on the rs2-position of a double word.
     * @param regName - The register name
     * @returns {bigint} - The binary register extended to a double word
     */
    extendAsRs2(regName) {
        let binaryReg = this.regToBinary(regName);
        return BigInt.asIntN(32, binaryReg << 20n) & this.rs2Compare;
    }

    /**
     * Converts R-instruction types to 32-bit binary - disregarding constant bits.
     * @param inst - The instruction array
     * @returns {bigint} - The 32-bit binary instruction
     */
    rInstFieldsToBinary(inst) {
        let binaryRd = this.extendAsRd(inst[1]);
        let binaryRs1 = this.extendAsRs1(inst[2]);
        let binaryRs2 = this.extendAsRs2(inst[3]);

        return binaryRd | binaryRs1 | binaryRs2;
    }
    /**
     * Converts I-instruction types to 32-bit binary - disregarding constant bits.
     * @param inst - The instruction array
     * @returns {bigint} - The 32-bit binary instruction
     */
    iInstFieldsToBinary(inst) {
        let binaryRd = this.extendAsRd(inst[1]);
        let binaryRs1 = inst[0].charAt(0) === "l" ? this.loadMemAddressToBinary(inst[2]) : this.extendAsRs1(inst[2]);
        let binaryImm = this.shortImmToBinary(inst[3], inst[0]);
        return binaryRd | binaryRs1 | binaryImm;
    }

    /**
     * Converts S-instruction types to 32-bit binary - disregarding constant bits.
     * @param inst - The instruction array
     * @returns {bigint} - The 32-bit binary instruction
     */
    sInstFieldsToBinary(inst) {
        let binaryRs2 = this.extendAsRs2(inst[1]);
        let binaryMemAddress = this.storeMemAddressToBinary(inst[2]);
        return binaryRs2 | binaryMemAddress;
    }

    /**
     * Converts SB-instruction types to 32-bit binary - disregarding constant bits.
     * @param inst - The instruction array
     * @param lineNumber - The instruction line number
     * @returns {bigint} - The 32-bit binary instruction
     */
    sbInstFieldsToBinary(inst, lineNumber) {
        let binaryRs1 = this.extendAsRs1(inst[1]);
        let binaryRs2 = this.extendAsRs2(inst[2]);
        let binaryBranchTarget = this.branchTargetToBinary(inst[3], lineNumber);
        return binaryRs1 | binaryRs2 | binaryBranchTarget;
    }

    /**
     * Converts U-instruction types to 32-bit binary - disregarding constant bits.
     * @param inst - The instruction array
     * @returns {bigint} - The 32-bit binary instruction
     */
    uInstFieldsToBinary(inst) {
        let binaryRd = this.extendAsRd(inst[1]);
        let binaryImm = this.longImmToBinary(inst[2]);
        return binaryRd | binaryImm;
    }

    /**
     * Converts jal instruction to binary - disregarding constant bits.
     * @param inst - The instruction
     * @param lineNumber - The instruction line number
     * @returns {bigint} - The 32-bit binary instruction
     */
    jalFieldsToBinary(inst, lineNumber) {
        let address = this.getLabelAddress(inst[2],lineNumber);

        // extract the four parts of immediate. Extend to 32 bits but keep location:
        // imm[10:1]
        address = address >> 1n;
        let imm101 = BigInt.asIntN(10, address) << 21n & this.imm101compare;
        // imm[11]
        address = address >> 10n;
        let imm11 = BigInt.asIntN(1, address) << 20n & this.imm11compare;
        // imm[19:12]
        address = address >> 1n;
        let imm1912 = BigInt.asIntN(8, address) << 12n & this.imm1912compare;
        // imm[20]
        address = address >> 8n;
        let imm20 = BigInt.asIntN(1, address) << 31n & this.imm20compare;

        // merge imm bits and rd
        let binaryAddress = imm101 | imm11 | imm1912 | imm20;
        let binaryRd = this.extendAsRd(inst[1]);
        return binaryAddress | binaryRd;
    }

    /**
     * Converts jalr instruction to binary - disregarding constant bits.
     * @param inst - The instruction
     * @returns {bigint} - The 32-bit binary instruction
     */
    jalrFieldsToBinary(inst) {
        let binaryRd = this.extendAsRd(inst[1]);
        let offset = inst[2].substring(0,inst[2].indexOf("("));
        let memReg = inst[2].substring(inst[2].indexOf("(") + 1, inst[2].indexOf(")"));
        let binaryOffset = this.shortImmToBinary(offset, inst[0]);
        let binaryMemReg = this.extendAsRs1(memReg);

        return binaryRd | binaryOffset | binaryMemReg;
    }
}

window.Assembler = Assembler;
// module.exports = Assembler;