var pipelineVisuals;

$(document).ready( function () {

    let tableContainer = $('.table-container');
    let placeHolder = $('.pipeline-placeholder');

    // set hazardous pipeline on "Pipeline instruction" button click
    $('#pipeline-instructions-button').click(function () {
        // if assembly code is error-free
        if (beginPipelining) {
            // clear pipeline table container
            placeHolder.remove();
            pipelineVisuals = new PipelineVisuals();

            // fill pipeline with hazardous code
            setHazardFeedback(numberOfHazards);
            updateCurrentState(hazardousSet);
            pipelineVisuals.fillTable(codeInPipeline);
            regMemTable.emptyRegisterMemoryTable();
        } else {
            // Put placeholder in table container
            let tableWrapper = $('.table-wrapper');
            tableWrapper.empty();
            tableWrapper.width('100%');
            tableWrapper.height('100%');
            tableContainer.append(placeHolder);
        }
    });
});

/**
 * Sets number of hazards displayed beneath the pipeline illustration
 * @param remainingHazards
 */
function setHazardFeedback(remainingHazards) {
    let hazardFeedback = document.getElementById("number-of-hazards");
    hazardFeedback.textContent = remainingHazards;
}

/**
 * Updates current code array, highlight list and logs
 * @param codeSet
 */
function updateCurrentState(codeSet) {
    codeInPipeline = codeSet[0];
    currentHighlightingList = codeSet[1];
    currentRegisterLog = codeSet[2];
    currentMemLog = codeSet[3];
}