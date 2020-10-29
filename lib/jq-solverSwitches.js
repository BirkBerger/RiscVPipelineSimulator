var codeInPipeline;

$(document).ready(function(){

    $('#solve-data-hazards').attr("checked",false);
    $('#solve-control-hazards').attr("checked",false);

});

function solverSwitched() {
    let solveDataHazards = document.getElementById('solve-data-hazards');
    let solveControlHazards = document.getElementById('solve-control-hazards');

    if (solveDataHazards.checked && solveControlHazards.checked)  {
        fillPipelineTable(hazardFreeSet,true, 0);
    }

    if (!solveDataHazards.checked && solveControlHazards.checked)  {
        fillPipelineTable(controlHazardFreeSet,true, numberOfDataHazardAfterControlSolve);
    }

    if (solveDataHazards.checked && !solveControlHazards.checked)  {
        // alert("here");
        fillPipelineTable(dataHazardFreeSet,true, numberOfControlHazards);
    }

    if (!solveDataHazards.checked && !solveControlHazards.checked)  {
        fillPipelineTable(hazardousSet, false, numberOfHazards);
    }
}

function fillPipelineTable(codeSet, includeGraphics, hazardCount) {

    let tableWrapper = $('.table-wrapper');

    // set current code and highlighting list
    codeInPipeline = codeSet[0];
    highlightingList = codeSet[1];

    $('#hazard-feedback').val(hazardCount);

    // create HTML table
    pipelineTable.setHTMLTable(codeInPipeline);

    // clear pipeline
    tableWrapper.empty();

    // set wrapper size to table size
    let tableDim = pipelineTable.getTableDimensions();

    // put HTML table in wrapper
    tableWrapper.append(pipelineTable.htmlTable);

    tableWrapper.width(tableDim[0]);
    tableWrapper.height(tableDim[1]);

    if (includeGraphics) { // TODO: necessary? I think the hazardous array can be put in the include graphics method now
        tableWrapper.append($("<svg width=" + tableDim[0] + "px" + " height=" + tableDim[1] + "px" + " id=\"forwarding-lines\"> </svg>"));
        // insert hazard solution graphics
        pipelineTable.insertHazardSolutionGraphics();
    }

    // make pipeline table a data table TODO: necessary?
    $('#pipeline-table').DataTable();
}

