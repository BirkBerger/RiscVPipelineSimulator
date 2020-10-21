// For testing
// const DataHazardSolver = require("/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/dataHazardSolver");

class HazardSolver {

    constructor(code) {
        this.code = code;
        this.highlightingList = [];
    }

    solveControlHazard(labelsByLineNumber) {
        let controlHazardHandler = new ControlHazardHandler(this.code);
        controlHazardHandler.solveAll(labelsByLineNumber);
        this.code = controlHazardHandler.controlHazardFreeCode;
        this.highlightingList = controlHazardHandler.highlightingList;
    }

    solveDataHazards() {
        let dataHazardHandler = new DataHazardHandler(this.code);
        dataHazardHandler.solveAll();
        this.code = dataHazardHandler.dataHazardFreeCode;
        this.highlightingList = dataHazardHandler.highlightingList;
        console.log(dataHazardHandler.numberOfHazards);
    }
}


window.HazardSolver = HazardSolver;
// module.exports = HazardSolver;