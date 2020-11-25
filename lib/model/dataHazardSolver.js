// For testing
// const DataHazardDetector = require("../../lib/model/dataHazardDetector");

/**
 * Detect and solves data hazards in the code array by the insertion of forwarding lines and stalls.
 */
class DataHazardSolver extends DataHazardDetector {

    constructor(cleanCode, registerLog, dataMemLog) {
        super(cleanCode);
        this.registerLog = [...registerLog];
        this.dataMemLog = [...dataMemLog];
        this.cc = 0;
    }

    /**
     * Iterate through code array 3 instructions at a time and instantiate data hazard detection and solving.
     */
    solveAll() {
        super.detectAll();
        // set highlighting order from updated code array
        this.setHighlightingOrder();
    }

    /**
     * Create list of assembly line numbers corresponding to the new data-hazard-free code array.
     * The list is used for highlighting pipeline rows upon editor gutter clicks.
     */
    setHighlightingOrder() {
        for (var i = 0; i < this.dataHazardFreeCode.length; i++) {
            let assemblyLineNumber = this.dataHazardFreeCode[i][6];
            this.highlightOrder.push([assemblyLineNumber]);
        }
    }

    /**
     * Detect and solve data hazard between an instruction and its two predecessors.
     */
    detectAndSolveBetweenThreeLines() {
        super.detectAndSolveBetweenThreeLines();
        if (this.instA[4][0] && !this.instC[4][1]) {
            // set the clock cycle at which the data can be fetched
            let srcCC = this.instA[4][1] ? 3.5 : 2.5;
            this.compareHazardsBetweenThreeLines(this.lineNumberC-2, this.lineNumberC, this.detectionAC, srcCC, false);
        }
    }

    /**
     * Detect and solve data hazard between an instruction and its first predecessors.
     */
    detectAndSolveBetweenTwoLines() {
        super.detectAndSolveBetweenTwoLines();
        if (this.instB[4][0]) {
            // set the clock cycle at which the data can be fetched
            let srcCC = this.instB[4][1] ? 3.5 : 2.5;
            this.compareHazardsBetweenThreeLines(this.lineNumberC-1, this.lineNumberC, this.detectionBC, srcCC, true);
        }
    }

    /**
     * Assign for every data hazard the cc at which data is needed and instantiate solving.
     * @param srcLineNumber - The source instruction line number
     * @param desLineNumber - The destination instruction line number
     * @param hazardTypes - The boolean array, each element being the occurrence of a data hazard type
     * @param srcCC - The cc at which data is available
     * @param firstCheck - True if instruction is checked with its 1st predecessor, false if it is checked with its 2nd predecessor
     */
    compareHazardsBetweenThreeLines(srcLineNumber, desLineNumber, hazardTypes, srcCC, firstCheck) {
        // if instC/instB check or rd or memory written by instA is not also written by instB
        if (firstCheck || this.bcDependency !== this.acDependency) {
            // solve data hazard for data needed before EX
            if ((hazardTypes[0] || hazardTypes[1] || hazardTypes[2])) {
                this.solveHazardBetweenTwoLines(srcLineNumber, desLineNumber, srcCC, 1.5);
            }
            // solve data hazard for data needed before MEM
            if (hazardTypes[3] || hazardTypes[4]) {
                this.solveHazardBetweenTwoLines(srcLineNumber, desLineNumber, srcCC, 2.5);
            }
        }
    }

    /**
     * Solve data hazard with a forwarding line or a stall and a forwarding line
     * @param srcLineNumber - The source instruction line number
     * @param desLineNumber - The destination instruction line number
     * @param srcCC - The cc at which data is available
     * @param desCC - The cc at which data is needed
     */
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

    /**
     * Insert forwarding line: Three values in the 6th element of the instruction array
     * @param srcLineNumber - The source instruction line number
     * @param desLineNumber - The destination instruction line number
     * @param startCC - The cc at which data is available
     * @param endCC - The cc at which data is needed
     */
    insertForwardingLine(srcLineNumber, desLineNumber, startCC, endCC) {
        this.dataHazardFreeCode[srcLineNumber][5] = this.dataHazardFreeCode[srcLineNumber][5].concat([startCC, desLineNumber, endCC]);
    }

    /**
     * Insert stall in data-hazard-free code array.
     * Copy register and memory logs for the delayed clock cycles/
     * @param lineNumber
     */
    insertStall(lineNumber) {
        let assemblyLineNumber = this.dataHazardFreeCode[lineNumber][6];
        // insert stall in code array
        this.dataHazardFreeCode.splice(lineNumber,0,["Stall","","","",[false,""],[],assemblyLineNumber]);
        // increase line number for current destination instruction
        this.lineNumberC++;
        // set log clock cycles after "MEM" and "WB" stage of stall to previous clock cycle contents
        this.registerLog.splice(lineNumber+5,0,this.registerLog[lineNumber+4]);
        this.dataMemLog.splice(lineNumber+4,0,this.dataMemLog[lineNumber+3]);
    }
}

window.DataHazardSolver = DataHazardSolver;
// module.exports = DataHazardSolver;