// For testing
// const DataHazardSolver = require("/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/dataHazardSolver");

class HazardSolver {

    constructor(code) {
        this.code = code;
        this.highlightingList = [];
        // this.numberOfHazards = 0;
        // this.hazardFreeCode = this.addHazardColumns(cleanCode);
        // this.dataHazardSolver = new DataHazardHandler(this.hazardFreeCode);
        // this.controlHazardDetecter = new ControlHazardDetector();
        // this.lineNumbersWithHazards = [];
    }

    solveControlHazard() {
        let controlHazardHandler = new ControlHazardHandler(code);
        controlHazardHandler.solveAll();
        this.code = controlHazardHandler.controlHazardFreeCode;
        this.highlightingList = controlHazardHandler.highlightingList;
    }

    solveDataHazards() {
        let dataHazardHandler = new DataHazardHandler(code);
        dataHazardHandler.solveAll();
        this.code = dataHazardHandler.dataHazardFreeCode;
        this.highlightingList = dataHazardHandler.highlightingList;
    }

    // addHazardColumns(array) {
    //     for (var i = 0; i < array.length; i++) {
    //         array[i] = array[i].concat([[]]);
    //     } return array;
    // }
    //
    // detectAllHazards() {
    //     this.dataHazardSolver.detectAll();
    //     this.controlHazardDetecter.detectAll(this.hazardFreeCode);
    //     this.numberOfHazards = this.dataHazardSolver.numberOfHazards + this.controlHazardDetecter.numberOfHazards;
    //     this.lineNumbersWithHazards = this.lineNumbersWithHazards.concat(this.dataHazardSolver.lineNumbersWithHazards);
    //     this.lineNumbersWithHazards = this.lineNumbersWithHazards.concat(this.controlHazardDetecter.lineNumbersWithHazards);
    //     console.log(this.lineNumbersWithHazards);
    // }
    //
    // solveAllHazards() {
    //     this.dataHazardSolver.solveAll();
    //     this.hazardFreeCode = this.dataHazardSolver.dataHazardFreeCode;
    // }

}


window.HazardSolver = HazardSolver;
// module.exports = HazardSolver;