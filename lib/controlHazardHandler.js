class ControlHazardHandler {

    constructor(code) {
        this.code = code;
        this.numberOfHazards = 0
        this.lineNumbersWithHazards = [];
        this.controlHazardFreeCode = [];
        this.highlightingList = [];
    }

    detectAll() {
        for (var i = 0; i < this.code.length; i++) {
            let opcode = this.code[i][0];
            if (opcode === "beq" ||
                opcode === "bne" ||
                opcode === "blt" ||
                opcode === "bge" ||
                opcode === "bltu" ||
                opcode === "bgeu" ||
                opcode === "jal" ||
                opcode === "jalr") {
                this.numberOfHazards += 1;
                this.lineNumbersWithHazards[this.lineNumbersWithHazards.length] = [i,"control"];
            }
        }
    }

    solveAll(labelsByLineNumber) {
        let interpreter = new AssemblyInterpreter(labelsByLineNumber);
        try {
            interpreter.interpretCleanAssemblyCode(this.code);
        } catch {
            // TODO
        }
        for (var i = 0; i < interpreter.pipelineOrder.length; i++) {
            this.controlHazardFreeCode[i] = interpreter.interpretedCode[interpreter.pipelineOrder[i]];
        }
        for (var j = 0; j < interpreter.flushes.length; j++) {
            this.controlHazardFreeCode.splice(interpreter.flushes[j], 0, ["Flush", "", "", "", [false, ""], []]);
            this.controlHazardFreeCode.splice(interpreter.flushes[j], 0, ["Flush", "", "", "", [false, ""], []]);
        }
        this.highlightingList = interpreter.highlightingList;
    }
}



window.ControlHazardHandler = ControlHazardHandler;
// module.exports = ControlHazardHandler;