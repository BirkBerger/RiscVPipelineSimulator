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
                // console.log(hazardSolver.hazardFreeCode);
                $('.table-wrapper').append(pipelineTable.htmlTable);
                pipelineTable.insertDataHazardGraphics();

                $('#pipeline-table').DataTable();




                // var table = document.getElementById("pipeline-table");
                // var row = table.insertRow(3);
                // var bubbleCell = row.insertCell(0);
                // var bubbleCell = row.insertCell(1);
                // var bubbleCell = row.insertCell(2);
                // bubbleCell.innerHTML = "NEW CELL";
            });
        }
    });

});