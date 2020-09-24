$(document).ready(function(){

    $('#pipeline-instructions-button').click(function () {
        if (correctAssemblyCode) {

            var hazardRemover = new HazardSolver(compiler.cleanAssemblyCode);
            hazardRemover.detectDataHazards();
            console.log(hazardRemover.toHazardsAssemblyCode);

            if (hazardRemover.numberOfHazards > 0) {
                $('.mode-buttons-wrapper').show();
            }

            $('#hazard-feedback').html("You have " + hazardRemover.numberOfHazards + " hazards");

            $('#solve-hazards-button').click(function () {
               alert("hey");
            });
        }
    });

});