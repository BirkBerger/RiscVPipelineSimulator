$(document).ready( function () {

    $('#pipeline-instructions-button').click(function () {
        if (fillPipeline) {

            $('.table-wrapper').empty();

            let pipelineTable = new PipelineTable();
            let table = pipelineTable.getInitialPipelineHTML(parser.codeArray);

            $('.table-wrapper').append(table);

            $('#pipeline-table').DataTable( {
                "columnDefs": [
                    { "width": "10%", "targets": 0 }
                ]
            } );

            // $('.dataTables_length').addClass('bs-select');
        }
    });
});