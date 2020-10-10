$(document).ready(function(){


    $('#pipeline-instructions-button').click(function () {
        if (noErrorAssemblyCode) {

            var hazardSolver = new HazardSolver(compiler.cleanAssemblyCode);
            hazardSolver.detectAllHazards();

            if (hazardSolver.numberOfHazards > 0) {
                $('.mode-buttons-wrapper').show();
            }

            $('#hazard-feedback').html("You have " + hazardSolver.numberOfHazards + " hazards");



            $('#solve-hazards-button').click(function () {
                $('#hazard-feedback').html("You have 0 hazards");
                hazardSolver.solveAllHazards();
                console.log(hazardSolver.hazardFreeCode);

                $('.table-wrapper').empty();

                pipelineTable.setHazardFreePipelineHTML(hazardSolver.hazardFreeCode);
                $('.table-wrapper').append(pipelineTable.htmlTable);


                let tableDim = pipelineTable.getTableDimensions();
                console.log(tableDim);


                $('.table-wrapper').append($("<svg width=" + tableDim[0] + " height=" + tableDim[1] + " id=\"forwarding-lines\"> </svg>"));
                // $('.table-wrapper').append($('<svg width="2016" height="765px" id="forwarding-lines"> </svg>'));


                pipelineTable.insertDataHazardGraphics();


                $('#pipeline-table').DataTable();

            });
        }
    });

});