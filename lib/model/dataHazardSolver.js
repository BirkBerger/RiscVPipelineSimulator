// For testing
// const DataHazardDetector = require("../../lib/model/dataHazardDetector");


class DataHazardSolver extends DataHazardDetector {

    constructor(cleanCode, registerLog, dataMemLog) {
        super(cleanCode);
        this.registerLog = [...registerLog];
        this.dataMemLog = [...dataMemLog];
        this.cc = 0;
    }

    solveAll() {
        super.detectAll();
    }

    detectAndSolveBetweenThreeLines(c, b, a) {
        super.detectAndSolveBetweenThreeLines(c,b,a);
        if (this.instA[4][0] && !this.instC[4][1] && !this.instC[4][2]) {
            // set the clock cycle at which the data can be fetched
            let srcCC = this.instA[4][2] ? 3.5 : 2.5;
            this.compareHazardsBetweenThreeLines(a, c, this.detectionAC, srcCC, false);
        }
    }

    detectAndSolveBetweenTwoLines(b, c) {
        super.detectAndSolveBetweenTwoLines(b,c);
        if (this.instB[4][0]) {
            // set the clock cycle at which the data can be fetched
            let srcCC = this.instB[4][2] ? 3.5 : 2.5;
            this.compareHazardsBetweenThreeLines(b, c, this.detectionBC, srcCC, true);
        }
    }

    compareHazardsBetweenThreeLines(srcLineNumber, desLineNumber, hazardTypes, srcCC, firstCheck) {
        if (firstCheck || this.bcDependency !== this.acDependency) {
            // solve data hazard for data needed before EX
            if ((hazardTypes[0] || hazardTypes[1] || hazardTypes[2])) {
                this.solveHazardBetweenTwoLines(srcLineNumber, desLineNumber, srcCC, 1.5);
            }
            // solve data hazard for data needed before MEM
            if (hazardTypes[3] || hazardTypes[4] || hazardTypes[5]) {
                this.solveHazardBetweenTwoLines(srcLineNumber, desLineNumber, srcCC, 2.5);
            }
        }
    }

    solveHazardBetweenTwoLines(srcLineNumber, desLineNumber, srcCC, desCC) {
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
        // insert stall in code array
        this.dataHazardFreeCode.splice(lineNumber,0,["Stall","","","",[false,""],[],assemblyLineNumber]);
        // set log clock cycles after "MEM" and "WB" stage of stall to previous clock cycle contents
        this.registerLog.splice(lineNumber+5,0,this.registerLog[lineNumber+4]);
        this.dataMemLog.splice(lineNumber+4,0,this.dataMemLog[lineNumber+3]);
    }
}

window.DataHazardSolver = DataHazardSolver;
// module.exports = DataHazardSolver;