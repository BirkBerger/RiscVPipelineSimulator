var pipelineTable;

$(document).ready( function () {

    let tableWrapper = $('.table-wrapper');

    $('#pipeline-instructions-button').click(function () {
        if (beginPipelining) {

            $('#solve-data-hazards').attr("checked",false);
            $('#solve-control-hazards').attr("checked",false);

            pipelineTable = new PipelineTable();

            codeInPipeline = hazardousSet[0];
            highlightingList = hazardousSet[1];
            currentDetection = hazardDetection;

            pipelineTable.setHTMLTable(codeInPipeline);

            tableWrapper.empty();

            let tableDim = pipelineTable.getTableDimensions();

            // put HTML table in wrapper
            tableWrapper.append(pipelineTable.htmlTable);

            tableWrapper.width(tableDim[0]);
            tableWrapper.height(tableDim[1]);

            $('#pipeline-table').DataTable();
        }
    });

});