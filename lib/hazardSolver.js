const DataHazardSolver = require("/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/dataHazardSolver");

class HazardSolver {

    constructor(cleanAssemblyCode) {
        this.numberOfHazards = 0;
        this.noHazardsAssemblyCode = cleanAssemblyCode;
        this.addHazardColumns();
    }

    addHazardColumns() {
        for (var i = 0; i < this.noHazardsAssemblyCode.length; i++) {
            this.noHazardsAssemblyCode[i] = this.noHazardsAssemblyCode[i].concat([[]]);
        }
    }

    solveAllHazards() {
        let dataHazardSolver = new DataHazardSolver(this.noHazardsAssemblyCode);
        dataHazardSolver.detectAndSolveAll();
        this.numberOfHazards += dataHazardSolver.numberOfHazards;
        this.noHazardsAssemblyCode = dataHazardSolver.noHazardsAssemblyCode;
    }




}

// window.HazardSolver = HazardSolver;
module.exports = HazardSolver;