// For testing
// const DataHazardSolver = require("/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/dataHazardSolver");

class HazardSolver {

    constructor(code) {
        this.code = [...code];
        this.highlightList = [];
        this.numberOfHazards = 0;
        this.registerLog = {};
        this.dataMemLog = {};
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

    solveDataHazards() {
        let dataHazardHandler = new DataHazardHandler(this.code);
        dataHazardHandler.detectAndSolveAll();
        this.numberOfHazards = dataHazardHandler.numberOfHazards;
        this.code = dataHazardHandler.dataHazardFreeCode;
        this.setHighlightList(dataHazardHandler.highlightOrder);
    }

    solveAllHazards(registerLog, memLog) {
        this.solveDataHazards();
        this.updateLogs(registerLog, memLog);
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

    updateLogs() {
        // account for stalls in register and memory logs
    }
}


window.HazardSolver = HazardSolver;
// module.exports = HazardSolver;