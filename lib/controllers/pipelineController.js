var pipelineVisuals;

$(document).ready( function () {

    let tableContainer = $('.table-container');
    let placeHolder = $('.pipeline-placeholder');

    $('#pipeline-instructions-button').click(function () {
        if (beginPipelining) {
            placeHolder.remove();

            pipelineVisuals = new PipelineVisuals();

            setHazardFeedback(numberOfHazards);
            updateCurrentState(hazardousSet);
            pipelineVisuals.fillTable(codeInPipeline);
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