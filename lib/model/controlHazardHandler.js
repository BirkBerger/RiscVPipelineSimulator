// For testing
// const AssemblyInterpreter = require("../../lib/model/assemblyInterpreter");

class ControlHazardHandler {

    constructor(code) {
        this.code = code;
        this.numberOfHazards = 0
        this.controlHazardFreeCode = [];
        this.highlightOrder = [];
        this.pipelineOrder = [];
        this.registerLog = {};
        this.dataMemLog = {};
    }

    detectAll() {
        for (var i = 0; i < this.code.length; i++) {
            let opcode = this.code[i][0];
            if (opcode === "beq" ||
                opcode === "bne" ||
                opcode === "blt" ||
                opcode === "bge" ||
                opcode === "bltu" ||
                opcode === "bgeu") {
                this.numberOfHazards += 1;
            }
        }
    }

    solveAll(labelsByLineNumber, initialMemory) {
        let interpreter = new AssemblyInterpreter(labelsByLineNumber, initialMemory);
        interpreter.interpretCleanAssemblyCode(this.code);

        this.highlightOrder = interpreter.highlightOrder;
        this.pipelineOrder = interpreter.pipelineOrder;
        this.registerLog = interpreter.registerLog;
        this.dataMemLog = interpreter.memLog;
        for (var i = 0; i < this.pipelineOrder.length; i++) {
            if (this.pipelineOrder[i][1]) {
                this.controlHazardFreeCode[i] = this.code[this.pipelineOrder[i][0]].slice();
            } else {
                this.controlHazardFreeCode[i] = ["Flush", "", "", "", [false, ""],[],this.highlightOrder[i]];
            }
        }
    }
}



window.ControlHazardHandler = ControlHazardHandler;
// module.exports = ControlHazardHandler;