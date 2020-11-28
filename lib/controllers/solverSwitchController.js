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
            allHazardsAreSolved = false;
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
        solverSwitches.setEnableColor('slider round data');
        solverSwitches.setEnableColor('slider round control');
    }


    // solve control hazards alone
    else if (!solveDataHazards.checked && solveControlHazards.checked) {
        setHazardFeedback(numberOfDataHazards);
        updateCurrentState(controlHazardFreeSet);
        solverSwitches.setEnableColor('slider round data');
        solverSwitches.setCheckedColor('slider round control')
    }

    // solve data hazards alone
    else if (solveDataHazards.checked && !solveControlHazards.checked) {
        setHazardFeedback(numberOfControlHazards);
        updateCurrentState(dataHazardFreeSet);
        solverSwitches.setEnableColor('slider round control');
        solverSwitches.setCheckedColor('slider round data');
    }

    // solve all hazards
    else if (solveDataHazards.checked && solveControlHazards.checked) {
        setHazardFeedback(0);
        updateCurrentState(hazardFreeSet);
        solverSwitches.setCheckedColor('slider round data');
        solverSwitches.setCheckedColor('slider round control');
    }

    // if (!solveDataHazards.checked)  {
    //     setHazardFeedback(numberOfHazards);
    //     updateCurrentState(hazardousSet);
    //     regMemTable.emptyRegisterMemoryTable();
    //
    //     solverSwitches.setEnableColor('slider round data');
    //     if (numberOfControlHazards !== 0) {
    //         solverSwitches.disableControlSolver(solveControlHazards);
    //     }
    // }
    //
    // if (solveDataHazards.checked && !solveDataHazards.disabled ||
    // !solveControlHazards.checked && solveDataHazards.disabled) {
    //     setHazardFeedback(numberOfControlHazards);
    //     updateCurrentState(dataHazardFreeSet);
    //     regMemTable.emptyRegisterMemoryTable();
    //
    //     solverSwitches.setCheckedColor('slider round data');
    //     if (numberOfControlHazards !== 0) {
    //         solverSwitches.enableControlSolver(solveControlHazards);
    //     }
    // }
    //
    // if (solveControlHazards.checked && !solveControlHazards.disabled)  {
    //     setHazardFeedback(0);
    //     updateCurrentState(hazardFreeSet);
    //
    //     solverSwitches.setCheckedColor('slider round control')
    // }

    pipelineVisuals.fillTable(codeInPipeline);
}

