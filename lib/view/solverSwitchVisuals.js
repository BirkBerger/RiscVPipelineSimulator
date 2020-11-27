/**
 * Modifies the look of data and control hazard solver switches.
 */
class SolverSwitchVisuals {

    constructor() {
        this.solveDataHazards = document.getElementById('solve-data-hazards');
        this.solveControlHazards = document.getElementById('solve-control-hazards');
        this.controlSpanName = 'slider round control';
        this.dataSpanName = 'slider round data';
    }

    /**
     * Disable switches and make gray
     */
    resetSolvers() {
        this.disableDataSolver();
        this.disableControlSolver();
    }

    /**
     * Check control solver switch, disable and make gray
     */
    selfCheckControlSolver() {
        $('#solve-control-hazards').attr("checked", true);
        this.setDisableColor(this.controlSpanName);
        this.solveControlHazards.disabled = true;
    }

    /**
     * Check data solver switch, disable and make gray
     */
    selfCheckDataSolver() {
        $('#solve-data-hazards').attr("checked", true);
        this.setDisableColor(this.dataSpanName);
        this.solveDataHazards.disabled = true;
        this.enableControlSolver();
    }

    /**
     * Disable data hazard solver, uncheck and make gray
     */
    disableDataSolver() {
        $('#solve-data-hazards').attr("checked", false);
        this.setDisableColor(this.dataSpanName);
        this.solveDataHazards.disabled = true;
    }

    /**
     * Disable control hazard solver, uncheck and make gray
     */
    disableControlSolver() {
        $('#solve-control-hazards').attr("checked", false);
        this.setDisableColor(this.controlSpanName);
        this.solveControlHazards.disabled = true;
    }

    /**
     * Enable data hazard solver, uncheck and make light blue
     */
    enableDataSolver() {
        $('#solve-data-hazards').attr("checked", false);
        this.setEnableColor(this.dataSpanName);
        this.solveDataHazards.disabled = false;
    }

    /**
     * Enable control hazard solver and make light blue
     */
    enableControlSolver() {
        this.solveControlHazards.disabled = false;
        this.setEnableColor(this.controlSpanName);
    }

    /**
     * Set switch color to gray
     * @param spanName - Switch span name
     */
    setDisableColor(spanName) {
        var slider = document.getElementsByClassName(spanName);
        for(var i = 0; i < slider.length; i++)
            slider[i].style.backgroundColor = "#ccc";
    }

    /**
     * Set switch color to light blue
     * @param spanName - Switch span name
     */
    setEnableColor(spanName) {
        var slider = document.getElementsByClassName(spanName);
        for(var i = 0; i < slider.length; i++)
            slider[i].style.backgroundColor = "#9db5b5";
    }

    /**
     * Set switch color to dark blue
     * @param spanName - Switch span name
     */
    setCheckedColor(spanName) {
        var span = document.getElementsByClassName(spanName);
        for(var i = 0; i < span.length; i++)
            span[i].style.backgroundColor = "#5e9191";
    }
}

// window.SolverSwitchVisuals = SolverSwitchVisuals;
module.exports = SolverSwitchVisuals;