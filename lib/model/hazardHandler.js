// For testing
// const DataHazardDetector = require("../../lib/model/dataHazardDetector");
// const DataHazardSolver = require("../../lib/model/dataHazardSolver");
// const ControlHazardDetector = require("../../lib/model/controlHazardDetector");
// const ControlHazardSolver = require("../../lib/model/controlHazardSolver");

/**
 * Creates data-hazard-free, control-hazard-free, and hazard-free code array.
 * Updates highlight list according to code array.
 * Updates register and memory logs according to code array.
 */
class HazardHandler {

    /**
     * Constructor
     * @param code - Either hazardous code array or control-hazard-free code
     * @param lineNumberByLabel - Mapping of labels to their instruction address
     * @param initialMemory - Memory at cc 0 holding only binary instructions
     */
    constructor(code, lineNumberByLabel, initialMemory) {
        this.code = [...code];
        this.highlightList = [];
        this.numberOfHazards = 0;
        this.registerLog = [];
        this.memLog = [];
        this.lineNumberByLabel = lineNumberByLabel;
        this.initialMemory = initialMemory;
    }

    /**
     * Interprets code.
     * Updates code array and logs.
     * @param withDataHazards - Consider code array to have data hazards
     * @param withControlHazards - Consider code array to have control hazards
     */
    interpretCode(withDataHazards, withControlHazards) {
        let interpreter = new AssemblyInterpreter(this.lineNumberByLabel, this.initialMemory, withDataHazards,withControlHazards);
        interpreter.interpretCleanAssemblyCode(this.code);
        this.registerLog = interpreter.registerLog;
        this.memLog = interpreter.memLog;
        this.code = interpreter.interpretedCodeArray;
        this.setHighlightList(interpreter.highlightOrder);
    }

    /**
     * Detects control hazards => numberOfHazards
     */
    detectControlHazards() {
        let controlHazardDetector = new ControlHazardDetector(this.code);
        controlHazardDetector.detectAll();
        this.numberOfHazards = controlHazardDetector.numberOfHazards;
    }

    /**
     * Detects data hazards => numberOfHazards
     */
    detectDataHazards() {
        // interpret code array without data hazards and with control hazards
        this.interpretCode( false,true);

        // detect data hazards
        let dataHazardDetector = new DataHazardDetector(this.code);
        dataHazardDetector.detectAll();
        this.numberOfHazards = dataHazardDetector.numberOfHazards;
    }

    /**
     * Solves control hazards
     */
    solveControlHazards() {
        // interpret code array with data hazards and without control hazards
        this.interpretCode(true,false);
    }

    /**
     * Solves data hazards
     */
    solveDataHazards() {
        // solve data hazards
        let dataHazardSolver = new DataHazardSolver(this.code, this.registerLog, this.memLog);
        dataHazardSolver.solveAll();
        this.code = dataHazardSolver.dataHazardFreeCode;
        this.registerLog = dataHazardSolver.registerLog;
        this.memLog = dataHazardSolver.dataMemLog;
        this.setHighlightList(dataHazardSolver.highlightOrder);
    }

    /**
     * Solves all hazards
     */
    solveAllHazards() {
        // interpret code array without data hazards and without control hazards
        this.interpretCode( false,false);

        // solve data hazards
        let dataHazardSolver = new DataHazardSolver(this.code, this.registerLog, this.memLog);
        dataHazardSolver.solveAll();
        this.code = dataHazardSolver.dataHazardFreeCode;
        this.registerLog = dataHazardSolver.registerLog;
        this.memLog = dataHazardSolver.dataMemLog;
        this.setHighlightList(dataHazardSolver.highlightOrder);
    }

    /**
     * For each instruction in the pipeline, add its pipeline row to its assembly line number for highlighting upon gutter clicks.
     * @param highlightingOrder - List of instructions assembly line numbers as they occur in the pipeline.
     */
    setHighlightList(highlightingOrder) {
        this.highlightList = new Array(this.code.length);
        for (var i = 0; i < highlightingOrder.length; i++) {
            let lineNumber = highlightingOrder[i];
            if (typeof this.highlightList[lineNumber] === "undefined") {
                this.highlightList[lineNumber] = [i];
            } else {
                this.highlightList[lineNumber] = this.highlightList[lineNumber].concat([i]);
            }
        }
    }
}


window.HazardHandler = HazardHandler;
// module.exports = HazardHandler;