var codeInPipeline;
var solverSwitches;

$(document).ready(function(){

    solverSwitches = new SolverSwitchVisuals();
    solverSwitches.resetSolvers();

    $('#pipeline-instructions-button').click(function () {
        if (beginPipelining) {
            if (numberOfHazards > 0) {
                solverSwitches.enableDataSolver();
                solverSwitches.enableControlSolver()
            }
            if (numberOfDataHazards === 0) {
                solverSwitches.selfCheckDataSolver()
            }
            if (numberOfControlHazards === 0) {
                solverSwitches.selfCheckControlSolver();
            }
        } else {
            solverSwitches = new SolverSwitchVisuals();
            solverSwitches.resetSolvers();
        }
    });

});



function solverSwitched() {

    let solveDataHazards = document.getElementById('solve-data-hazards');
    let solveControlHazards = document.getElementById('solve-control-hazards');

    if (!solveDataHazards.checked && !solveControlHazards.checked) {
        setHazardFeedback(numberOfHazards);
        updateCurrentState(hazardousSet);
        solverSwitches.solversUnchecked();
    }

    // solve control hazards alone
    else if (!solveDataHazards.checked && solveControlHazards.checked) {
        setHazardFeedback(numberOfDataHazards);
        updateCurrentState(controlHazardFreeSet);
        solverSwitches.controlSolverChecked();
    }

    // solve data hazards alone
    else if (solveDataHazards.checked && !solveControlHazards.checked) {
        setHazardFeedback(numberOfControlHazards);
        updateCurrentState(dataHazardFreeSet);
        solverSwitches.dataSolverChecked();
    }

    // solve all hazards
    else if (solveDataHazards.checked && solveControlHazards.checked) {
        setHazardFeedback(0);
        updateCurrentState(hazardFreeSet);
        solverSwitches.solversChecked();
    }

    pipelineVisuals.fillTable(codeInPipeline);
    pipelineHeaderClicked(lastTableCell);
}

