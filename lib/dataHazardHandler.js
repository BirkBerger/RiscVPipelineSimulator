class DataHazardHandler {

    constructor(cleanAssemblyCode) {
        this.dataHazardFreeCode = cleanAssemblyCode.slice();
        this.numberOfHazards = 0;
        this.lineNumbersWithHazards = new Set();
        this.instA = null;
        this.instB = null;
        this.instC = null;
        this.detectionBC = [false,false,false,false,false];
        this.solve = true;
        this.highlightOrder = [];
        this.highlightingList = [];
    }

    // detectAll() {
    //     this.solve = false;
    //     this.solveAll();
    //     this.solve = true;
    // }

    detectAndSolveAll() {
        if (this.dataHazardFreeCode.length >= 2) {
            this.instC = this.dataHazardFreeCode[1];
            this.detectAndSolveBetweenLines(0, 1);
            for (var i = 2; i < this.dataHazardFreeCode.length; i++) {
                this.instC = this.dataHazardFreeCode[i];
                this.detectAndSolveForThreeLines(i, i - 1, i - 2);
            }
        }
        this.setHighlightingOrder();
    }


    setHighlightingOrder() {
        for (var i = 0; i < this.dataHazardFreeCode.length; i++) {
            let assemblyLineNumber = this.dataHazardFreeCode[i][6];
            this.highlightOrder.push([assemblyLineNumber]);
        }
    }

    detectAndSolveForThreeLines(c, b, a) {
        this.detectAndSolveBetweenLines(b, c);
        this.instA = this.dataHazardFreeCode[a];
        if (this.instA[4][0]) {
            let detectionAC = this.getDetectionBetweenLines(this.instA, this.instC);
            this.instantiateSolveBetweenLines(a, c, detectionAC, 3.5, false);
            this.incrementNumberOfHazards(detectionAC, a, c);
        }
    }

    detectAndSolveBetweenLines(b, c) {
        this.instB = this.dataHazardFreeCode[b];
        if (this.instB[4][0]) {
            let srcCC = this.instB[0].charAt(0) === "l" && this.instB[0] !== "lui" ? 3.5 : 2.5;
            this.detectionBC = this.getDetectionBetweenLines(this.instB, this.instC);
            this.instantiateSolveBetweenLines(b, c, this.detectionBC, srcCC, true);
            this.incrementNumberOfHazards(this.detectionBC, b, c);
        }
    }

    getDetectionBetweenLines(srcLine, desLine) {
        if (srcLine[1] !== "x0") {
            let rs0Match = desLine[0].charAt(0) === "b" && srcLine[1] === desLine[1];
            let rs1Match = srcLine[1] === desLine[2] && desLine[0] !== "jal";
            let rs2Match = srcLine[1] === desLine[3] && desLine[0].charAt(0) !== "b";
            let storeRdMatch = desLine[0].charAt(0) === "s" && desLine[0].length === 2 && srcLine[1] === desLine[1];
            let memRegMatch = desLine[4][1] === srcLine[1];
            return [rs0Match, rs1Match, rs2Match, storeRdMatch, memRegMatch];
        } return [false,false,false,false,false];
    }

    incrementNumberOfHazards(detection, srcLineNumber, desLineNumber) {
        var hazards = 0;
        for (var i = 0; i < detection.length; i++) {
            hazards += detection[i] ? 1 : 0;
        }
        this.numberOfHazards += hazards;
        if (hazards !== 0) {
            this.lineNumbersWithHazards.add([srcLineNumber,'data']);
            this.lineNumbersWithHazards.add([desLineNumber,'data']);
        }
    }

    instantiateSolveBetweenLines(srcLineNumber, desLineNumber, hazardTypes, srcCC, firstCheck) {
        if ((hazardTypes[0] || hazardTypes[1] || hazardTypes[2]) && (firstCheck || !(this.detectionBC[0] || this.detectionBC[1] || this.detectionBC[2]))) {
            this.solveBetweenLines(srcLineNumber, desLineNumber, srcCC,  1.5);
        }
        if (hazardTypes[3] && (firstCheck || !this.detectionBC[3])) {
            this.solveBetweenLines( srcLineNumber, desLineNumber, srcCC,  2.5);
        }
        if (hazardTypes[4] && (firstCheck || !this.detectionBC[4])) {
            this.solveBetweenLines( srcLineNumber, desLineNumber, srcCC,  2.5);
        }
    }

    solveBetweenLines(srcLineNumber, desLineNumber, srcCC, desCC) {
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
        let assemblyLineNumber = this.dataHazardFreeCode[lineNumber][6];
        this.dataHazardFreeCode.splice(lineNumber,0,["Stall","","","",[false,""],[],assemblyLineNumber]);
    }
}

window.DataHazardSolver = DataHazardHandler;
// module.exports = DataHazardSolver;