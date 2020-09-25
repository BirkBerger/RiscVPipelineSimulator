/**
 *
 */
class HazardSolver {

    constructor(cleanAssemblyCode) {
        this.numberOfHazards = 0;
        this.noHazardsAssemblyCode = cleanAssemblyCode;
    }

    detectAndSolveAllDataHazards() {
        let numberOfInstructions = this.noHazardsAssemblyCode.length;
        // iterate instructions bottom up
        for (var i = numberOfInstructions-1; i > 0; i--) {
            this.detectAndSolveHazardsBetweenLines(i,i-1,i-2);
        }
    }

    detectAndSolveHazardsBetweenLines(a, b, c) {
        let instA = this.noHazardsAssemblyCode[a];
        let instB = this.noHazardsAssemblyCode[b];
        let instC = this.noHazardsAssemblyCode[c];
        let srcCC = instB[0].charAt(0) === "l" && instB[0] !== "lui" ? 3.5 : 2.5;
        let hasHazardsTypesCB = this.detectDataHazardsBetweenLines(instB, instC);
        if (instB[4][0]) {
            this.instantiateDataHazardSolveBetweenLines(instB, instC, hasHazardsTypesCB, [false,false,false,false], srcCC);
        }
        if (typeof instA !== "undefined" && instA[4][0]) {
            let hasHazardsTypesAB = this.detectDataHazardsBetweenLines(instA, instB);
            this.instantiateDataHazardSolveBetweenLines(instA, instB, hasHazardsTypesAB, hasHazardsTypesCB, 3.5);
        }
    }

    detectDataHazardsBetweenLines(srcLine, desLine) {
        let rs1Match = desLine[1] === srcLine[2] && srcLine[0] !== "jal";
        let rs2Match = desLine[1] === srcLine[3] && srcLine[0].charAt(0) !== "b";
        let storeRdMatch = srcLine[0].charAt(0) === "s" && srcLine[0].length === 2 && srcLine[1] === desLine[1];
        let memRegMatch = typeof srcLine[4][1] === "string" && srcLine[4][1] === desLine[1];
        return [rs1Match,rs2Match,storeRdMatch,memRegMatch];
    }

    instantiateDataHazardSolveBetweenLines(srcLine, desLine, hazardTypes, hazardsCompare, srcCC) {
        if (hazardTypes[0] || hazardTypes[1] && !(hazardsCompare[0] || hazardsCompare[1])) {
            this.solveDataHazard(i-1, i, srcCC, 1.5);
            this.numberOfHazards += hazardTypes[0] && hazardTypes[1] ? 2 : 1;
        }
        if (hazardTypes[2] && !hazardsCompare[2]) {
            this.solveDataHazard(i-1, i, srcCC, 2.5);
            this.numberOfHazards++;
        }
        if (hazardTypes[3] && !hazardsCompare[3]) {
            this.solveDataHazard(i-1, i, srcCC, 3.5);
            this.numberOfHazards++;
        }
    }

    detectControlHazards(cleanAssemblyCode) {

    }

    solveDataHazard(srcLine, desLine, srcCC, desCC) {

    }

    // solveDataHazards(srcLine, desLine, memLoad) {
    //
    //     let instInterval = desLine - srcLine;
    //
    //      while (true) {
    //         let startCC = memLoad ? [srcLine + 3.5, srcLine + 4] : [srcLine + 2.5, srcLine + 3.5, 4];
    //         let endsCC = [desLine + 1.5, 1];
    //
    //         for (var i = 0; i < startCC.length; i++) {
    //             for (var j = 0; j < endsCC.length; j++) {
    //                 if (endsCC[j] <= startCC[i]) {
    //                     this.insertForwardingLine(srcLine, desLine, startCC[i], endsCC[j]);
    //                     return;
    //                 }
    //             }
    //         }
    //         this.insertStall(srcLine+1);
    //         desLine++;
    //     }
    // }

    solveControlHazards() {

    }

    insertForwardingLine(srcLine, desLine, startCC, endCC) {
        this.noHazardsAssemblyCode[srcLine] = this.noHazardsAssemblyCode[srcLine].concat([startCC, desLine, endCC]);
    }

    insertStall(lineNumber) {
        this.noHazardsAssemblyCode.splice(lineNumber,0,["---"]);
    }

}

// window.HazardSolver = HazardSolver;
module.exports = HazardSolver;