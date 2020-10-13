class DataHazardSolver {

    constructor(cleanAssemblyCode) {
        this.dataHazardFreeCode = cleanAssemblyCode;
        this.numberOfHazards = 0;
        this.instA = null;
        this.instB = null;
        this.instC = null;
        this.detectionBC = [false,false,false,false];
        this.solve = true;
    }

    detectAll() {
        this.solve = false;
        this.detectAndSolveAll();
        this.solve = true;
    }

    detectAndSolveAll() {
        if (this.dataHazardFreeCode.length >= 2) {
            this.instC = this.dataHazardFreeCode[1];
            this.detectAndSolveBetweenLines(0, 1);
            for (var i = 2; i < this.dataHazardFreeCode.length; i++) {
                this.instC = this.dataHazardFreeCode[i];
                this.detectAndSolveForThreeLines(i, i - 1, i - 2);
            }
        }
    }

    detectAndSolveForThreeLines(c, b, a) {
        this.detectAndSolveBetweenLines(b, c);
        this.instA = this.dataHazardFreeCode[a];
        if (this.instA[4][0]) {
            let detectionAC = this.getDetectionBetweenLines(this.instA, this.instC);
            if (this.solve) {
                this.instantiateSolveBetweenLines(a, c, detectionAC, 3.5, false);
            } else {
                this.incrementNumberOfHazards(detectionAC);
            }
        }
    }

    detectAndSolveBetweenLines(b, c) {
        this.instB = this.dataHazardFreeCode[b];
        if (this.instB[4][0]) {
            let srcCC = this.instB[0].charAt(0) === "l" && this.instB[0] !== "lui" ? 3.5 : 2.5;
            this.detectionBC = this.getDetectionBetweenLines(this.instB, this.instC);
            if (this.solve) {
            this.instantiateSolveBetweenLines(b, c, this.detectionBC, srcCC, true);
            } else {
                this.incrementNumberOfHazards(this.detectionBC);
            }
        }
    }

    getDetectionBetweenLines(srcLine, desLine) {
        if (srcLine[1] !== "x0") {
            let rs1Match = srcLine[1] === desLine[2] && desLine[0] !== "jal";
            let rs2Match = srcLine[1] === desLine[3] && desLine[0].charAt(0) !== "b";
            let storeRdMatch = desLine[0].charAt(0) === "s" && desLine[0].length === 2 && srcLine[1] === desLine[1];
            let memRegMatch = desLine[4][1] === srcLine[1];
            return [rs1Match, rs2Match, storeRdMatch, memRegMatch];
        } return [false,false,false,false];
    }

    incrementNumberOfHazards(detection) {
        for (var i = 0; i < detection.length; i++) {
            this.numberOfHazards += detection[i] ? 1 : 0;
        }
    }

    instantiateSolveBetweenLines(srcLineNumber, desLineNumber, hazardTypes, srcCC, firstCheck) {
        if ((hazardTypes[0] || hazardTypes[1]) && (firstCheck || !(this.detectionBC[0] || this.detectionBC[1]))) {
            this.solveBetweenLines(2, srcLineNumber, desLineNumber, srcCC,  1.5);
        }
        if (hazardTypes[2] && (firstCheck || !this.detectionBC[2])) {
            this.solveBetweenLines(1, srcLineNumber, desLineNumber, srcCC,  2.5);
        }
        if (hazardTypes[3] && (firstCheck || !this.detectionBC[3])) {
            this.solveBetweenLines(1, srcLineNumber, desLineNumber, srcCC,  2.5);
        }
    }

    solveBetweenLines(amountOfHazards, srcLineNumber, desLineNumber, srcCC, desCC) {
        if (desCC + desLineNumber < srcLineNumber + 4) {
            if (srcCC + srcLineNumber <= desCC + desLineNumber) {
                this.insertForwardingLine(srcLineNumber, desLineNumber, srcCC, desCC);
            } else {
                this.insertStall(desLineNumber);
                this.insertForwardingLine(srcLineNumber, desLineNumber + 1, srcCC, desCC);
            }
        }
    }

    insertForwardingLine(srcLineNumber, desLineNumber, startCC, endCC) {
        this.dataHazardFreeCode[srcLineNumber][5] = this.dataHazardFreeCode[srcLineNumber][5].concat([startCC, desLineNumber, endCC]);
    }

    insertStall(lineNumber) {
        this.dataHazardFreeCode.splice(lineNumber,0,["Stall","","","",[false,""],[]]);
    }
}

// window.DataHazardSolver = DataHazardSolver;
module.exports = DataHazardSolver;