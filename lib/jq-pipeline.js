$(document).ready( function () {

    $('#pipeline-instructions-button').click(function () {
        if (noErrorAssemblyCode) {

            $('.table-wrapper').empty();

            let pipelineTable = new PipelineTable();
            let table = pipelineTable.getInitialPipelineHTML(parser.codeArray);

            $('.table-wrapper').append(table);

            $('#pipeline-table').DataTable();
        }
    });
});