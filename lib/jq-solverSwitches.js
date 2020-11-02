var codeInPipeline;
var allHazardsAreSolved;

$(document).ready(function(){

    allHazardsAreSolved = false;

    // reset solver check-boxes upon pipelining
    $('#pipeline-instructions-button').click(function () {
        $('#solve-data-hazards').attr("checked",false);
        $('#solve-control-hazards').attr("checked",false);
    });

});


function solverSwitched() {
    let solveDataHazards = document.getElementById('solve-data-hazards');
    let solveControlHazards = document.getElementById('solve-control-hazards');

    if (solveDataHazards.checked && solveControlHazards.checked)  {
        setHazardFeedback(0);
        updateCurrentState(hazardFreeSet);
        fillPipelineTable();
        allHazardsAreSolved = true;
    }

    if (!solveDataHazards.checked && solveControlHazards.checked)  {
        setHazardFeedback(numberOfDataHazardAfterControlSolve);
        updateCurrentState(controlHazardFreeSet);
        fillPipelineTable();
        regMemTable.emptyRegisterMemoryTable();
    }

    if (solveDataHazards.checked && !solveControlHazards.checked)  {
        setHazardFeedback(numberOfControlHazards);
        updateCurrentState(dataHazardFreeSet);
        fillPipelineTable();
        regMemTable.emptyRegisterMemoryTable();
    }

    if (!solveDataHazards.checked && !solveControlHazards.checked)  {
        setHazardFeedback(numberOfHazards);
        updateCurrentState(hazardousSet);
        fillPipelineTable();
        regMemTable.emptyRegisterMemoryTable();
    }
}



