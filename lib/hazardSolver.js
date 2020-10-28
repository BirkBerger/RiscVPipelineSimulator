// For testing
// const DataHazardSolver = require("/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/dataHazardSolver");

class HazardSolver {

    constructor(code) {
        this.code = [...code];
        this.highlightList = [];
        // this.lineNumbersWithHazards = lineNumbersWithHazards;
        this.numberOfHazards = 0;
        this.registerLog = {};
        this.dataMemLog = {};
    }

    solveControlHazard(labelsByLineNumber) {
        let controlHazardHandler = new ControlHazardHandler(this.code);
        controlHazardHandler.detectAll();

        this.numberOfHazards = controlHazardHandler.numberOfHazards;
        // this.lineNumbersWithHazards = new Set([...this.lineNumbersWithHazards, ...controlHazardHandler.lineNumbersWithHazards]);

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
        // this.lineNumbersWithHazards = new Set([...this.lineNumbersWithHazards, ...dataHazardHandler.lineNumbersWithHazards]);

        this.code = dataHazardHandler.dataHazardFreeCode;
        this.setHighlightList(dataHazardHandler.highlightOrder);
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