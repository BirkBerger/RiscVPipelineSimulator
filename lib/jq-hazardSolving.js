$(document).ready(function(){

    $('#pipeline-instructions-button').click(function () {
        if (correctAssemblyCode) {

            var hazardRemover = new HazardSolver(compiler.cleanAssemblyCode);
            hazardRemover.detectDataHazards();
            console.log(hazardRemover.cleanAssemblyCode);

            if (hazardRemover.numberOfHazards > 0) {
                // $('.mode-slider').hide(2000);
            } else {
                $('.mode-slider').show(3000);
            }
        }
    });

});