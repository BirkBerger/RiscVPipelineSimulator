class SolverSwitchVisuals {

    constructor() {
        this.solveDataHazards = document.getElementById('solve-data-hazards');
        this.solveControlHazards = document.getElementById('solve-control-hazards');
        this.controlSpanName = 'slider round control';
        this.dataSpanName = 'slider round data';
    }

    resetSolvers() {
        this.disableDataSolver();
        this.disableControlSolver();
    }

    enableDataSolver() {
        $('#solve-data-hazards').attr("checked", false);
        this.setSliderEnableColor(this.dataSpanName);
        this.solveDataHazards.disabled = false;
    }

    selfCheckControlSolver(solveControlHazards) {
        $('#solve-control-hazards').attr("checked", true);
        this.setSliderCheckedColor(this.controlSpanName);
        solveControlHazards.disabled = true;
    }

    selfCheckDataSolver() {
        $('#solve-data-hazards').attr("checked", true);
        this.setSliderCheckedColor(this.dataSpanName);
        this.solveDataHazards.disabled = true;

        this.enableControlSolver();
    }

    disableDataSolver() {
        $('#solve-data-hazards').attr("checked", false);
        this.setSliderDisableColor(this.dataSpanName);
        this.solveDataHazards.disabled = true;
    }

    disableControlSolver() {
        $('#solve-control-hazards').attr("checked", false);
        this.setSliderDisableColor(this.controlSpanName);
        this.solveControlHazards.disabled = true;
    }

    enableControlSolver() {
        this.solveControlHazards.disabled = false;
        this.setSliderEnableColor(this.controlSpanName);
    }

    setSliderDisableColor(spanName) {
        var slider = document.getElementsByClassName(spanName);
        for(var i = 0; i < slider.length; i++)
            slider[i].style.backgroundColor = "#ccc";
    }

    setSliderEnableColor(spanName) {
        var slider = document.getElementsByClassName(spanName);
        for(var i = 0; i < slider.length; i++)
            slider[i].style.backgroundColor = "#8ad6d6";
    }

    setSliderCheckedColor(spanName) {
        var span = document.getElementsByClassName(spanName);
        for(var i = 0; i < span.length; i++)
            span[i].style.backgroundColor = "#5e9191";
    }
}

window.SolverSwitchVisuals = SolverSwitchVisuals;
// module.exports = SolverSwitchVisuals;