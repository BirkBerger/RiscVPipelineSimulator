var codeInPipeline;
var allHazardsAreSolved;

$(document).ready(function(){

    allHazardsAreSolved = false;
    hideControlSolver();

    // reset solver check-boxes upon pipelining
    $('#pipeline-instructions-button').click(function () {
        $('#solve-data-hazards').attr("checked",false);
        hideControlSolver();
    });

});

function hideControlSolver() {
    $('#solve-control-hazards').attr("checked",false);
    $('.solve-control-hazards-container').hide();
}

function solverSwitched() {
    let solveDataHazards = document.getElementById('solve-data-hazards');
    let solveControlHazards = document.getElementById('solve-control-hazards');

    if (!solveDataHazards.checked)  {
        setHazardFeedback(numberOfHazards);
        updateCurrentState(hazardousSet);
        regMemTable.emptyRegisterMemoryTable();
        hideControlSolver();
    }

    if (solveDataHazards.checked) {
        setHazardFeedback(numberOfControlHazards);
        updateCurrentState(dataHazardFreeSet);
        regMemTable.emptyRegisterMemoryTable();
        $('.solve-control-hazards-container').show();
    }

    if (solveControlHazards.checked)  {
        setHazardFeedback(0);
        updateCurrentState(hazardFreeSet);
        allHazardsAreSolved = true;
    }

    pipelineVisuals.fillTable(codeInPipeline);
}