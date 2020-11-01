// For testing
// const DataHazardSolver = require("/Users/birkberger/Documents/DTU/Bachelorprojekt/RiscVPipelineSimulator/lib/dataHazardSolver");

class HazardSolver {

    constructor(code) {
        this.code = [...code];
        this.highlightList = [];
        this.numberOfHazards = 0;
        this.registerLog = [];
        this.dataMemLog = [];
    }

    solveControlHazard(labelsByLineNumber) {
        let controlHazardHandler = new ControlHazardHandler(this.code);
        controlHazardHandler.detectAll();
        this.numberOfHazards = controlHazardHandler.numberOfHazards;
        controlHazardHandler.solveAll(labelsByLineNumber);
        this.code = controlHazardHandler.controlHazardFreeCode;
        this.setHighlightList(controlHazardHandler.highlightOrder);
        this.registerLog = controlHazardHandler.registerLog;
        this.dataMemLog = controlHazardHandler.dataMemLog;
    }

    solveDataHazards(registerLog, memLog) {
        let dataHazardHandler = new DataHazardHandler(this.code, registerLog, memLog);
        dataHazardHandler.detectAndSolveAll();
        this.numberOfHazards = dataHazardHandler.numberOfHazards;
        this.code = dataHazardHandler.dataHazardFreeCode;
        this.registerLog = dataHazardHandler.registerLog;
        this.dataMemLog = dataHazardHandler.dataMemLog;
        this.setHighlightList(dataHazardHandler.highlightOrder);
    }

    solveAllHazards(registerLog, memLog) {
        this.solveDataHazards(registerLog, memLog);
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


window.HazardSolver = HazardSolver;
// module.exports = HazardSolver;