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


// hello
function solverSwitched() {
    let solveDataHazards = document.getElementById('solve-data-hazards');
    let solveControlHazards = document.getElementById('solve-control-hazards');

    if (solveDataHazards.checked && solveControlHazards.checked)  {
        fillPipelineTable(hazardFreeSet,true, 0);
        allHazardsAreSolved = true;
    }

    if (!solveDataHazards.checked && solveControlHazards.checked)  {
        fillPipelineTable(controlHazardFreeSet,true, numberOfDataHazardAfterControlSolve);
        resetRegisterMemory();
    }

    if (solveDataHazards.checked && !solveControlHazards.checked)  {
        // alert("here");
        fillPipelineTable(dataHazardFreeSet,true, numberOfControlHazards);
        resetRegisterMemory();
    }

    if (!solveDataHazards.checked && !solveControlHazards.checked)  {
        fillPipelineTable(hazardousSet, false, numberOfHazards);
        resetRegisterMemory();
    }
}

function fillPipelineTable(codeSet, includeGraphics, hazardCount) {

    let tableWrapper = $('.table-wrapper');

    // set current code and highlighting list
    codeInPipeline = codeSet[0];
    currentHighlightingList = codeSet[1];

    // update number of hazards
    let hazardFeedback = document.getElementById("number-of-hazards");
    hazardFeedback.textContent = hazardCount;

    // create HTML table
    pipelineTable.setHTMLTable(codeInPipeline);

    // clear pipeline
    tableWrapper.empty();

    tableWrapper.append(pipelineTable.htmlTable);

    let tableDim = pipelineTable.getTableDimensions();

    tableWrapper.width(tableDim[0]);
    tableWrapper.height(tableDim[1]);


    tableWrapper.append($("<svg width=" + tableDim[0] + "px" + " height=" + tableDim[1] + "px" + " id=\"forwarding-lines\"> </svg>"));
    // insert hazard solution graphics
    pipelineTable.insertHazardSolutionGraphics();


}

