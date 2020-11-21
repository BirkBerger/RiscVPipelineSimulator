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

    selfCheckControlSolver() {
        $('#solve-control-hazards').attr("checked", true);
        this.setCheckedColor(this.controlSpanName);
        this.solveControlHazards.disabled = true;
    }

    selfCheckDataSolver() {
        $('#solve-data-hazards').attr("checked", true);
        this.setCheckedColor(this.dataSpanName);
        this.solveDataHazards.disabled = true;

        this.enableControlSolver();
    }

    disableDataSolver() {
        $('#solve-data-hazards').attr("checked", false);
        this.setUncheckedDisableColor(this.dataSpanName);
        this.solveDataHazards.disabled = true;
    }

    disableControlSolver() {
        $('#solve-control-hazards').attr("checked", false);
        this.setUncheckedDisableColor(this.controlSpanName);
        this.solveControlHazards.disabled = true;
    }

    enableDataSolver() {
        $('#solve-data-hazards').attr("checked", false);
        this.setEnableColor(this.dataSpanName);
        this.solveDataHazards.disabled = false;
    }

    enableControlSolver() {
        this.solveControlHazards.disabled = false;
        this.setEnableColor(this.controlSpanName);
    }

    setUncheckedDisableColor(spanName) {
        var slider = document.getElementsByClassName(spanName);
        for(var i = 0; i < slider.length; i++)
            slider[i].style.backgroundColor = "#ccc";
    }

    setEnableColor(spanName) {
        var slider = document.getElementsByClassName(spanName);
        for(var i = 0; i < slider.length; i++)
            slider[i].style.backgroundColor = "#8ad6d6";
    }

    setCheckedColor(spanName) {
        var span = document.getElementsByClassName(spanName);
        for(var i = 0; i < span.length; i++)
            span[i].style.backgroundColor = "#5e9191";
    }
}

window.SolverSwitchVisuals = SolverSwitchVisuals;
// module.exports = SolverSwitchVisuals;