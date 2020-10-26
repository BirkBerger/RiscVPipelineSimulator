var codeInPipeline;

$(document).ready(function(){

    $('#show-hazards-button').click(function () {
        // let hazardDetector = new HazardDetector(codeInPipeline);
        // hazardDetector.detectHazards();
        // pipelineTable.showHazardHighlighting(hazardDetector.lineNumbersWithHazards);
        pipelineTable.showHazards(currentDetection[1]);


    });

    $('#solve-data-hazards').attr("checked",false);
    $('#solve-control-hazards').attr("checked",false);

});

function checkBoxClicked() {
    let solveDataHazards = document.getElementById('solve-data-hazards');
    let solveControlHazards = document.getElementById('solve-control-hazards');

    if (solveDataHazards.checked && solveControlHazards.checked)  {
        fillPipelineTable(hazardFreeSet,true);
    }

    if (!solveDataHazards.checked && solveControlHazards.checked)  {
        fillPipelineTable(controlHazardFreeSet,true, dataHazardDetection);
    }

    if (solveDataHazards.checked && !solveControlHazards.checked)  {
        // alert("here");
        fillPipelineTable(dataHazardFreeSet,true, controlHazardDetection);
    }

    if (!solveDataHazards.checked && !solveControlHazards.checked)  {
        fillPipelineTable(hazardousSet, false, hazardDetection);
    }
}

function fillPipelineTable(codeSet, includeGraphics, detectionSet) {

    let tableWrapper = $('.table-wrapper');

    // set current code and highlighting list
    codeInPipeline = codeSet[0];
    highlightingList = codeSet[1];
    currentDetection = detectionSet;

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

