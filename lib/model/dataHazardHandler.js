class DataHazardHandler {

    constructor(cleanAssemblyCode, registerLog, dataMemLog) {
        this.dataHazardFreeCode = cleanAssemblyCode.slice();
        this.numberOfHazards = 0;
        this.instA = null;
        this.instB = null;
        this.instC = null;
        this.detectionBC = [false,false,false,false,false];
        this.alterCodeArray = true;
        this.highlightOrder = [];
        this.registerLog = [...registerLog];
        this.dataMemLog = [...dataMemLog];
        this.cc = 0;
        this.solve = true;
    }

    detectAndSolveAll() {
        this.alterCodeArray = false;
        this.solveAll();
        this.alterCodeArray = true;
        this.solveAll();
    }

    solveAll() {
        if (this.dataHazardFreeCode.length >= 2) {
            this.instC = this.dataHazardFreeCode[1];
            this.detectAndSolveBetweenTwoLines(0, 1);
            for (var i = 2; i < this.dataHazardFreeCode.length; i++) {
                this.instC = this.dataHazardFreeCode[i];
                this.detectAndSolveBetweenThreeLines(i, i - 1, i - 2);
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

    detectAndSolveBetweenThreeLines(c, b, a) {
        this.detectAndSolveBetweenTwoLines(b, c);
        this.instA = this.dataHazardFreeCode[a];
        // if instA writes rd
        if (this.instA[4][0]) {
            // set the clock cycle at which the value to store in rd can be fetched // TODO: correct or just hardcode to 3.5?
            let srcCC = this.instA[0].charAt(0) === "l" && this.instA[0] !== "lui" ? 3.5 : 2.5;
            // detect potential hazards between instA and instC
            let detectionAC = this.getDetectionBetweenLines(this.instA, this.instC);
            // solve potential hazards between instA and instC
            if (this.alterCodeArray) {
                this.instantiateSolveBetweenLines(a, c, detectionAC, srcCC, false);
            } else {
                this.incrementNumberOfHazards(detectionAC)
            }
        }
    }

    detectAndSolveBetweenTwoLines(b, c) {
        this.instB = this.dataHazardFreeCode[b];
        // if instB writes rd
        if (this.instB[4][0]) {
            // set the clock cycle at which the value to store in rd can be fetched
            let srcCC = this.instB[0].charAt(0) === "l" && this.instB[0] !== "lui" ? 3.5 : 2.5;
            // detect potential hazards between instB and instC
            this.detectionBC = this.getDetectionBetweenLines(this.instB, this.instC);
            if (this.alterCodeArray) {
                // solve potential hazards between instB and instC
                this.instantiateSolveBetweenLines(b, c, this.detectionBC, srcCC, true);
            } else {
                // detect only number of hazards
                this.incrementNumberOfHazards(this.detectionBC);
            }
        }
    }

    getDetectionBetweenLines(srcInst, desInst) {
        // if the register being written by source instruction is not x0
        if (srcInst[1] !== "x0") {
            // check for any of the 5 data hazard types
            let rs0Match = desInst[0].charAt(0) === "b" && srcInst[1] === desInst[1];
            let rs1Match = srcInst[1] === desInst[2] && desInst[0] !== "jal";
            let rs2Match = srcInst[1] === desInst[3] && desInst[0].charAt(0) !== "b";
            let storeRdMatch = desInst[0].charAt(0) === "s" && desInst[0].length === 2 && srcInst[1] === desInst[1];
            let addressRegMatch = desInst[4][1] === srcInst[1];
            return [rs0Match, rs1Match, rs2Match, storeRdMatch, addressRegMatch];
        } return [false,false,false,false,false];
    }

    incrementNumberOfHazards(detection) {
        for (var i = 0; i < detection.length; i++) {
            this.numberOfHazards += detection[i] ? 1 : 0;
        }
    }

    instantiateSolveBetweenLines(srcLineNumber, desLineNumber, hazardTypes, srcCC, firstCheck) {
        // if arithmetic data hazard
        if ((hazardTypes[0] || hazardTypes[1] || hazardTypes[2]) && (firstCheck || !(this.detectionBC[0] || this.detectionBC[1] || this.detectionBC[2]))) {
            this.solveBetweenLines(srcLineNumber, desLineNumber, srcCC,  1.5);
        }
        // if store data hazard
        if (hazardTypes[3] && (firstCheck || !this.detectionBC[3])) {
            this.solveBetweenLines( srcLineNumber, desLineNumber, srcCC,  2.5);
        }
        // if memory address data hazard
        if (hazardTypes[4] && (firstCheck || !this.detectionBC[4])) {
            this.solveBetweenLines( srcLineNumber, desLineNumber, srcCC,  2.5);
        }
    }

    solveBetweenLines(srcLineNumber, desLineNumber, srcCC, desCC) {
        // if data is needed by destination instruction before termination of source instruction
        if (desCC + desLineNumber < srcLineNumber + 4) {
            // if cc at which data is ready in source instruction <= cc at which data is needed by destination instruction
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
        this.registerLog.splice(lineNumber,0,this.registerLog[lineNumber-1]);
        this.dataMemLog.splice(lineNumber,0,this.dataMemLog[lineNumber-1]);
    }
}

// window.DataHazardHandler = DataHazardHandler;
module.exports = DataHazardHandler;