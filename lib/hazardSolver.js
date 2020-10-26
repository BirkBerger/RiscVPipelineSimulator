// For testing
// const DataHazardSolver = require("/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/dataHazardSolver");

class HazardSolver {

    constructor(code, cleanToCrudeLineNumber) {
        this.code = [...code];
        this.highlightList = [];
        this.cleanToCrudeLineNumber = cleanToCrudeLineNumber;
    }

    solveControlHazard(labelsByLineNumber) {
        let controlHazardHandler = new ControlHazardHandler(this.code);
        controlHazardHandler.solveAll(labelsByLineNumber);
        this.code = controlHazardHandler.controlHazardFreeCode;
        this.setHighlightList(controlHazardHandler.highlightOrder);
    }

    solveDataHazards() {
        let dataHazardHandler = new DataHazardHandler(this.code);
        dataHazardHandler.solveAll();
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