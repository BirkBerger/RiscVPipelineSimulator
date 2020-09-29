const DataHazardSolver = require("'/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/dataHazardSolver");

class HazardSolver {

    constructor(cleanAssemblyCode) {
        this.numberOfHazards = 0;
        this.noHazardsAssemblyCode = cleanAssemblyCode;
    }

    solveAllHazards() {
        let dataHazardSolver = new DataHazardSolver(this.noHazardsAssemblyCode);
        dataHazardSolver.detectAndSolveAll();
        this.numberOfHazards += dataHazardSolver.getNumberOfDataHazards();
        this.noHazardsAssemblyCode = dataHazardSolver.getNoDataHazardsAssemblyCode();
    }




}

// window.HazardSolver = HazardSolver;
module.exports = HazardSolver;