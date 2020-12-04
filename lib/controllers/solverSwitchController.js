var codeInPipeline;
var solverSwitches;

$(document).ready(function(){

    // deactivate switches
    solverSwitches = new SolverSwitchVisuals();
    solverSwitches.resetSolvers();

    // initialize solve switches on "Pipeline instruction" button click
    $('#pipeline-instructions-button').click(function () {
        // if assembly input is hazard-free
        if (beginPipelining) {
            // activate both switches
            if (numberOfHazards > 0) {
                solverSwitches.enableDataSolver();
                solverSwitches.enableControlSolver()
            }
            // deactivate data switch
            if (numberOfDataHazards === 0) {
                solverSwitches.selfCheckDataSolver()
            }
            // deactivate control switch
            if (numberOfControlHazards === 0) {
                solverSwitches.selfCheckControlSolver();
            }
        } else {
            // deactivate both switches
            solverSwitches = new SolverSwitchVisuals();
            solverSwitches.resetSolvers();
        }
    });

});

/**
 * On hazard switch change:
 * Fills pipeline and reg/mem table according to the switch states
 */
function solverSwitched() {

    let solveDataHazards = document.getElementById('solve-data-hazards');
    let solveControlHazards = document.getElementById('solve-control-hazards');

    // set hazardous set
    if (!solveDataHazards.checked && !solveControlHazards.checked) {
        setHazardFeedback(numberOfHazards);
        updateCurrentState(hazardousSet);
        solverSwitches.solversUnchecked();
    }

    // set control-hazard-free set
    else if (!solveDataHazards.checked && solveControlHazards.checked) {
        setHazardFeedback(numberOfDataHazards);
        updateCurrentState(controlHazardFreeSet);
        solverSwitches.controlSolverChecked();
    }

    // set data-hazard-free set
    else if (solveDataHazards.checked && !solveControlHazards.checked) {
        setHazardFeedback(numberOfControlHazards);
        updateCurrentState(dataHazardFreeSet);
        solverSwitches.dataSolverChecked();
    }

    // set hazard-free set
    else if (solveDataHazards.checked && solveControlHazards.checked) {
        setHazardFeedback(0);
        updateCurrentState(hazardFreeSet);
        solverSwitches.solversChecked();
    }

    // fill pipeline table
    pipelineVisuals.fillTable(codeInPipeline);
    // fill reg/mem table
    pipelineHeaderClicked(lastTableCell);
}

