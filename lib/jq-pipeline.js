$(document).ready( function () {

    $('#pipeline-instructions-button').click(function () {
        if (noErrorAssemblyCode) {

            $('.table-wrapper').empty();

            pipelineTable = new PipelineTable();
            pipelineTable.setHazardFreePipelineHTML(interpreter.interpretedCode);

            $('.table-wrapper').append(pipelineTable.htmlTable);

            $('#pipeline-table').DataTable();
        }
    });


    editor.on("gutterClick", function(cm, n) {
        if (noErrorAssemblyCode) {

            $('#pipeline-table tr').css('background', 'white');

            // highlight all table rows connected to clicked assembly code line
            let highlightingList = interpreter.highlightingList;
            for (var i = 0; i < highlightingList[n].length; i++) {
                let tableRow = highlightingList[n][i];
                let rowHTML = "#pipeline-table tr:nth-child(" + (tableRow+1) + ")";
                $(rowHTML).css('background', '#7cb8bb');
            }
        }
    });
});