class DataHazardDetector {

    constructor(cleanCode) {
            this.dataHazardFreeCode = cleanCode.slice();
            this.numberOfHazards = 0;
            this.instA = null;
            this.instB = null;
            this.instC = null;
            this.detectionAC = [];
            this.detectionBC = [false,false,false,false,false];
            this.alterCodeArray = true;
            this.highlightOrder = [];
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
        // if instA writes rd
        if (this.instA[4][0]) {
            // detect potential hazards between instA and instC
            this.detectionAC = this.getDetectionBetweenLines(this.instA, this.instC);
            // detect number of hazards
            this.incrementNumberOfHazards(this.detectionAC)

        }
    }

    detectAndSolveBetweenTwoLines(b, c) {
        this.instB = this.dataHazardFreeCode[b];
        // if instB writes rd
        if (this.instB[4][0]) {
            // detect potential hazards between instB and instC
            this.detectionBC = this.getDetectionBetweenLines(this.instB, this.instC);
            // detect number of hazards
            this.incrementNumberOfHazards(this.detectionBC);
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
}

window.DataHazardDetector = DataHazardDetector;
// module.exports = DataHazardDetector;