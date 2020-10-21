var codeInPipeline;

$(document).ready(function(){

    $('#show-hazards-button').click(function () {
        let hazardDetector = new HazardDetector(codeInPipeline);
        hazardDetector.detectHazards();
        pipelineTable.showHazardHighlighting(hazardDetector.lineNumbersWithHazards);
    });

});

function checkBoxClicked() {

    let solveDataHazards = document.getElementById('solve-data-hazards');
    let solveControlHazards = document.getElementById('solve-control-hazards');

    if (solveDataHazards.checked && solveControlHazards.checked)  {
        fillPipelineTable(hazardFreeSet);
    }

    if (!solveDataHazards.checked && solveControlHazards.checked)  {
        fillPipelineTable(controlHazardFreeSet);
    }

    if (solveDataHazards.checked && !solveControlHazards.checked)  {
        fillPipelineTable(dataHazardFreeSet);
    }

    if (!solveDataHazards.checked && !solveControlHazards.checked)  {
        fillPipelineTable(hazardousSet);
    }
}

function fillPipelineTable(set) {

    let tableWrapper = $('.table-wrapper');
    let pipelineTable = new PipelineTable();

    // clear pipeline
    tableWrapper.empty();

    // set current code and highlighting list
    codeInPipeline = set[0];
    highlightingList = set[1];

    console.log(codeInPipeline);

    // create HTML table
    pipelineTable.setHazardousHTMLTable(codeInPipeline);
    pipelineTable.insertHazardSolutionGraphics();

    // put HTML table in wrapper
    tableWrapper.append(pipelineTable.htmlTable);

    // set wrapper size to table size
    let tableDim = pipelineTable.getTableDimensions();
    tableWrapper.append($("<svg width=" + tableDim[0] + " height=" + tableDim[1] + " id=\"forwarding-lines\"> </svg>"));

    // make pipeline table a data table TODO: necessary?
    $('#pipeline-table').DataTable();
}

