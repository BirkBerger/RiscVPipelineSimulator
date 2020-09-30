class HazardSolverHolder {

    constructor(hazardSolver) {
        this.hazardSolver = hazardSolver;
    }
    getHazardSolver() {
        return this.hazardSolver;
    }
}

module.exports = HazardSolverHolder;