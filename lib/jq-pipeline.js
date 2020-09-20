$(document).ready( function () {
    // $('#pipeline-table').DataTable( {
    //     // paging: false,
    //     // scrollY: 400
    // });

    // code = editor.getValue();

    $('#pipeline-instructions-button').click(function () {
        if (fillPipeline) {

            let pipelineTable = new PipelineTable();
            let table = pipelineTable.getInitialPipelineHTML(parser.codeArray);

            alert("hello");
            $('body').append(table);
        }
    });
} );