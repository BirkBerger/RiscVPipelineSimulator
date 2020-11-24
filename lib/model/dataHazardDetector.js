/**
 * Searched for data hazards in code array and sets number of hazards.
 */
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
            this.lineNumberC = 0;
        }

    /**
     * Iterate through code array 3 instructions at a time and instantiate data hazard detection.
     */
    detectAll() {
        if (this.dataHazardFreeCode.length >= 2) {
            // detect between the 2 first instructions
            this.instC = this.dataHazardFreeCode[1];
            this.lineNumberC = 1;
            this.detectAndSolveBetweenTwoLines();
            // detect rest
            for (var i = 2; i < this.dataHazardFreeCode.length; i++) {
                this.instC = this.dataHazardFreeCode[i];
                this.lineNumberC = i;
                this.detectAndSolveBetweenThreeLines();
            }
        }
    }

    /**
     * Detect data hazard between an instruction and its two predecessors.
     */
    detectAndSolveBetweenThreeLines() {
        this.detectAndSolveBetweenTwoLines();
        this.instA = this.dataHazardFreeCode[this.lineNumberC-2];
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

    /**
     * Detect data hazard between an instruction and its first predecessors.
     */
    detectAndSolveBetweenTwoLines() {
        this.instB = this.dataHazardFreeCode[this.lineNumberC-1];
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

    /**
     * Check for the 6 data hazard types between a source (instA or instB) and a destination instruction (instC)
     * @param srcInst
     * @param desInst
     * @returns {(boolean|boolean|*)[]|any[]}
     */
    getDetectionBetweenLines(srcInst, desInst) {

        var rs0Match, rs1Match, rs2Match, storeRdMatch, addressRegMatch, memoryMatch;

        // if the register being written is not x0 and the instruction is not a store
        if (srcInst[1] !== "x0" && !srcInst[4][1]) {
                // src rd = des branch rs1
                rs0Match = desInst[0].charAt(0) === "b" && srcInst[1] === desInst[1];
                // src rd = des rs1
                rs1Match = srcInst[1] === desInst[2] && desInst[0] !== "jal";
                // src rd = des rs2
                rs2Match = srcInst[1] === desInst[3] && desInst[0].charAt(0) !== "b";
                // src rd = des store rs1
                storeRdMatch = desInst[4][1] && srcInst[1] === desInst[1];
                // src rd = des register holding memory address
                addressRegMatch = desInst[2].substring(desInst[2].indexOf("(") + 1, desInst[2].indexOf(")")) === srcInst[1];
            }
        // src memory write = des memory read
        memoryMatch = srcInst[4][1] && desInst[4][2] && (srcInst[2] === desInst[2]);

        console.log("");
        // console.log("memory address: " + desInst[2].substring(desInst[2].indexOf("(") + 1, desInst[2].indexOf(")")));
        console.log("srcInst: " + srcInst);
        console.log("desInst: " + desInst);
        console.log("rs0Match: " + rs0Match);
        console.log("rs1Match: " + rs1Match);
        console.log("rs2Match: " + rs2Match);
        console.log("storeRdMatch: " + storeRdMatch);
        console.log("addressRegMatch: " + addressRegMatch);
        console.log("memoryMatch: " + memoryMatch);
        console.log("");

        return [rs0Match, rs1Match, rs2Match, storeRdMatch, addressRegMatch, memoryMatch];
    }

    /**
     * For the occurrence of any of the 6 data hazard types => increment number of data hazards
     * @param detection
     */
    incrementNumberOfHazards(detection) {
        for (var i = 0; i < detection.length; i++) {
            this.numberOfHazards += detection[i] ? 1 : 0;
        }
    }
}

window.DataHazardDetector = DataHazardDetector;
// module.exports = DataHazardDetector;