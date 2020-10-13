// For testing
const DataHazardSolver = require("/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/dataHazardSolver");

class HazardSolver {

    constructor(cleanAssemblyCode) {
        this.numberOfHazards = 0;
        this.hazardFreeCode = this.addHazardColumns(cleanAssemblyCode);
        this.dataHazardSolver = new DataHazardSolver(this.hazardFreeCode);
    }

    addHazardColumns(array) {
        for (var i = 0; i < array.length; i++) {
            array[i] = array[i].concat([[]]);
        } return array;
    }

    detectAllHazards() {
        this.dataHazardSolver.detectAll();
        this.numberOfHazards += this.dataHazardSolver.numberOfHazards;
    }

    solveAllHazards() {
        this.dataHazardSolver.detectAndSolveAll();
        this.hazardFreeCode = this.dataHazardSolver.dataHazardFreeCode;
    }

}


// window.HazardSolver = HazardSolver;
module.exports = HazardSolver;