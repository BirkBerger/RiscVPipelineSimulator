/**
 *
 */
class HazardSolver {

    constructor(cleanAssemblyCode) {
        this.numberOfHazards = 0;
        this.toHazardsAssemblyCode = cleanAssemblyCode;
    }

    detectDataHazards() {
        // iterate instructions
        for (var i = 0; i < this.toHazardsAssemblyCode.length; i++) {
            let instruction = this.toHazardsAssemblyCode[i];
            let opcode = instruction[0];
            let rd = instruction[1];

            // if instruction stores something in rd
            if(instruction[4] === true && rd !== "x0") {

                // check the following 4 instructions
                for (var j = i+1; j < Math.min(i+5, this.toHazardsAssemblyCode.length); j++) {

                    let followingInstruction = this.toHazardsAssemblyCode[j];
                    let followOpcode = followingInstruction[0];

                    let rdReadFromRs1 = (followingInstruction[2] === rd && followOpcode !== "jal");
                    let rdReadFromRs2 = (followingInstruction[3] === rd && followOpcode.charAt(0) !== "b");

                    // if a following instruction reads what is to be stored in rd
                    if (rdReadFromRs1 || rdReadFromRs2) {

                        // increment number of hazards
                        this.numberOfHazards += (rdReadFromRs1 && rdReadFromRs2) ? 2 : 1;

                        // if what is to be stored in rd comes from memory
                        if (opcode.charAt(0) === "l" && opcode !== "lui") {
                            this.solveDataHazards(i, j, true);
                        } // if what is to be stored in rd comes from a register
                        else {
                            this.solveDataHazards(i, j, false);
                        }
                    }
                }
            }
        }
    }

    detectControlHazards(cleanAssemblyCode) {

    }

    solveDataHazards(srcLine, desLine, memLoad) {

         while (true) {
            let startCC = memLoad ? [srcLine + 3.5, srcLine + 4] : [srcLine + 2.5, srcLine + 3.5, 4];
            let endsCC = [desLine + 1.5, 1];

            for (var i = 0; i < startCC.length; i++) {
                for (var j = 0; j < endsCC.length; j++) {
                    if (endsCC[j] <= startCC[i]) {
                        this.insertForwardingLine(srcLine, desLine, startCC[i], endsCC[j]);
                        return;
                    }
                }
            }
            this.insertStall(srcLine+1);
            desLine++;
        }
    }

    solveControlHazards() {

    }

    insertForwardingLine(srcLine, desLine, startCC, endCC) {
        this.toHazardsAssemblyCode[srcLine] = this.toHazardsAssemblyCode[srcLine].concat([startCC, desLine, endCC]);
    }

    insertStall(lineNumber) {
        this.toHazardsAssemblyCode.splice(lineNumber,0,["---"]);
    }

}

window.HazardSolver = HazardSolver;