var codeInPipeline;
var allHazardsAreSolved;
var solverSwitches;

$(document).ready(function(){

    solverSwitches = new SolverSwitchVisuals();
    allHazardsAreSolved = false;
    solverSwitches.resetSolvers();

    $('#pipeline-instructions-button').click(function () {
        if (beginPipelining) {
            if (numberOfHazards > 0) {
                solverSwitches.enableDataSolver();
                solverSwitches.disableControlSolver()
            }
            if (numberOfDataHazards === 0) {
                solverSwitches.selfCheckDataSolver()
            }
            if (numberOfControlHazards === 0) {
                solverSwitches.selfCheckControlSolver();
            }
        } else {
            solverSwitches = new SolverSwitchVisuals();
            allHazardsAreSolved = false;
            solverSwitches.resetSolvers();
        }
    });

});



function solverSwitched() {

    let solveDataHazards = document.getElementById('solve-data-hazards');
    let solveControlHazards = document.getElementById('solve-control-hazards');

    if (!solveDataHazards.checked)  {
        setHazardFeedback(numberOfHazards);
        updateCurrentState(hazardousSet);
        regMemTable.emptyRegisterMemoryTable();

        solverSwitches.setEnableColor('slider round data');
        if (numberOfControlHazards !== 0) {
            solverSwitches.disableControlSolver(solveControlHazards);
        }
    }

    if (solveDataHazards.checked && !solveDataHazards.disabled ||
    !solveControlHazards.checked && solveDataHazards.disabled) {
        setHazardFeedback(numberOfControlHazards);
        updateCurrentState(dataHazardFreeSet);
        regMemTable.emptyRegisterMemoryTable();

        solverSwitches.setCheckedColor('slider round data');
        if (numberOfControlHazards !== 0) {
            solverSwitches.enableControlSolver(solveControlHazards);
        }
    }

    if (solveControlHazards.checked && !solveControlHazards.disabled)  {
        setHazardFeedback(0);
        updateCurrentState(hazardFreeSet);

        solverSwitches.setCheckedColor('slider round control')
    }

    pipelineVisuals.fillTable(codeInPipeline);
}

