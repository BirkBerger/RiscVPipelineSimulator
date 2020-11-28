// For testing
// const InfiniteLoopException = require("../../lib/exceptions/infiniteLoopException");
// const DivisionByZeroException = require("../../lib/exceptions/divisionByZeroException");
// const AddressOutOfBoundsException = require("../exceptions/addressOutOfBoundsException");

/**
 * Interprets assembly code by simulating the execution in a 5-stage pipeline.
 * Stores register and memory values for each clock cycle of the execution.
 */
class AssemblyInterpreter {

    constructor(lineNumberByLabel, initialMemory, withDataHazards, withControlHazards) {
        this.pc = 0n;
        this.pcChange = [];
        this.registerLog = [];
        this.registerLog[0] = new BigInt64Array(32).fill(0n);
        this.memLog = [];
        this.memLog[0] = initialMemory;
        this.lineNumberByLabel = lineNumberByLabel;
        this.inst = [];
        this.cc = 0;
        this.highlightOrder = [];
        this.code = [];
        this.pipelineOrder = [];
        this.intialMemory = initialMemory;
        this.withDataHazards = withDataHazards;
        this.solveControlHazards = withControlHazards;
    }

    /**
     * Iterates over the code array and initiate the action related to each opcode.
     * Increments cc for each iteration and stores register and memory logs.
     * @param cleanCode - Code array
     */
    interpretCleanAssemblyCode(cleanCode) {
        // start timer for runtime error check
        var timeOut = Date.now();
        this.code = cleanCode;
        // input the first 5 empty register logs and first 4 empty memory logs
        // this.initializeLogs()
        while (Number(this.pc) < cleanCode.length) {


            // runtime error detection: check if current time extends start time plus 800 ms
            if (Date.now() > timeOut + 800) {
                throw new InfiniteLoopException("The code has an infinite loop");
            }

            // increment clock cycle and fetch next instruction
            this.inst = cleanCode[Number(this.pc)];

            let arithmeticInstruction = true;
            let assemblyLineNumber = cleanCode[Number(this.pc)][6];
            this.highlightOrder.push(assemblyLineNumber);
            this.pipelineOrder.push([Number(this.pc),true]);

            console.log("\nopcode: " + this.inst[0]);

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
            this.cc++;
            this.updateRegisterLog();
            this.updateMemoryLog();
        }
        this.extendLogs();
    }

    extendLogs() {
        let numberOfCCs = Math.max(10, this.pipelineOrder.length + 6);
        while (this.memLog.length < numberOfCCs) {
            this.cc++;
            this.updateRegisterLog();
            this.updateMemoryLog();
        }
    }

    updateRegisterLog() {
        let writtenRegisterValues = this.registerLog[this.cc];
        this.registerLog[this.cc] = [...this.registerLog[this.cc-1]];

        if (typeof writtenRegisterValues !== "undefined") {
            for (var i = 0; i < writtenRegisterValues.length; i++) {
                if (typeof writtenRegisterValues[i] !== "undefined") {
                    this.registerLog[this.cc][i] = writtenRegisterValues[i];
                }
            }
        }
    }

    updateMemoryLog() {
        let writtenMemoryValues = this.memLog[this.cc];
        this.memLog[this.cc] = new Map(this.memLog[this.cc-1]);

        if (typeof writtenMemoryValues !== "undefined") {

            const iterator = writtenMemoryValues.entries();
            for (var i = 0; i < writtenMemoryValues.size; i++) {
                let entry = iterator.next().value;
                this.memLog[this.cc].set(entry[0], entry[1]);
            }
        }
    }

    /**
     * If PC has not been set by an instruction => increment it by one
     */
    incrementPC() {
        if (typeof this.pcChange[1] !== "undefined" && (!this.solveControlHazards || this.pcChange[0] === this.cc)) {
            this.putFlushesInPipelineOrder();
            this.pc = this.pcChange[1];
            this.pcChange = [];
        } else {
            this.pc += 1n;
        }
    }

    readRegister(regNumber, load = false) {
        let ccAvailable = this.cc + (this.withDataHazards ? (load ? 3 : 2) : 5);
        while (typeof this.registerLog[ccAvailable] === "undefined" || typeof this.registerLog[ccAvailable][regNumber] === "undefined") {
            ccAvailable--;
        }
        return this.registerLog[ccAvailable][regNumber];
    }

    readMemory(address) {
        let ccAvailable = this.cc + 4;
        while (typeof this.memLog[ccAvailable] === "undefined" || !this.memLog[ccAvailable].has(address)) {
            ccAvailable--;
        }
        return this.memLog[ccAvailable].get(address);
    }

    writeRegister(regNumber, value) {
        let cc = this.cc + 5;
        if (typeof this.registerLog[cc] === "undefined") {
            this.registerLog[cc] = [];
        }
        this.registerLog[cc][regNumber] = value;
    }

    writeMemory(value, beginAddress, endAddress) {
        console.log("write memory at address: " + beginAddress);
        let cc = this.cc + 4;
        // initialize memory if it hasn't already
        this.initializeMemory(cc, beginAddress, endAddress);
        for (var i = beginAddress; i < endAddress; i++) {
            console.log("down hier 2");
            // save the right-most 8 bits into memory at memAddress
            this.memLog[cc].set(i,BigInt.asIntN(8, value));
            // right-shift value by 8 bits
            value = value >> 8n;
        }
    }

    /**
     * Initialize memory bytes surrounding the input address,
     * from the address' closets lower divisor by 4 to its upper divisor by 4
     * @param cc - CC at which to write mem
     * @param memAddress - Memory address
     * @param finalAddress - Memory address + number of bytes to write
     */
    initializeMemory(cc, memAddress, finalAddress) {
        // initialize array at cc in memory log
        let latestLoggedMemCC = cc;
        while (typeof this.memLog[latestLoggedMemCC] === "undefined") {
            latestLoggedMemCC--;
        }
        this.memLog[cc] = new Map(this.memLog[latestLoggedMemCC]);
        // number of bytes to initialize before and after address
        let preBytes = memAddress % 4n;
        let postBytes = 3n - (finalAddress % 4n);
        // the first and final memory address to have initialized byte
        let startAddress = memAddress - preBytes;
        let endAddress = finalAddress + postBytes;

        // initialize bytes with the value 0
        for (var i = startAddress; i <= endAddress; i++) {
            console.log("down hier 1");
            if (!this.memLog[cc].has(i)) {
                this.memLog[cc].set(i, 0n);
            }
        }
    }

    /**
     * Input a maximum of 2 flushes in the pipeline and highlight order
     * pipelineOrder -> used to set the controlHazardFreeCode
     * highlightOrder -> used to properly highlight flushed instructions with editor gutter clicks
     */
    putFlushesInPipelineOrder() {
        let flushPC = Number(this.pc) + 1;
        let flushesLeft = 2;
        // if there are still instructions left in the pipeline to be flushed
        while (flushPC < Math.min(this.code.length) && flushesLeft > 0) {
            let assemblyLineNumber = this.code[flushPC][6];
            this.highlightOrder.push(assemblyLineNumber);
            this.pipelineOrder.push([flushPC,false]);
            this.cc++;
            this.updateRegisterLog();
            this.updateMemoryLog();
            flushPC++;
            flushesLeft--;
        }
    }

    /**
     * Extract three registers for arithmetic instructions
     * @returns {string[]} - Array of instruction fields
     */
    getArithmeticFields() {
        let rd = this.inst[1];
        let rs1 = this.inst[2];
        let rs2 = this.inst[3];
        return [rd.substring(1, rd.length), rs1.substring(1, rs1.length), rs2.substring(1, rs2.length)];
    }

    /**
     * Extract two registers and an immediate for immediate instructions
     * @returns {(string|bigint)[]} - Array of instruction fields
     */
    getImmediateFields() {
        let rd = this.inst[1];
        let rs1 = this.inst[2];
        return [rd.substring(1, rd.length),
                rs1.substring(1, rs1.length),
                BigInt.asIntN(12, this.inst[3])];
    }

    /**
     * Extract two registers and a branch target for branch instructions
     * @returns {(string|bigint)[]} - Array of instruction fields
     */
    getBranchFields() {
        let target = this.inst[3];
        let branchAddress = new RegExp('^(-?[0-9]+)$').test(target) ?
                            this.pc + BigInt.asIntN(12, target):
                            BigInt(this.lineNumberByLabel[target]);

        let rd = this.inst[1];
        let rs1 = this.inst[2];
        return [rd.substring(1, rd.length),
                rs1.substring(1, rs1.length),
                branchAddress];
    }

    /**
     * Extract two registers and a memory address for instructions that access memory
     * @returns {(string|number)[]} - Array of instruction fields
     */
    getMemAccessFields() {
        let rs1 = this.inst[1];
        let rs2 = this.inst[2];
        let offset = rs2.substring(0,rs2.indexOf("("));
        let memReg = rs2.substring(rs2.indexOf("(") + 2, rs2.indexOf(")"));
        let memAddress = BigInt(offset) + this.readRegister(memReg, true);
        return [rs1.substring(1,rs1.length), memAddress];
    }

    /**
     * Unsigned right shift value
     * @param value - Value to right shift
     * @param valueLength - Number of bits that occupy value
     * @param shifts - Number of shifts in BigInt format
     * @returns {bigint} - The unsigned right shifted value
     */
    unsignedRightShift(value, valueLength, shifts) {
        value = value >> shifts;
        let compare = ~BigInt.asIntN(valueLength, -1n << shifts);
        return value & compare;
    }

    /**
     * Extend memory byte to 64 bits unsigned
     * @param memByte
     * @returns {bigint} - The unsigned-extended memory byte
     */
    extendMemByteUnsigned(memByte) {
        // extend memByte to 64 bits - signed
        let extend = BigInt.asIntN(64, memByte);
        if (memByte >= 0n) {
            return extend;
        }
        // create double word where the three left-most bytes are ones
        let compare = BigInt.asIntN(64, -1n << 8n);
        return extend ^ compare;
    }


    /**
     * Evaluate add and sub instruction
     * @param add - True if add opcode, false if sub opcode
     */
    add_sub(add) {
        let fields = this.getArithmeticFields();
        let rs1 = this.readRegister(fields[1]);
        let rs2 = this.readRegister(fields[2]);
        // set rd
        this.writeRegister(fields[0], add ? rs1 + rs2 : rs1 - rs2);
    }

    /**
     * Evaluate addi instruction
     */
    addi() {
        let fields = this.getImmediateFields();
        let regValue = this.readRegister(fields[1]);
        // set rd
        this.writeRegister(fields[0], fields[2] + regValue);
    }

    /**
     * Evaluate addiw instruction
     */
    addiw() {
        let fields = this.getImmediateFields();
        let rs1 = BigInt.asIntN(32, this.readRegister(fields[1]));
        // set rd
        this.writeRegister(fields[0], BigInt.asIntN(64, BigInt.asIntN(32,rs1 + fields[2])));
    }

    /**
     * Evaluate addw and subw instruction
     * @param addw - True if addw opcode, false if subw opcode
     */
    addw_subw(addw) {
        let fields = this.getArithmeticFields();
        let rs1 = this.readRegister(fields[1]);
        let rs2 = this.readRegister(fields[2]);
        // set rd
        this.writeRegister(fields[0], addw ? BigInt.asIntN(64, BigInt.asIntN(32,rs1 + rs2)) : BigInt.asIntN(64, BigInt.asIntN(32,rs1 - rs2)));
    }

    /**
     * Evaluate and instruction
     */
    and() {
        let rsNumbers = this.getArithmeticFields();
        let rs1 = this.readRegister(rsNumbers[1]);
        let rs2 = this.readRegister(rsNumbers[2]);
        // set rd
        this.writeRegister(rsNumbers[0],rs1 & rs2);
    }

    /**
     * Evaluate andi instruction
     */
    andi() {
        let fields = this.getImmediateFields();
        let rs1 = this.readRegister(fields[1]);
        // set rd
        this.writeRegister(fields[0], rs1 & BigInt.asIntN(64,fields[2]));
    }

    /**
     * Evaluate auipc and lui instruction
     */
    upperImmediate(add) {
        let rdNumber = this.inst[1].substring(1, this.inst[1].length);
        let immShifted = BigInt.asIntN(20, this.inst[2]) << 12n;
        // set rd
        this.writeRegister(rdNumber, add ? BigInt.asIntN(64, this.pc + immShifted) : BigInt.asIntN(64, immShifted));
    }

    // lui x3, 524287
    // addi x2, x0, 2000
    // mul x4, x2, x3
    // sb x3, 0(x4)
//write memory at address: 4294959104000
    // lui x3, 524287
    // lui x2, 2000
    // mul x4, x2, x3
    // sb x3, 0(x4)
// write memory at address: 17592152489984000
//down hier 1 for ever

    /**
     * Evaluate branch instructions
     * @param signed - True if register values are considered signed, false if unsigned
     * @param logicalOperation - The logical involved in the branch condition
     */
    branch(signed, logicalOperation) {
        let fields = this.getBranchFields();
        let rs1 = signed ? this.readRegister(fields[0]) : BigInt.asUintN(64, this.readRegister(fields[0]));
        let rs2 = signed ? this.readRegister(fields[1]) : BigInt.asUintN(64, this.readRegister(fields[1]));
        let condition;
        // evaluate condition
        switch (logicalOperation) {
            case "<": condition = rs1 < rs2; break;
            case ">=": condition = rs1 >= rs2; break;
            case "===": condition = rs1 === rs2; break;
            case "!==": condition = rs1 !== rs2; break;
            default: break;
        }
        // if condition => set PC and input flushes
        if (condition) {
            this.pcChange = [this.cc + 2, fields[2]];
        }
    }

    /**
     * Evaluate jal instruction
     */
    jal() {
        let rdNumber = this.inst[1].substring(1,this.inst[1].length);
        if (rdNumber !== 0) {
            // store next instruction address
            this.writeRegister(rdNumber, this.pc + 1n);
        }
        // else => set PC and input flushes
        this.pcChange = [this.cc + 2, BigInt(this.lineNumberByLabel[this.inst[2]])];
    }

    /**
     * Evaluate jalr instruction
     */
    jalr() {
        let fields = this.getMemAccessFields();
        if (fields[0] !== 0) {
            // store next instruction address
            this.writeRegister(fields[0], this.pc + 1n);
        }
        let newAddress = this.pc + fields[1];
        // if address is out of bounds for the input program
        if (newAddress < 0n || newAddress >= BigInt(this.code.length)) {
            let assemblyLineNumber = this.inst[6];
            throw new AddressOutOfBoundsException("Error in...\n\tline " + (assemblyLineNumber + 1) + ":\n\t\t- jump address is out of bounds\n")
        }
        // else => set PC and input flushes
        this.pcChange = [this.cc + 2, newAddress];
    }

    /**
     * Evaluate load instructions
     * @param signed
     * @param numberOfBytes
     */
    load(signed, numberOfBytes) {
        let fields = this.getMemAccessFields();
        let k = 0n;
        let memAddress = fields[1];
        let memValue = 0n;
        let finalAddress = memAddress + BigInt(numberOfBytes);
        // initialize memory byte in currentMem in case it hasn't already
        this.initializeMemory(this.cc + 4, memAddress, finalAddress);
        // for each memory byte to be loaded
        for (var i = memAddress; i < finalAddress; i++) {
            // expand memory byte to a double word - unsigned
            let memByte = this.extendMemByteUnsigned(this.readMemory(i));
            // add to memory value
            memValue = memValue | (memByte << k);
            k += 8n;
        }
        // set rd
        let rdValue = signed ? BigInt.asIntN(8 * numberOfBytes, memValue) : memValue;
        this.writeRegister(fields[0], rdValue);
    }

    /**
     * Evaluate or instruction
     */
    or() {
        let fields = this.getArithmeticFields();
        let rs1 = this.readRegister(fields[1]);
        let rs2 = this.readRegister(fields[2]);
        // set rd
        this.writeRegister(fields[0], rs1 | rs2);
    }
    /**
     * Evaluate ori instruction
     */
    ori() {
        let fields = this.getImmediateFields();
        let rs1 = this.readRegister(fields[1]);
        // set rd
        this.writeRegister(fields[0],rs1 | BigInt.asIntN(64,fields[2]));
    }

    /**
     * Evaluate store instructions
     * @param numberOfBytes
     */
    store(numberOfBytes) {
        let fields = this.getMemAccessFields();
        var rd = this.readRegister(fields[0], true);
        let finalAddress = fields[1] + BigInt(numberOfBytes);
        this.writeMemory(rd, fields[1], finalAddress);
    }

    /**
     * Evaluate shift instructions
     * @param left - True if left, false if right
     * @param logical - True if logical, false if arithmetic
     * @param numberOfBytes - Number of bytes to shift value by
     * @param shiftByImmediate - True if shift by immediate, false if shift by register value
     */
    shift(left, logical, numberOfBytes, shiftByImmediate) {
        let numberOfBits = numberOfBytes * 8;
        let fields = shiftByImmediate ? this.getImmediateFields() : this.getArithmeticFields();
        let rs1 = BigInt.asIntN(64, this.readRegister(fields[1]));
        let shifts = shiftByImmediate ? BigInt.asIntN(5, fields[2]) : BigInt.asIntN(5, this.readRegister(fields[2]));
        let compare1 = BigInt.asIntN(64, -1n << (64n-shifts));
        let compare2 = ~BigInt.asIntN(64, -1n << BigInt(64-numberOfBits));
        // shift according to left/right and logical/arithmetic
        let value = left ? rs1 << shifts : logical ? (rs1 >> shifts) ^ compare1: rs1 >> shifts;
        // if less than 8 byte is required from value => extend according to logical/arithmetic
        if (numberOfBytes < 8) {
            value = logical ? (BigInt.asIntN(numberOfBits,value) & compare2) : BigInt.asIntN(numberOfBits,value);
        }
        // set rd
        this.writeRegister(fields[0], value);
    }

    /**
     * Evaluate slt and sltu
     * @param signed - True if slt, false if sltu
     */
    slt_sltu(signed) {
        let fields = this.getArithmeticFields();
        let rs1 = signed ? this.readRegister(fields[1]) : BigInt.asUintN(64, this.readRegister(fields[1]));
        let rs2 = signed ? this.readRegister(fields[2]) : BigInt.asUintN(64, this.readRegister(fields[2]));
        // set rd
        this.writeRegister(fields[0], rs1 < rs2 ? 1n : 0n);
    }

    /**
     * Evaluate slti and sltiu
     * @param signed - True if slti, false if sltiu
     */
    slti_sltiu(signed) {
        let fields = this.getImmediateFields();
        let rs1 = signed ? this.readRegister(fields[1]) : BigInt.asUintN(64, this.readRegister(fields[1]));
        let imm = signed ? fields[2] : BigInt.asUintN(64, fields[2]);
        // set rd
        this.writeRegister(fields[0], rs1 < imm ? 1n : 0n);
    }

    /**
     * Evaluate xor
     */
    xor() {
        let fields = this.getArithmeticFields();
        let rs1 = this.readRegister(fields[1]);
        let rs2 = this.readRegister(fields[2]);
        // set rd
        this.writeRegister(fields[0], rs1 ^ rs2);
    }

    /**
     * Evaluate xori
     */
    xori() {
        let fields = this.getImmediateFields();
        // set rd
        let rs1 = this.readRegister(fields[1]);
        this.writeRegister(fields[0], rs1 ^ BigInt.asIntN(64, fields[2]));
    }

    /**
     * Evaluate division instruction
     * @param signedRs2 - True if rs2 is considered signed, false if unsigned
     * @param numberOfBytes - number of right-most rs2 bytes to divide by
     */
    divide(signedRs2, numberOfBytes) {
        let numberOfBits = numberOfBytes * 8;
        let fields = this.getArithmeticFields();
        let rs1 = BigInt.asIntN(numberOfBits, this.readRegister(fields[1]));
        let rs2 = signedRs2 ? BigInt.asIntN(numberOfBits, this.readRegister(fields[2])) : BigInt.asUintN(numberOfBits, this.readRegister(fields[2]));
        // check for division by 0
        if (rs2 === 0n) {
            let assemblyLineNumber = this.inst[6];
            throw new DivisionByZeroException("Error in...\n\tline " + (assemblyLineNumber + 1) + ":\n\t\t- Division by zero\n");
        }
        // set rd
        this.writeRegister(fields[0], BigInt.asIntN(64, rs1 / rs2));
    }

    /**
     * Evaluate mul instruction
     */
    mul() {
        let fields = this.getArithmeticFields();
        let rs1 = this.readRegister(fields[1]);
        let rs2 = this.readRegister(fields[2]);
        // set rd
        this.writeRegister(fields[0], rs1 * rs2);
    }

    /**
     * Evaluate mulh, mulhsu, and mulhu instruction
     * @param signedRs1 - True if rs1 is considered signed, false if unsigned
     * @param signedRs2 - True if rs2 is considered signed, false if unsigned
     */
    multiplyHigh(signedRs1, signedRs2) {
        let fields = this.getArithmeticFields();
        let rs1 = signedRs1 ? this.readRegister(fields[1]) : BigInt.asUintN(64, this.readRegister(fields[1]));
        let rs2 = signedRs2 ? this.readRegister(fields[2]) : BigInt.asUintN(64, this.readRegister(fields[2]));
        var result = BigInt.asIntN(128, BigInt(rs1 * rs2));
        result = this.unsignedRightShift(result,128,64n);
        // set rd
        this.writeRegister(fields[0], BigInt.asIntN(64, result));
    }

    /**
     * Evaluate mulw instruction
     */
    mulw() {
        let fields = this.getArithmeticFields();
        let rs1 = this.readRegister(fields[1]);
        let rs2 = this.readRegister(fields[2]);
        // set rd
        this.writeRegister(fields[0], BigInt.asIntN(64, BigInt.asIntN(32,rs1 * rs2)));
    }

    /**
     * Evaluate modulo instructions
     * @param signed - True if registers are considered signed, false if unsigned
     * @param regBits - Number of right-most bits of the registers to calculate
     */
    remainder(signed, regBits) {
        let fields = this.getArithmeticFields();
        let rs1 = signed ? BigInt.asIntN(regBits, this.readRegister(fields[1])) : BigInt.asUintN(regBits, this.readRegister(fields[1]));
        let rs2 = signed ? BigInt.asIntN(regBits, this.readRegister(fields[2])) : BigInt.asUintN(regBits, this.readRegister(fields[2]));
        // check for division by 0
        if (rs2 === 0n) {
            let assemblyLineNumber = this.inst[6];
            throw new DivisionByZeroException("Error in...\n\tline " + (assemblyLineNumber + 1) + ":\n\t\t- Division by zero\n");
        }
        // set rd
        this.writeRegister(fields[0], BigInt.asIntN(64, BigInt.asIntN(regBits,rs1 % rs2)));
    }
}

window.AssemblyInterpreter = AssemblyInterpreter;
// module.exports = AssemblyInterpreter;