// For testing
// const DataHazardSolver = require("../../lib/model/dataHazardHandler");
// const ControlHazardSolver = require("../../lib/model/controlHazardHandler");


class HazardHandler {

    constructor(code) {
        this.code = [...code];
        this.highlightList = [];
        this.numberOfHazards = 0;
        this.registerLog = [];
        this.dataMemLog = [];
    }

    detectAndSolveControlHazard(labelsByLineNumber, initialMemory) {
        // detect control hazards
        let controlHazardDetector = new ControlHazardDetector(this.code);
        controlHazardDetector.detectAll();
        this.numberOfHazards = controlHazardDetector.numberOfHazards;

        // solve control hazards
        let controlHazardSolver = new ControlHazardSolver(this.code);
        controlHazardSolver.solveAll(labelsByLineNumber, initialMemory);
        this.code = controlHazardSolver.controlHazardFreeCode;
        this.setHighlightList(controlHazardSolver.highlightOrder);
        this.registerLog = controlHazardSolver.registerLog;
        this.dataMemLog = controlHazardSolver.dataMemLog;
    }

    detectAndSolveDataHazards(registerLog, memLog) {
        // detect data hazards
        console.log(this.code);
        let dataHazardDetector = new DataHazardDetector(this.code);
        dataHazardDetector.detectAll();
        this.numberOfHazards = dataHazardDetector.numberOfHazards;

        // solve data hazards
        let dataHazardSolver= new DataHazardSolver(this.code, registerLog, memLog);
        dataHazardSolver.solveAll();
        this.code = dataHazardSolver.dataHazardFreeCode;
        this.registerLog = dataHazardSolver.registerLog;
        this.dataMemLog = dataHazardSolver.dataMemLog;
        this.setHighlightList(dataHazardSolver.highlightOrder);
    }

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