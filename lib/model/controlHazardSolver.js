// For testing
const AssemblyInterpreter = require("../../lib/model/assemblyInterpreter");

/**
 * Solve control hazards in code array by ordering instructions according to execution and inserting flushes.
 */
class ControlHazardSolver {

    constructor(code) {
        this.code = code;
        this.controlHazardFreeCode = [];
        this.highlightOrder = [];
        this.pipelineOrder = [];
        this.registerLog = {};
        this.dataMemLog = {};
    }

    /**
     * Solves control hazards in code array by interpreting the code, hence simulating its execution in a 5-stage pipeline.
     * @param labelsByLineNumber - Mapping of branch/jump labels to assembly line numbers (from cleaner)
     * @param initialMemory - Memory content at cc 0 (hence holding the binary instructions)
     */
    solveAll(labelsByLineNumber, initialMemory, withDataHazards) {
        // interpret code array
        let interpreter = new AssemblyInterpreter(labelsByLineNumber, initialMemory, withDataHazards);
        interpreter.interpretCleanAssemblyCode(this.code);

        this.highlightOrder = interpreter.highlightOrder;
        this.pipelineOrder = interpreter.pipelineOrder;
        this.registerLog = interpreter.registerLog;
        this.dataMemLog = interpreter.memLog;

        // Create control-hazard-free code array from interpreter pipeline order
        for (var i = 0; i < this.pipelineOrder.length; i++) {
            if (this.pipelineOrder[i][1]) {
                this.controlHazardFreeCode[i] = this.code[this.pipelineOrder[i][0]].slice();
            } else {
                this.controlHazardFreeCode[i] = ["Flush", "", "", "", [false, ""],[],this.highlightOrder[i]];
            }
        }
    }
}

// window.ControlHazardSolver = ControlHazardSolver;
module.exports = ControlHazardSolver;