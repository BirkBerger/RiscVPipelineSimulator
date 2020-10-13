$(document).ready( function () {

    $('#pipeline-instructions-button').click(function () {
        if (noErrorAssemblyCode) {

            $('.table-wrapper').empty();

            pipelineTable = new PipelineTable();
            pipelineTable.setHazardousPipelineHTML(parser.codeArray);

            $('.table-wrapper').append(pipelineTable.htmlTable);

            $('#pipeline-table').DataTable();
        }
    });
});