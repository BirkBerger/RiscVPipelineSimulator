/**
 * Creates html pipeline table with or without hazard graphics.
 */
class PipelineTable {

    /**
     * Constructor.
     */
    constructor() {
        this.htmlTable = null;
        this.hazardFreeCode = null;
    }

    /**
     *
     * @param codeArray
     * @returns {*|jQuery.fn.init|jQuery|HTMLElement}
     */
    setHazardousPipelineHTML(codeArray) {
        // let pipelineArray = this.getPipelineArray(codeArray);
        this.htmlTable = this.getHTMLTableFromArray(codeArray);
    }

    setHazardFreePipelineHTML(hazardFreeCodeArray) {
        this.hazardFreeCode = hazardFreeCodeArray;
        // let pipelineArray = this.getPipelineArray(hazardFreeCodeArray);
        this.htmlTable = this.getHTMLTableFromArray(hazardFreeCodeArray);
        // this.insertDataHazardGraphics(hazardFreeCodeArray);
    }

    /**
     * Creates HTML table from array of assembly code.
     * @param codeArray - The input array of assembly code with or without hazard fixes.
     * @returns {*|jQuery.fn.init|jQuery|HTMLElement} - The resulting HTML table
     */
    getHTMLTableFromArray(codeArray) {

        let numberOfColumns = (codeArray.length+4) * 2;
        var tableHTML = $('<table id="pipeline-table" class=" hover table-sm">');
        let pipelineStages = ["IF","ID","EX","MEM","WB"];

        // create HTML rows from array
        var rows = [];
        for (var j = -1; j < codeArray.length; j = j + 1) {
            var row = $('<tr />');
            var i = 0;
            for (var k = 0; k < numberOfColumns; k++) {
                var cellHTML;
                // set header cells
                if (j === -1) {
                    let headerText = k%2 === 0 ? "CC " + (k+1) : "";
                    cellHTML = $('<th />').html(headerText);
                } // set pipeline stage cells
                else if ((typeof codeArray[j] === "string" || codeArray[j][0] !== "Stall") && k >= j*2 && k <= j*2+8) {
                    // clock cycle columns
                    if (k%2 === 0) {
                        cellHTML = $('<th id="stage-cell"/>').html(pipelineStages[i]);
                        i++;
                    } // in-between clock cycle columns
                    else {
                        cellHTML = $('<th id="stage-wire"/>').html("");
                        cellHTML.append($('<img width="100%" src="images/stage-wire.png" alt="wire"/>'));
                    }
                } // set empty body cells
                else {
                    cellHTML = $('<th />').html("");
                } row.append(cellHTML);
            } rows.push(row);
        }

        // add table header
        var thead = rows.shift();
        thead = $('<thead />').append(thead);
        tableHTML.append(thead);

        // add table rows
        for (j = 0; j < rows.length; j = j + 1) {
            tableHTML.append(rows[j]);
        }

        // end table
        tableHTML.append($('</table>'))

        return tableHTML;
    }

    /**
     * Inserts bubbles and forwarding lines directly to html pipeline table.
     */
    insertDataHazardGraphics() {
        // get table from base.html
        var tableFromBase = document.getElementById('pipeline-table');
        for (var i = 0; i < this.hazardFreeCode.length; i++) {
            // insert bubbles
            if (this.hazardFreeCode[i][0] === "Stall") {
                this.insertStallGraphics(i+1, tableFromBase)
            }
            // insert forwarding lines
            else if (this.hazardFreeCode[i][5] !== []) {
                this.insertForwardingGraphics(i, tableFromBase);
            }
        }
    }

    /**
     * Inserts stall bubbles in the input table.
     * @param rowNumber - The row number of the pipeline table where the bubbles should be.
     * @param tableFromBase - The html pipeline table.
     */
    insertStallGraphics(rowNumber, tableFromBase) {
        let startCol = (rowNumber - 1) * 2;
        for (var j = startCol; j < startCol+10; j+=2) {
            tableFromBase.rows[rowNumber].cells[j].innerHTML = '<img width="100%" src="images/bubble.png" alt="stall">';
        }
    }

    /**
     * Inserts forwarding lines in the input table.
     * @param srcLineNumber - The instruction line number at which the forwarding line should start.
     * @param tableFromBase - The html pipeline table.
     */
    insertForwardingGraphics(srcLineNumber, tableFromBase) {
        // get forwarding array of the instruction
        let srcForwardingArray = this.hazardFreeCode[srcLineNumber][5];
        let endPointHTML  = '<img width="100%" src="images/wireForwardEndPoint.png" alt="endPoint">';

        // for each triple element in the forwarding array => draw a forwarding line
        for (var j = 0; j < srcForwardingArray.length; j+=3) {
            let srcRowNumber = srcLineNumber + 1;
            let desRowNumber = srcForwardingArray[j+1] + 1;
            let startCol = srcLineNumber * 2 + srcForwardingArray[j] * 2;
            let endCol = srcForwardingArray[j+1] * 2 + srcForwardingArray[j+2] * 2;
            // insert forwarding end point HTML at designated table cells
            tableFromBase.rows[srcRowNumber].cells[startCol].innerHTML = endPointHTML;
            tableFromBase.rows[desRowNumber].cells[endCol].innerHTML = endPointHTML;
        }
    }


}

window.PipelineTable = PipelineTable;
// module.exports = PipelineTable;