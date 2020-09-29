$(document).ready(function(){

    $('#pipeline-instructions-button').click(function () {
        if (noErrorAssemblyCode) {

            var hazardSolver = new HazardSolver(compiler.cleanAssemblyCode);
            hazardSolver.solveAllHazards();
            console.log(hazardSolver.noHazardsAssemblyCode);

            if (hazardSolver.numberOfHazards > 0) {
                $('.mode-buttons-wrapper').show();
            }

            $('#hazard-feedback').html("You have " + hazardSolver.numberOfHazards + " hazards");

            $('#solve-hazards-button').click(function () {
               alert("hey");
            });
        }
    });

});