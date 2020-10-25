// For testing
// const DataHazardSolver = require("/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/dataHazardSolver");

class HazardSolver {

    constructor(code, cleanToCrudeLineNumber) {
        this.code = [...code];
        this.controlHandlerPipelineOrder = [];
        this.pipelineOrder = [];
        this.highlightingList = [];
        this.cleanToCrudeLineNumber = cleanToCrudeLineNumber;
    }

    solveControlHazard(labelsByLineNumber) {
        let controlHazardHandler = new ControlHazardHandler(this.code);
        controlHazardHandler.solveAll(labelsByLineNumber);
        this.code = controlHazardHandler.controlHazardFreeCode;
        this.pipelineOrder = controlHazardHandler.pipelineOrder.slice();
        console.log("this.controlHandlerPipelineOrder 1");
        console.log(this.controlHandlerPipelineOrder);
        this.setHighlightingListSingleSolve(controlHazardHandler.pipelineOrder);
    }

    solveDataHazards() {
        let dataHazardHandler = new DataHazardHandler(this.code);
        dataHazardHandler.solveAll();
        this.code = dataHazardHandler.dataHazardFreeCode;
        this.pipelineOrder = dataHazardHandler.pipelineOrder.slice();
        this.setHighlightingListSingleSolve(dataHazardHandler.pipelineOrder);
    }

    getPipelineOrder() {
        return this.pipelineOrder;
    }

    setHighlightingListDoubleSolve(controlHandlerPipelineOrder) {
        console.log("this.controlHandlerPipelineOrder 2");
        console.log(controlHandlerPipelineOrder);
        let pipelineOrder = [];
        var k = 0;
        for (var i = 0; i < this.code.length; i++) {
            let elem = controlHandlerPipelineOrder[k][0];
            if (this.code[i][0] === "Stall") {
                pipelineOrder.push([elem,true]);
            } else {
                pipelineOrder.push([elem,true]);
                k++;
            }
        }
        this.setHighlightingListSingleSolve(pipelineOrder);
    }

    setHighlightingListSingleSolve(pipelineOrder) {
        console.log("pipelineOrder");
        console.log(pipelineOrder);
        this.highlightingList = new Array(this.code.length);
        for (var i = 0; i < pipelineOrder.length; i++) {
            let lineNumber = pipelineOrder[i][0];
            if (typeof this.highlightingList[lineNumber] === "undefined") {
                this.highlightingList[lineNumber] = [i];
            } else {
                this.highlightingList[lineNumber] = this.highlightingList[lineNumber].concat([i]);
            }
        }
    }

    // setHighlightingListSingleSolve(pipelineOrder) {
    //     console.log("pipelineOrder");
    //     console.log(pipelineOrder);
    //     this.highlightingList = new Array(this.code.length);
    //     for (var i = 0; i < pipelineOrder.length; i++) {
    //         let codeLine = pipelineOrder[i][0];
    //         let assemblyLine = this.cleanToCrudeLineNumber[codeLine];
    //         console.log("codeLine: " + codeLine);
    //         console.log("assemblyLine: " + assemblyLine);
    //         if (typeof this.highlightingList[assemblyLine] === "undefined") {
    //             this.highlightingList[assemblyLine] = [codeLine];
    //         } else {
    //             this.highlightingList[assemblyLine] = this.highlightingList[assemblyLine].concat([codeLine]);
    //         }
    //     }
    // }
}


window.HazardSolver = HazardSolver;
// module.exports = HazardSolver;