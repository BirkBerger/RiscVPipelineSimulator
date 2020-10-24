// For testing
// const DataHazardSolver = require("/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/dataHazardSolver");

class HazardSolver {

    constructor(code) {
        this.code = [...code];
        this.highlightingList = [];
    }

    solveControlHazard(labelsByLineNumber) {
        let controlHazardHandler = new ControlHazardHandler(this.code);
        controlHazardHandler.solveAll(labelsByLineNumber);
        this.code = controlHazardHandler.controlHazardFreeCode;
        this.setHighlightingList(controlHazardHandler.pipelineOrder);
        // this.highlightingList = controlHazardHandler.highlightingList;
    }

    solveDataHazards() {
        let dataHazardHandler = new DataHazardHandler(this.code);
        dataHazardHandler.solveAll();
        this.code = dataHazardHandler.dataHazardFreeCode;
        console.log("data pipeline order");
        console.log(dataHazardHandler.pipelineOrder);

        this.setHighlightingList(dataHazardHandler.pipelineOrder);
        // this.highlightingList = dataHazardHandler.highlightingList;
    }

    setHighlightingList(pipelineOrder) {
        this.highlightingList = new Array(this.code.length);
        for (var i = 0; i < pipelineOrder.length; i++) {
            let lineNumber = pipelineOrder[i][0];
            if (typeof this.highlightingList[lineNumber] === "undefined") {
                this.highlightingList[lineNumber] = [i];
            } else {
                this.highlightingList[lineNumber] = this.highlightingList[lineNumber].concat([i]);
            }
        }
    }
}


window.HazardSolver = HazardSolver;
// module.exports = HazardSolver;