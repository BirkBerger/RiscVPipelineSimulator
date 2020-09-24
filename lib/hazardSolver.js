class HazardSolver {

    constructor(cleanAssemblyCode) {
        this.numberOfHazards = 0;
        this.cleanAssemblyCode = cleanAssemblyCode;
    }

    detectDataHazards() {
        // iterate instructions
        for (var i = 0; i < this.cleanAssemblyCode.length; i++) {
            let instruction = this.cleanAssemblyCode[i];
            let opcode = instruction[0];
            let rd = instruction[1];

            // if instruction stores something in rd
            if(instruction[4] === true && rd !== "x0") {

                // check the following 4 instructions
                for (var j = 0; j < 4; j++) {

                    let rdReadFromRs1 = (instruction[3] === rd && opcode.charAt(0) !== "b");
                    let rdReadFromRs2 = (instruction[3] === rd && opcode.charAt(0) !== "b");

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

        var dataHazardsSolved = false;
        while (dataHazardsSolved) {

            let startCC = memLoad ? [srcLine + 3.5, srcLine + 4] : [srcLine + 2.5, srcLine + 3.5, 4];
            let endsCC = [desLine + 1.5, 1];

                for (var i = 0; i < startCC.length; i++) {
                    for (var j = 0; j < endsCC.length; i++) {
                        if (endsCC[j] <= startCC[i]) {
                            this.insertForwardingLine(i, j, startCC[i], endsCC[j]);
                            dataHazardsSolved = true;
                        }
                    }
                }
                this.insertStall(srcLine+1);
                desLine++;
        }
    }

    solveControlHazards() {

    }

    insertForwardingLine(startLine, endLine, startCC, endCC) {
        this.cleanAssemblyCode[startLine] = this.cleanAssemblyCode[startLine].concat([startCC, endLine, endCC]);
    }

    insertStall(lineNumber) {
        this.cleanAssemblyCode.splice(lineNumber,0,["---"]);
    }

}

window.HazardSolver = HazardSolver;