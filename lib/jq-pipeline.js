var pipelineTable;

$(document).ready( function () {

    let tableContainer = $('.table-container');
    let placeHolder = $('.pipeline-placeholder');

    $('#pipeline-instructions-button').click(function () {
        if (beginPipelining) {
            placeHolder.remove();

            pipelineTable = new PipelineTable();

            setHazardFeedback(numberOfHazards);
            updateCurrentState(hazardousSet);
            fillPipelineTable();
            regMemTable.emptyRegisterMemoryTable();

        } else {
            let tableWrapper = $('.table-wrapper');
            tableWrapper.empty();
            tableWrapper.width('100%');
            tableWrapper.height('100%');
            tableContainer.append(placeHolder);
        }
    });
});

function setHazardFeedback(hazardCount) {
    let hazardFeedback = document.getElementById("number-of-hazards");
    hazardFeedback.textContent = hazardCount;
}

function updateCurrentState(codeSet) {
    codeInPipeline = codeSet[0];
    currentHighlightingList = codeSet[1];
}

function fillPipelineTable() {

    let tableWrapper = $('.table-wrapper');

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