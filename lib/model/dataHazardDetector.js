class DataHazardDetector {

    constructor(cleanCode) {
            this.dataHazardFreeCode = cleanCode.slice();
            this.numberOfHazards = 0;
            this.instA = null;
            this.instB = null;
            this.instC = null;
            this.alterCodeArray = true;
            this.highlightOrder = [];
            this.detectionAC = [];
            this.detectionBC = [];
            this.acDependency = "noAcDependency";
            this.bcDependency = "noBcDependency";
        }

    detectAll() {
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
        this.acDependency = "noAcDependency";
        // if instA writes rd or mem and instC is not store or load
        if (this.instA[4][0] && !this.instC[4][1] && !this.instC[4][2]) {
            // detect potential hazards between instA and instC
            this.detectionAC = this.getDetectionBetweenLines(this.instA, this.instC);
            this.acDependency = this.detectionAC[0] || this.detectionAC[1] || this.detectionAC[2] || this.detectionAC[3] || this.detectionAC[4] ? this.instA[1] : "noAcDependency";
            // detect number of hazards
            this.incrementNumberOfHazards(this.detectionAC)
        }
    }

    detectAndSolveBetweenTwoLines(b, c) {
        this.instB = this.dataHazardFreeCode[b];
        this.bcDependency = "noBcDependency";
        // if instB writes rd or mem
        if (this.instB[4][0]) {
            // detect potential hazards between instB and instC
            this.detectionBC = this.getDetectionBetweenLines(this.instB, this.instC);
            this.bcDependency = this.detectionBC[0] || this.detectionBC[1] || this.detectionBC[2] || this.detectionBC[3] || this.detectionBC[4] ? this.instB[1] : "noBcDependency";
            // detect number of hazards
            this.incrementNumberOfHazards(this.detectionBC);
        }
    }

    getDetectionBetweenLines(srcInst, desInst) {
        // if the register being written by source instruction is not x0
        if (srcInst[1] !== "x0") {
            // src rd = des branch rs1
            let rs0Match = desInst[0].charAt(0) === "b" && srcInst[1] === desInst[1];
            // src rd = des rs1
            let rs1Match = srcInst[1] === desInst[2] && desInst[0] !== "jal";
            // src rd = des rs2
            let rs2Match = srcInst[1] === desInst[3] && desInst[0].charAt(0) !== "b";
            // src rd = des store rs1
            let storeRdMatch = desInst[4][1] && srcInst[1] === desInst[1];
            // src rd = des register holding memory address
            let addressRegMatch = desInst[2].substring(desInst[2].indexOf("(") + 1, desInst[2].indexOf(")")) === srcInst[1];
            // src memory write = des memory read
            let memoryMatch = srcInst[4][1] && desInst[4][2] && srcInst[2] === desInst[2];

            console.log("");
            console.log("memory address: " + desInst[2].substring(desInst[2].indexOf("(") + 1, desInst[2].indexOf(")")));
            console.log("srcInst: " + srcInst);
            console.log("desInst: " + desInst);
            console.log("rs0Match: " + rs0Match);
            console.log("rs1Match: " + rs1Match);
            console.log("rs2Match: " + rs2Match);
            console.log("storeRdMatch: " + storeRdMatch);
            console.log("addressRegMatch: " + addressRegMatch);
            console.log("memoryMatch: " + memoryMatch);

            return [rs0Match, rs1Match, rs2Match, storeRdMatch, addressRegMatch, memoryMatch];
        } return new Array(6).fill(false);
    }

    incrementNumberOfHazards(detection) {
        for (var i = 0; i < detection.length; i++) {
            this.numberOfHazards += detection[i] ? 1 : 0;
        }
    }
}

window.DataHazardDetector = DataHazardDetector;
// module.exports = DataHazardDetector;