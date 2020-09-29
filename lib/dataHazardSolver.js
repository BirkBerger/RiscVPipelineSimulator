class DataHazardSolver {

    constructor(cleanAssemblyCode) {
        this.noHazardsAssemblyCode = cleanAssemblyCode;
        this.numberOfHazards = 0;
        this.instA = null;
        this.instB = null;
        this.instC = null;
        this.detectionBC = null;
        this.stallInserted = false;
    }

    getNoDataHazardsAssemblyCode() {
        return this.noHazardsAssemblyCode;
    }

    getNumberOfDataHazards() {
        return this.numberOfHazards;
    }

    detectAndSolveAll() {
        let numberOfInstructions = this.noHazardsAssemblyCode.length;
        // iterate instructions bottom up
        if (numberOfInstructions >= 2) {
            for (var i = numberOfInstructions - 1; i > 1; i--) {
                this.instC = this.noHazardsAssemblyCode[i];
                if (this.instC !== ["---"]) {
                    this.detectAndSolveForThreeLines(i, i - 1, i - 2);
                }
            }
            this.instB = this.noHazardsAssemblyCode[0];
            this.instC = this.noHazardsAssemblyCode[1];
            this.detectAndSolveBetweenLines(0, 1);
        }
    }

    detectAndSolveForThreeLines(a, b, c) {
        this.instA = this.noHazardsAssemblyCode[a];
        this.detectAndSolveBetweenLines(b,c);
        if (!this.stallInserted && this.instA[4][0]) {
            let detectionAC = this.getDetectionBetweenLines(false);
            this.instantiateSolveBetweenLines(a, c, detectionAC, 3.5, false);
        }
    }

    detectAndSolveBetweenLines(b, c) {
        this.instB = this.noHazardsAssemblyCode[b];
        let srcCC = this.instB[0].charAt(0) === "l" && this.instB[0] !== "lui" ? 3.5 : 2.5;
        this.detectionBC = this.getDetectionBetweenLines(true);
        if (this.instB[4][0]) {
            this.instantiateSolveBetweenLines(b, c, this.detectionBC, srcCC, true);
        }
    }
    getDetectionBetweenLines(firstCheck) {
        var srcLine = firstCheck ? this.instB : this.instA;
        let rs1Match = this.instC[1] === srcLine[2] && srcLine[0] !== "jal";
        let rs2Match = this.instC[1] === srcLine[3] && srcLine[0].charAt(0) !== "b";
        let storeRdMatch = srcLine[0].charAt(0) === "s" && srcLine[0].length === 2 && srcLine[1] === this.instC[1];
        let memRegMatch = srcLine[4][1] !== "" && srcLine[4][1] === this.instC[1];
        return [rs1Match,rs2Match,storeRdMatch,memRegMatch];
    }

    instantiateSolveBetweenLines(srcLineNumber, desLineNumber, hazardTypes, srcCC, firstCheck) {
        if (hazardTypes[0] || hazardTypes[1] &&
            (firstCheck ? true : !(this.detectionBC[0] || this.detectionBC[1]))) {
            this.solveBetweenLines(srcLineNumber, desLineNumber, srcCC,  1.5);
            this.numberOfHazards += hazardTypes[0] && hazardTypes[1] ? 2 : 1;
        }
        if (hazardTypes[2] && (firstCheck ? true : !this.detectionBC[2])) {
            this.solveBetweenLines(srcLineNumber, desLineNumber, srcCC,  2.5);
            this.numberOfHazards++;
        }
        if (hazardTypes[3] && (firstCheck ? true : !this.detectionBC[3])) {
            this.solveBetweenLines(srcLineNumber, desLineNumber, srcCC,  3.5);
            this.numberOfHazards++;
        }
    }

    solveBetweenLines(srcLineNumber, desLineNumber, srcCC, desCC) {


        if (srcCC + srcLineNumber <= desCC + desLineNumber) {
            this.insertForwardingLine(srcLineNumber, desLineNumber, srcCC, desCC);
        } else {
            this.insertStall(desLineNumber);
            this.stallInserted = true;
        }
    }

    insertForwardingLine(srcLineNumber, desLineNumber, startCC, endCC) {
        this.noHazardsAssemblyCode[srcLineNumber] = this.noHazardsAssemblyCode[srcLineNumber].concat([startCC, desLineNumber, endCC]);
    }

    insertStall(lineNumber) {
        this.noHazardsAssemblyCode.splice(lineNumber,0,["---"]);
    }
}

// window.DataHazardSolver = DataHazardSolver;
module.exports = DataHazardSolver;