class HazardDetector {

    constructor(code) {
        this.code = [...code];
        this.numberOfHazards = 0;
        this.lineNumbersWithHazards = [];
    }

    detectHazards() {
        let controlHazardHandler = new ControlHazardHandler(this.code);
        controlHazardHandler.detectAll(this.code);
        let dataHazardHandler  = new DataHazardHandler(this.code);
        dataHazardHandler.detectAll();

        this.numberOfHazards = controlHazardHandler.numberOfHazards + dataHazardHandler.numberOfHazards;
        this.lineNumbersWithHazards = dataHazardHandler.lineNumbersWithHazards.concat(controlHazardHandler.lineNumbersWithHazards);
    }



}

window.HazardDetector = HazardDetector;
// module.exports = HazardDetector;