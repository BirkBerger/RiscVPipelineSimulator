var lastTableCell;
var regMemTable;

$(document).ready(function(){

    regMemTable = new RegMemVisuals();

    $('#pipeline-instructions-button').click(function () {
        // reset register/memory slider
        $('#reg-mem-slider').attr("checked", false);
        regMemTable.emptyRegisterMemoryTable();
    });
});


function regMemSliderChanged() {
    pipelineHeaderClicked(lastTableCell);
}

function regTitleClicked() {
    $('#reg-mem-slider').attr("checked",false);
    regMemSliderChanged();
}

function memTitleClicked() {
    $('#reg-mem-slider').attr("checked",true);
    regMemSliderChanged();
}

function pipelineHeaderClicked(tableCell) {

    if (allHazardsAreSolved) {
        pipelineVisuals.highlightCcCell(tableCell);
        let slider = document.getElementById('reg-mem-slider');
        if (slider.checked) {
            regMemTable.showMemory(tableCell);
        } else {
            regMemTable.showRegisters(tableCell);
        }
    }
}

