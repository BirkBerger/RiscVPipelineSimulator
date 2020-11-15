// For testing
const DataHazardHandler = require("../../lib/model/dataHazardHandler");
const ControlHazardHandler = require("../../lib/model/controlHazardHandler");


class HazardHandler {

    constructor(code) {
        this.code = [...code];
        this.highlightList = [];
        this.numberOfHazards = 0;
        this.registerLog = [];
        this.dataMemLog = [];
    }

    detectAndSolveControlHazard(labelsByLineNumber) {
        let controlHazardHandler = new ControlHazardHandler(this.code);
        controlHazardHandler.detectAll();
        this.numberOfHazards = controlHazardHandler.numberOfHazards;
        controlHazardHandler.solveAll(labelsByLineNumber);
        this.code = controlHazardHandler.controlHazardFreeCode;
        this.setHighlightList(controlHazardHandler.highlightOrder);
        this.registerLog = controlHazardHandler.registerLog;
        this.dataMemLog = controlHazardHandler.dataMemLog;
    }

    detectAndSolveDataHazards(registerLog, memLog) {
        let dataHazardHandler = new DataHazardHandler(this.code, registerLog, memLog);
        dataHazardHandler.detectAndSolveAll();
        this.numberOfHazards = dataHazardHandler.numberOfHazards;
        this.code = dataHazardHandler.dataHazardFreeCode;
        this.registerLog = dataHazardHandler.registerLog;
        this.dataMemLog = dataHazardHandler.dataMemLog;
        this.setHighlightList(dataHazardHandler.highlightOrder);
    }

    setHighlightList(highlightingOrder) {
        this.highlightList = new Array(this.code.length);
        for (var i = 0; i < highlightingOrder.length; i++) {
            let lineNumber = highlightingOrder[i];
            if (typeof this.highlightList[lineNumber] === "undefined") {
                this.highlightList[lineNumber] = [i];
            } else {
                this.highlightList[lineNumber] = this.highlightList[lineNumber].concat([i]);
            }
        }
    }
}


// window.HazardHandler = HazardHandler;
module.exports = HazardHandler;