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

/**
 * On reg/mem slider change:
 * Calls pipelineHeaderClicked() with the most recent clicked pipeline header cell
 */
function regMemSliderChanged() {
    pipelineHeaderClicked(lastTableCell);
}

/**
 * On "General Purpose Registers" text click:
 * Calls regMemSliderChanged()
 */
function regTitleClicked() {
    $('#reg-mem-slider').attr("checked",false);
    regMemSliderChanged();
}

/**
 * On "Data Memory" text click:
 * Calls regMemSliderChanged()
 */
function memTitleClicked() {
    $('#reg-mem-slider').attr("checked",true);
    regMemSliderChanged();
}

/**
 * On pipeline header cell click:
 * Fills reg/mem table content
 * @param tableCell
 */
function pipelineHeaderClicked(tableCell) {
    if (typeof tableCell !== "undefined") {
        // change cell color
        pipelineVisuals.highlightCcCell(tableCell);
        // fill reg/mem table content
        let slider = document.getElementById('reg-mem-slider');
        if (slider.checked) {
            regMemTable.showMemory(tableCell);
        } else {
            regMemTable.showRegisters(tableCell);
        }
    }
}

