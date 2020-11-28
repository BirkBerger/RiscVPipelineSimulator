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
        this.interpreter = null;
    }

    interpretCode(withDataHazards, withControlHazards) {
        this.interpreter = new AssemblyInterpreter(this.lineNumberByLabel, this.initialMemory, withDataHazards,withControlHazards);
        this.interpreter.interpretCleanAssemblyCode(this.code);
        this.registerLog = this.interpreter.registerLog;
        this.memLog = this.interpreter.memLog;
    }

    detectControlHazards() {
        let controlHazardDetector = new ControlHazardDetector(this.code);
        controlHazardDetector.detectAll();
        this.numberOfHazards = controlHazardDetector.numberOfHazards;
    }

    detectDataHazards() {
        let dataHazardDetector = new DataHazardDetector(this.code);
        dataHazardDetector.detectAll();
        this.numberOfHazards = dataHazardDetector.numberOfHazards;
    }

    solveControlHazards() {
        // interpret code array with data hazards and without control hazards
        this.interpretCode(true,false);

        // solve control hazards
        let controlHazardSolver = new ControlHazardSolver(this.code);
        controlHazardSolver.solveAll(this.interpreter);
        this.code = [...controlHazardSolver.controlHazardFreeCode];
        this.setHighlightList(controlHazardSolver.highlightOrder);
    }

    solveDataHazards() {
        // interpret code array without data hazards and with control hazards
        this.interpretCode( false,true);

        // solve data hazards
        let dataHazardSolver = new DataHazardSolver(this.code, this.registerLog, this.memLog);
        dataHazardSolver.solveAll();
        this.code = dataHazardSolver.dataHazardFreeCode;
        this.registerLog = dataHazardSolver.registerLog;
        this.memLog = dataHazardSolver.dataMemLog;
        this.setHighlightList(dataHazardSolver.highlightOrder);
    }

    solveAllHazards() {
        // interpret code array without data hazards and without control hazards
        this.interpretCode( false,false);

        // solve control hazards
        let controlHazardSolver = new ControlHazardSolver(this.code);
        controlHazardSolver.solveAll(this.interpreter);
        this.code = [...controlHazardSolver.controlHazardFreeCode];

        // solve data hazards
        let dataHazardSolver = new DataHazardSolver(this.code, this.registerLog, this.memLog);
        dataHazardSolver.solveAll();
        this.code = dataHazardSolver.dataHazardFreeCode;
        this.registerLog = dataHazardSolver.registerLog;
        this.memLog = dataHazardSolver.dataMemLog;
        this.setHighlightList(dataHazardSolver.highlightOrder);
    }

    // /**
    //  * Detect and solve control hazards.
    //  * Set number of control hazards, control-hazard-free code array, highlight list and logs.
    //  * @param lineNumberByLabel - Mapping of labels to their assembly line number (from cleaner)
    //  * @param initialMemory - Memory array at cc 0, containing binary assembly program
    //  */
    // detectAndSolveControlHazard(lineNumberByLabel, initialMemory, withDataHazards) {
    //     // detect control hazards
    //     let controlHazardDetector = new ControlHazardDetector(this.code);
    //     controlHazardDetector.detectAll();
    //     this.numberOfHazards = controlHazardDetector.numberOfHazards;
    //
    //     // solve control hazards
    //     let controlHazardSolver = new ControlHazardSolver(this.code);
    //     controlHazardSolver.solveAll(lineNumberByLabel, initialMemory, withDataHazards);
    //     this.code = controlHazardSolver.controlHazardFreeCode;
    //     this.setHighlightList(controlHazardSolver.highlightOrder);
    //     this.currentRegisterLog = controlHazardSolver.currentRegisterLog;
    //     this.memLog = controlHazardSolver.currentMemLog;
    // }

    // /**
    //  * Detect and solve data hazards.
    //  * Set number of data hazards, data-hazard-free code array, highlight list and logs.
    //  * @param currentRegisterLog - Register log either empty or from interpreter
    //  * @param memLog - Memory log either empty or from interpreter
    //  */
    // detectAndSolveDataHazards(currentRegisterLog, memLog) {
    //     // detect data hazards
    //     let dataHazardDetector = new DataHazardDetector(this.code);
    //     dataHazardDetector.detectAll();
    //     this.numberOfHazards = dataHazardDetector.numberOfHazards;
    //
    //     // solve data hazards
    //     let dataHazardSolver= new DataHazardSolver(this.code, currentRegisterLog, memLog);
    //     dataHazardSolver.solveAll();
    //     this.code = dataHazardSolver.dataHazardFreeCode;
    //     this.currentRegisterLog = dataHazardSolver.currentRegisterLog;
    //     this.memLog = dataHazardSolver.currentMemLog;
    //     this.setHighlightList(dataHazardSolver.highlightOrder);
    // }

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