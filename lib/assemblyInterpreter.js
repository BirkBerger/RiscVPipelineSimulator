
class AssemblyInterpreter {

    constructor(lineNumberByLabel) {
        this.pc = 0n;
        this.pcChange = false;
        this.registerLog = {};
        this.gpRegisters = new BigInt64Array(32).fill(0n);
        this.if_id = BigInt.asIntN(96, 0n);
        this.id_ex = BigInt.asIntN(256, 0n);
        this.ex_mem = BigInt.asIntN(193, 0n);
        this.mem_wb = BigInt.asIntN(128, 0n);
        this.dataMem = [];
        this.dataMemLog = {};
        this.lineNumberByLabel = lineNumberByLabel;
        this.inst = [];
        this.cc = 0;
        this.highlightOrder = [];
        this.highlightingList = [];
        this.code = [];
        this.pipelineOrder = [];
        //TODO: set pipeline registers continously
        //TODO: test
    }

    interpretCleanAssemblyCode(cleanCode) {
        this.setFirstFiveCcInLogs();
        var timeOut = Date.now();
        this.code = cleanCode;
        while (Number(this.pc) < cleanCode.length) {

            console.log("cc: " + this.cc);

            // runtime error detection: check if current time extends start time plus 1000 ms
            if (Date.now() > timeOut + 800) {
                throw new InfiniteLoopException("The code has an infinite loop");
            }

            // increment clock cycle and fetch next instruction
            this.cc++;
            this.inst = cleanCode[Number(this.pc)];

            let assemblyLineNumber = cleanCode[Number(this.pc)][6];
            this.highlightOrder.push([assemblyLineNumber]);
            this.pipelineOrder.push([Number(this.pc),true]);
            let arithmeticInstruction = true;

            // identify instruction opcode and call corresponding method: non-arithmetic
            switch (this.inst[0]) {
                case "jal": this.jal(); break;
                case "jalr": this.jalr(); break;
                case "beq": this.branch(true,"==="); break;
                case "bge": this.branch(true,">="); break;
                case "bgeu": this.branch(false,">="); break;
                case "blt": this.branch(true,"<"); break;
                case "bltu": this.branch(false,"<"); break;
                case "bne": this.branch(true,"!=="); break;
                case "sb": this.store(1); break;
                case "sd": this.store(8); break;
                case "sh": this.store(2); break;
                case "sw": this.store(4); break;
                default: arithmeticInstruction = false; break;
            }
            // identify instruction opcode and call corresponding method: arithmetic
            if (!arithmeticInstruction && this.inst[1] !== "x0") {
                switch (this.inst[0]) {
                    case "add": this.add_sub(true); break;
                    case "addi": this.addi(); break;
                    case "addiw": this.addiw(); break;
                    case "addw": this.addw_subw(true); break;
                    case "and": this.and(); break;
                    case "andi": this.andi(); break;
                    case "auipc": this.upperImmediate(true); break;
                    case "lb": this.load(true, 1); break;
                    case "lbu": this.load(false, 1); break;
                    case "ld": this.load(true, 8); break;
                    case "lh": this.load(true, 2); break;
                    case "lhu": this.load(false, 2); break;
                    case "lw": this.load(true, 4); break;
                    case "lwu": this.load(false, 4); break;
                    case "lui": this.upperImmediate(false); break;
                    case "or": this.or();break;
                    case "ori": this.ori();break;
                    case "sll": this.shift(true,  true,8,false); break;
                    case "slli": this.shift(true, true,8, true); break;
                    case "slliw": this.shift(true, true,4,true); break;
                    case "sllw": this.shift(true, true,4,false); break;
                    case "slt": this.slt_sltu(true); break;
                    case "slti": this.slti_sltiu(true); break;
                    case "sltiu": this.slti_sltiu(false); break;
                    case "sltu": this.slt_sltu(false); break;
                    case "sra": this.shift(false, false, 8,false); break;
                    case "srai": this.shift(false, false, 8,true); break;
                    case "sraiw": this.shift(false, false, 4,true); break;
                    case "sraw": this.shift(false, false, 4,false); break;
                    case "srl": this.shift(false, true, 8,false); break;
                    case "srli": this.shift(false, true, 8,true); break;
                    case "srliw": this.shift(false, true, 4,true); break;
                    case "srlw": this.shift(false, true, 4,false); break;
                    case "sub": this.add_sub(false); break;
                    case "subw": this.addw_subw(false); break;
                    case "xor": this.xor(); break;
                    case "xori": this.xori(); break;
                    case "div": this.divide(true, 8); break;
                    case "divu":  this.divide(false, 8); break;
                    case "divuw": this.divide(false,4); break;
                    case "divw": this.divide(true,4); break;
                    case "mul": this.mul(); break;
                    case "mulh": this.multiplyHigh(true, true); break;
                    case "mulhsu": this.multiplyHigh(true, false); break;
                    case "mulhu": this.multiplyHigh(false, false); break;
                    case "mulw": this.mulw(); break;
                    case "rem": this.remainder(true,64); break;
                    case "remu": this.remainder(false,64); break;
                    case "remuw": this.remainder(false,32); break;
                    case "remw": this.remainder(true,32); break;
                    default: break;
                }
            }
            this.incrementPC();
            this.updateRegisterLog();
            this.updateDataMemoryLog();
        }
    }

    updateRegisterLog() {
        this.registerLog[this.cc + 5] = this.gpRegisters;
        this.gpRegisters = [...this.gpRegisters];
    }

    updateDataMemoryLog() {
        let cleanDataMem = [];
        for (var i = 0; i < this.dataMem.length; i++) {
            let memValue = this.dataMem[i];
            if (typeof memValue !== "undefined") {
                cleanDataMem.push([i,memValue]);
            }
        }
        // console.log("data mem saved at cc: " + this.cc);
        this.dataMemLog[this.cc + 4] = cleanDataMem;
        this.dataMem = [...this.dataMem];
    }

    setFirstFiveCcInLogs() {
        const emptyRegisters = new BigInt64Array(32).fill(0n);
        for (var i = 0; i < 5; i++) {
            this.registerLog[i] = [...emptyRegisters];
            this.dataMemLog[i] = [];
        }
        this.registerLog[5] = [...emptyRegisters];
    }

    incrementPC() {
        if (this.pcChange) {
            this.pcChange = false;
        } else {
            this.pc += 1n;
        }
    }

    putFlushesInPipelineOrder() {
        let flushPC = Number(this.pc) + 1;
        let flushesLeft = 2;
        while (flushPC < Math.min(this.code.length) && flushesLeft > 0) {
            let assemblyLineNumber = this.code[flushPC][6];
            this.highlightOrder.push([assemblyLineNumber]);
            this.pipelineOrder.push([flushPC,false]);
            this.updateDataMemoryLog();
            this.cc++;
            console.log("cc incremented due to flush");
            flushPC++;
            flushesLeft--;
        }
    }

    getArithmeticFields() {
        let rd = this.inst[1];
        let rs1 = this.inst[2];
        let rs2 = this.inst[3];
        return [rd.substring(1, rd.length), rs1.substring(1, rs1.length), rs2.substring(1, rs2.length)];
    }

    getImmediateFields() {
        let rd = this.inst[1];
        let rs1 = this.inst[2];
        return [rd.substring(1, rd.length),
                rs1.substring(1, rs1.length),
                BigInt.asIntN(12, this.inst[3])];
    }

    getBranchFields() {
        let target = this.inst[3];
        let branchAddress = new RegExp('^(-?[0-9]+)$').test(target) ?
                            this.pc + BigInt.asIntN(12, target) :
                            BigInt(this.lineNumberByLabel[target]);
        let rd = this.inst[1];
        let rs1 = this.inst[2];
        return [rd.substring(1, rd.length),
                rs1.substring(1, rs1.length),
                branchAddress];
    }

    getMemAccessFields() {
        let rs1 = this.inst[1];
        let rs2 = this.inst[2];
        let offset = rs2.substring(0,rs2.indexOf("("));
        let memReg = rs2.substring(rs2.indexOf("(") + 2, rs2.indexOf(")"));
        let memAddress = Number(offset) + Number(this.gpRegisters[memReg]);
        return [rs1.substring(1,rs1.length), memAddress];
    }

    unsignedRightShift(value, valueLength, shiftsAsBigInt) {
        value = value >> shiftsAsBigInt;
        let compare = ~BigInt.asIntN(valueLength, -1n << shiftsAsBigInt);
        return value & compare;
    }

    expandMemByteUnsigned(memByte) {
        // extend memByte to 64 bits - signed
        let extend = BigInt.asIntN(64, memByte);
        if (memByte >= 0n) {
            return extend;
        }
        // create double word where the three left-most bytes are ones
        let compare = BigInt.asIntN(64, -1n << 8n);
        return extend ^ compare;
    }

    add_sub(add) {
        let fields = this.getArithmeticFields();
        let rs1 = this.gpRegisters[fields[1]];
        let rs2 = this.gpRegisters[fields[2]];
        this.gpRegisters[fields[0]] = add ? rs1 + rs2 : rs1 - rs2;
    }

    addi() {
        let fields = this.getImmediateFields();
        this.gpRegisters[fields[0]] = this.gpRegisters[fields[1]] + fields[2];
    }

    addiw() {
        let fields = this.getImmediateFields();
        let rs1 = BigInt.asIntN(32, this.gpRegisters[fields[1]]);
        this.gpRegisters[fields[0]] = BigInt.asIntN(64, BigInt.asIntN(32,rs1 + fields[2]));
    }

    addw_subw(addw) {
        let fields = this.getArithmeticFields();
        let rs1 = this.gpRegisters[fields[1]];
        let rs2 = this.gpRegisters[fields[2]];
        this.gpRegisters[fields[0]] = addw ? BigInt.asIntN(64, BigInt.asIntN(32,rs1 + rs2)) : BigInt.asIntN(64, BigInt.asIntN(32,rs1 - rs2));
    }

    and() {
        let rsNumbers = this.getArithmeticFields();
        this.gpRegisters[rsNumbers[0]] = this.gpRegisters[rsNumbers[1]] & this.gpRegisters[rsNumbers[2]];
    }

    andi() {
        let fields = this.getImmediateFields();
        this.gpRegisters[fields[0]] = this.gpRegisters[fields[1]] & BigInt.asIntN(64,fields[2]);
    }

    upperImmediate(add) {
        let rdNumber = this.inst[1].substring(1, this.inst[1].length);
        let immShifted = BigInt.asIntN(20, this.inst[2]) << 12n;
        this.gpRegisters[rdNumber] = add ? BigInt.asIntN(64, this.pc + immShifted) : BigInt.asIntN(64, immShifted);
    }

    branch(signed, logicalOperation) {
        let fields = this.getBranchFields();
        let rs1 = signed ? this.gpRegisters[fields[0]] : BigInt.asUintN(64, this.gpRegisters[fields[0]]);
        let rs2 = signed ? this.gpRegisters[fields[1]] : BigInt.asUintN(64, this.gpRegisters[fields[1]]);
        let condition;
        switch (logicalOperation) {
            case "<": condition = rs1 < rs2; break;
            case ">=": condition = rs1 >= rs2; break;
            case "===": condition = rs1 === rs2; break;
            case "!==": condition = rs1 !== rs2; break;
            default: break;
        }
        if (condition) {
            this.putFlushesInPipelineOrder();
            this.pc = fields[2];
            this.pcChange = true;
        }
    }

    jal() {
        let rdNumber = this.inst[1].substring(1,this.inst[1].length);
        if (rdNumber !== 0) {
            // store next instruction address
            this.gpRegisters[rdNumber] = this.pc + 1n;
        }
        this.pc = BigInt(this.lineNumberByLabel[this.inst[2]]);
        this.pcChange = true;
    }

    jalr() {
        let fields = this.getMemAccessFields();
        if (fields[0] !== 0) {
            // store next instruction address
            this.gpRegisters[fields[0]] = this.pc + 1n;
        }
        this.pc = BigInt(fields[1]);
        this.pcChange = true;
    }

    load(signed, numberOfBytes) {
        let fields = this.getMemAccessFields();
        let k = 0n;
        let memAddress = fields[1];
        let memValue = 0n;
        let finalAddress = memAddress + numberOfBytes;
        // initialize memory byte in dataMem in case it hasn't already
        this.initializeDataMemory(memAddress, finalAddress);

        // for each memory byte to be loaded
        for (var i = memAddress; i < finalAddress; i++) {
            // expand memory byte to a double word - unsigned
            let memByte = this.expandMemByteUnsigned(this.dataMem[i]);
            // add to memory value
            memValue = memValue | (memByte << k);
            k += 8n;
        }
        this.gpRegisters[fields[0]] = signed ? BigInt.asIntN(8*numberOfBytes, memValue) : memValue;
    }

    initializeDataMemory(memAddress, finalAddress) {
        let preBytes = memAddress % 4;
        let postBytes = 3 - (finalAddress % 4);
        let startAddress = memAddress - preBytes;
        let endAddress = finalAddress + postBytes;

        for (var i = startAddress; i <= endAddress; i++) {
            if (typeof this.dataMem[i] === "undefined") {
                this.dataMem[i] = 0n;
            }
        }
    }

    or() {
        let fields = this.getArithmeticFields();
        this.gpRegisters[fields[0]] = this.gpRegisters[fields[1]] | this.gpRegisters[fields[2]];
    }

    ori() {
        let fields = this.getImmediateFields();
        this.gpRegisters[fields[0]] = this.gpRegisters[fields[1]] | BigInt.asIntN(64,fields[2]);
    }

    store(numberOfBytes) {
        let fields = this.getMemAccessFields();
        var rd = this.gpRegisters[fields[0]];
        let finalAddress = fields[1] + numberOfBytes;
        // initialize memory byte in dataMem in case it hasn't already
        this.initializeDataMemory(fields[1], finalAddress);
        for (var i = fields[1]; i < finalAddress; i++) {
            // save the right-most 8 bits into memory at memAddress
            this.dataMem[i] = BigInt.asIntN(8, rd);
            // right-shift value with 8 bits
            rd = rd >> 8n;
        }
    }

    shift(left, logical, numberOfBytes, shiftByImmediate) {
        let numberOfBits = numberOfBytes * 8;
        let fields = shiftByImmediate ? this.getImmediateFields() : this.getArithmeticFields();
        let rs1 = BigInt.asIntN(64, this.gpRegisters[fields[1]]);
        let shifts = shiftByImmediate ? BigInt.asIntN(5, fields[2]) : BigInt.asIntN(5, this.gpRegisters[fields[2]]);
        let compare1 = BigInt.asIntN(64, -1n << (64n-shifts));
        let compare2 = ~BigInt.asIntN(64, -1n << BigInt(64-numberOfBits));
        // shift according to left/right and logical/arithmetic
        let value = left ? rs1 << shifts : logical ? (rs1 >> shifts) ^ compare1: rs1 >> shifts;
        // if less than 8 byte is required from value => extend according to logical/arithmetic
        if (numberOfBytes < 8) {
            value = logical ? (BigInt.asIntN(numberOfBits,value) & compare2) : BigInt.asIntN(numberOfBits,value);
        }
        // save value in register
        this.gpRegisters[fields[0]] = value;
    }

    slt_sltu(signed) {
        let fields = this.getArithmeticFields();
        let rs1 = signed ? this.gpRegisters[fields[1]] : BigInt.asUintN(64, this.gpRegisters[fields[1]]);
        let rs2 = signed ? this.gpRegisters[fields[2]] : BigInt.asUintN(64, this.gpRegisters[fields[2]]);
        this.gpRegisters[fields[0]] = rs1 < rs2 ? 1n : 0n;
    }

    slti_sltiu(signed) {
        let fields = this.getImmediateFields();
        let rs1 = signed ? this.gpRegisters[fields[1]] : BigInt.asUintN(64, this.gpRegisters[fields[1]]);
        let imm = signed ? fields[2] : BigInt.asUintN(64, fields[2]);
        this.gpRegisters[fields[0]] = rs1 < imm ? 1n : 0n;
    }

    xor() {
        let fields = this.getArithmeticFields();
        this.gpRegisters[fields[0]] = this.gpRegisters[fields[1]] ^ this.gpRegisters[fields[2]];
    }

    xori() {
        let fields = this.getImmediateFields();
        this.gpRegisters[fields[0]] = this.gpRegisters[fields[1]] ^ BigInt.asIntN(64,fields[2]);
    }

    divide(signedRs2, numberOfBytes) {
        let numberOfBits = numberOfBytes * 8;
        let fields = this.getArithmeticFields();
        let rs1 = BigInt.asIntN(numberOfBits, this.gpRegisters[fields[1]]);
        let rs2 = signedRs2 ? BigInt.asIntN(numberOfBits, this.gpRegisters[fields[2]]) : BigInt.asUintN(numberOfBits, this.gpRegisters[fields[2]]);
        if (rs2 === 0n) {
            throw new DivisionByZeroException("Error in...\nline " + (Number(this.pc + 1n)) + ":\nDivision by zero");
        }
        this.gpRegisters[fields[0]] = BigInt.asIntN(64, rs1 / rs2);
    }

    mul() {
        let fields = this.getArithmeticFields();
        this.gpRegisters[fields[0]] = this.gpRegisters[fields[1]] * this.gpRegisters[fields[2]];
    }

    multiplyHigh(signedRs1, signedRs2) {
        let fields = this.getArithmeticFields();
        let rs1 = signedRs1 ? this.gpRegisters[fields[1]] : BigInt.asUintN(64, this.gpRegisters[fields[1]]);
        let rs2 = signedRs2 ? this.gpRegisters[fields[2]] : BigInt.asUintN(64, this.gpRegisters[fields[2]]);
        var result = BigInt.asIntN(128, BigInt(rs1 * rs2));
        result = this.unsignedRightShift(result,128,64n);
        this.gpRegisters[fields[0]] = BigInt.asIntN(64, result);
    }

    mulw() {
        let fields = this.getArithmeticFields();
        let rs1 = this.gpRegisters[fields[1]];
        let rs2 = this.gpRegisters[fields[2]];
        this.gpRegisters[fields[0]] = BigInt.asIntN(64, BigInt.asIntN(32,rs1 * rs2));
    }

    remainder(signed, regBits) {
        let fields = this.getArithmeticFields();
        let rs1 = signed ? BigInt.asIntN(regBits, this.gpRegisters[fields[1]]) : BigInt.asUintN(regBits, this.gpRegisters[fields[1]]);
        let rs2 = signed ? BigInt.asIntN(regBits, this.gpRegisters[fields[2]]) : BigInt.asUintN(regBits, this.gpRegisters[fields[2]]);
        if (rs2 === 0n) {
            throw new DivisionByZeroException("Error in...\nline " + (Number(this.pc + 1n)) + ":\nDivision by zero");
        }
        this.gpRegisters[fields[0]] = BigInt.asIntN(64, BigInt.asIntN(regBits,rs1 % rs2));
    }
}

window.AssemblyInterpreter = AssemblyInterpreter;
// module.exports = AssemblyInterpreter;