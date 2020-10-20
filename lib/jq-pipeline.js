var pipelineTable;
var highlightingList;

$(document).ready( function () {

    let tableWrapper = $('.table-wrapper');

    $('#pipeline-instructions-button').click(function () {
        if (codeCleaned) {
            tableWrapper.empty();

            pipelineTable = new PipelineTable();
            pipelineTable.setHazardFreePipelineHTML(code);
            highlightingList = [];
            for (var i = 0; i < code.length; i++) {
                highlightingList[i] = i;
            }

            tableWrapper.append(pipelineTable.htmlTable);

            $('#pipeline-table').DataTable();
        }
    });

});