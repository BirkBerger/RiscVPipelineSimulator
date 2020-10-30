var pipelineTable;

$(document).ready( function () {

    let tableContainer = $('.table-container');
    let placeHolder = $('.pipeline-placeholder');
    let tableWrapper = $('.table-wrapper');

    $('#pipeline-instructions-button').click(function () {
        if (beginPipelining) {
            placeHolder.remove();

            pipelineTable = new PipelineTable();

            codeInPipeline = hazardousSet[0];
            highlightingList = hazardousSet[1];

            let hazardFeedback = document.getElementById("number-of-hazards");
            hazardFeedback.textContent = numberOfHazards;

            pipelineTable.setHTMLTable(codeInPipeline);

            tableWrapper.empty();

            // put HTML table in wrapper
            tableWrapper.append(pipelineTable.htmlTable);

            let tableDim = pipelineTable.getTableDimensions();

            tableWrapper.width(tableDim[0]);
            tableWrapper.height(tableDim[1]);

        } else {
            tableWrapper.empty();
            tableWrapper.width('100%');
            tableWrapper.height('100%');
            tableContainer.append(placeHolder);
        }
    });

});