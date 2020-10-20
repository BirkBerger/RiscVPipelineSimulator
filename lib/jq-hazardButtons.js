$(document).ready(function(){

    let pipelineWrapper = $('.table-wrapper');

    $('#show-hazards-button').click(function () {
        let hazardDetector = new HazardDetector(code);
        hazardDetector.detectHazards();

        $('#pipeline-table tr').css('background', 'white');

        for (var i = 0; i < hazardDetector.lineNumbersWithHazards.length; i++) {
            let tableRow = hazardDetector.lineNumbersWithHazards[i][0];
            let rowHTML = "#pipeline-table tr:nth-child(" + (tableRow+1) + ")";
            let color = hazardDetector.lineNumbersWithHazards[i][1] === 'data' ? '#B5FFBA' : '#CCCCFF';
            $(rowHTML).css('background', color);
        }
        console.log(code);
    });

    $('#solve-data-hazards').click(function () {
        pipelineWrapper.empty();

        let hazardSolver = new HazardSolver(code);
        hazardSolver.solveDataHazards();
        code = hazardSolver.code;
        highlightingList = hazardSolver.highlightingList;

        pipelineTable = new PipelineTable();
        pipelineTable.setHazardFreePipelineHTML(code);
        pipelineWrapper.append(pipelineTable.htmlTable);

        let tableDim = pipelineTable.getTableDimensions();
        pipelineWrapper.append($("<svg width=" + tableDim[0] + " height=" + tableDim[1] + " id=\"forwarding-lines\"> </svg>"));

        pipelineTable.insertHazardGraphics();

        $('#pipeline-table').DataTable();
        console.log(code);
    });

    $('#solve-control-hazards').click(function () {
        pipelineWrapper.empty();

        let hazardSolver = new HazardSolver(code);
        hazardSolver.solveControlHazard();
        code = hazardSolver.code;
        highlightingList = hazardSolver.highlightingList;

        pipelineTable = new PipelineTable();
        pipelineTable.setHazardFreePipelineHTML(code);
        pipelineWrapper.append(pipelineTable.htmlTable);

        let tableDim = pipelineTable.getTableDimensions();
        pipelineWrapper.append($("<svg width=" + tableDim[0] + " height=" + tableDim[1] + " id=\"forwarding-lines\"> </svg>"));

        pipelineTable.insertHazardGraphics();

        $('#pipeline-table').DataTable();
        console.log(code);
    });




        // var hazardSolver = new HazardSolver(cleaner.cleanCode);
        // hazardSolver.detectAllHazards();
        //
        // if (hazardSolver.numberOfHazards > 0) {
        //     $('.mode-buttons-wrapper').show();
        // }
        //
        // $('#hazard-feedback').html("You have " + hazardSolver.numberOfHazards + " hazards");
        //
        //
        // $('#solve-hazards-button').click(function () {
        //     $('#hazard-feedback').html("You have 0 hazards");
        //     hazardSolver.solveAllHazards();
        //     console.log(hazardSolver.hazardFreeCode);
        //
        //     $('.table-wrapper').empty();
        //
        //     pipelineTable.setHazardFreePipelineHTML(hazardSolver.hazardFreeCode);
        //     $('.table-wrapper').append(pipelineTable.htmlTable);
        //
        //     let tableDim = pipelineTable.getTableDimensions();
        //     $('.table-wrapper').append($("<svg width=" + tableDim[0] + " height=" + tableDim[1] + " id=\"forwarding-lines\"> </svg>"));
        //
        //     pipelineTable.insertDataHazardGraphics();
        //
        //     $('#pipeline-table').DataTable();
        //
        // });

});

