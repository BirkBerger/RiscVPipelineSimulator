/**
 * Creates pipeline table with 5 stages for each instruction from the assembly editor.
 * Converts the table to HTML.
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
        let pipelineArray = this.getPipelineArray(codeArray);
        this.htmlTable = this.getHTMLTableFromArray(pipelineArray, false);
    }

    setHazardFreePipelineHTML(hazardFreeCodeArray) {
        this.hazardFreeCode = hazardFreeCodeArray;
        let pipelineArray = this.getPipelineArray(hazardFreeCodeArray);
        this.htmlTable = this.getHTMLTableFromArray(pipelineArray, true);
        // this.insertDataHazardGraphics(hazardFreeCodeArray);
    }

    /**
     * Creates pipeline table with 5 stages for each instruction from the assembly editor.
     * Does not consider data hazards.
     * @param numberOfAssemblyLines
     * @returns {*|*[]} - Pipeline table as a 2-dimensional array.
     */
    getPipelineArray(codeArray) {
        let numberOfAssemblyLines = codeArray.length;
        let cols = (4+numberOfAssemblyLines) * 2;
        // Get empty table
        let pipelineArray = this.getEmpty2DArray(numberOfAssemblyLines,cols);
        // Set table header with clock cycles
        pipelineArray = this.setClockCycleRow(pipelineArray, cols)

        let pipelineStages = ["IF","ID","EX","MEM","WB"];

        // iterate table rows
        for (var j = 1; j <= numberOfAssemblyLines; j++) {

            var i = 0;
            // iterate table columns (skip non-cc columns)
            for (var k = 0; k < cols*2; k++) {
                // if the columns are within the instruction's cc-interval
                if (k%2 === 0 && k >= (j-1)*2 && k <= ((j-1)*2+8)) {
                    // Add pipeline stage to cell
                    pipelineArray[j][k] = pipelineStages[i];
                    i++;
                } else {
                    pipelineArray[j][k] = "";
                }
            }
        }
        return pipelineArray;
    }


    /**
     * Gets empty 2-dimensional array
     * @param rows - Number of rows
     * @param cols - Number of columns
     * @returns {any[]} - The empty 2-dimensional array
     */
    getEmpty2DArray(rows, cols) {
        var array = new Array(rows);
        for (var i = 0; i < rows+1; i++) {
            array[i] = new Array(cols);
        }
        return array;
    }

    /**
     * Adds clock cycle strings to the first row of the input table.
     * @param table - The input table to be altered.
     * @returns {*}
     */
    setClockCycleRow(table) {
        var j = 1;
        for (var i = 0; i < table[0].length; i += 2) {
            table[0][i] = "CC " + j;
            table[0][i+1] = "";
            j++;
        }
        return table;
    }

    /**
     * TODO: write some "got this code from blablabla"
     * Creates HTML table from array.
     * @param array - The input array
     * @returns {*|jQuery.fn.init|jQuery|HTMLElement} - The resulting HTML table
     */
    getHTMLTableFromArray(array, makeHazardGraphics) {
        // set table HTML tag
        var table = $('<table id="pipeline-table" class="display table-striped hover table-bordered table-sm">');

        // create HTML rows from array
        var rows = [];
        for (var i = 0; i < array.length; i = i + 1) {
            var row = $('<tr />');
            for (var j = 0; j < array[i].length; j = j + 1) {
                if (i === 0) {
                    row.append($('<th />').html(array[i][j]));
                } // create body cells
                else {
                    row.append($('<td />').html(array[i][j]));
                }
            }
            rows.push(row);
        }

        // add table header
        var thead = rows.shift();
        thead = $('<thead />').append(thead);
        table.append(thead);

        // add table rows
        for (i = 0; i < rows.length; i = i + 1) {
            table.append(rows[i]);
        }

        // end table
        table.append($('</table>'))

        return table;
    }

    insertDataHazardGraphics() {
        var tableFromBase = document.getElementById('pipeline-table');
        for (var i = 0; i < this.hazardFreeCode.length; i++) {
            if (this.hazardFreeCode[i][0] === "Stall") {
                this.insertStallGraphics(i+1, tableFromBase)
            }
            else if (this.hazardFreeCode[i][5] !== []) {
                this.insertForwardingGraphics(i, tableFromBase);
            }
        }
    }

    insertStallGraphics(rowNumber, tableFromBase) {
        for (var j = 0; j < (4 + this.hazardFreeCode.length) * 2; j+=2) {
            tableFromBase.rows[rowNumber].cells[j].innerHTML = '<img  width="100%" src="images/bubble.png" alt="stall">';
        }
    }

    insertForwardingGraphics(srcLineNumber, tableFromBase) {
        let srcForwardingArray = this.hazardFreeCode[srcLineNumber][5];
        console.log("[5] array: " + srcForwardingArray[5]);
        let endPointHTML = '<span class="forwarding-line-end-point"></span>';
        for (var j = 0; j < srcForwardingArray.length; j+=3) {
            let srcRowNumber = srcLineNumber + 1;
            let desRowNumber = srcForwardingArray[j+1] + 1;
            let startCol = srcLineNumber * 2 + srcForwardingArray[j] * 2;
            let endCol = srcForwardingArray[j+1] * 2 + srcForwardingArray[j+2] * 2;
            console.log("startCol: " + startCol + ", desRowNumber: " + desRowNumber + ", endCol: " + endCol);
            tableFromBase.rows[srcRowNumber].cells[startCol].innerHTML = endPointHTML;
            tableFromBase.rows[desRowNumber].cells[endCol].innerHTML = endPointHTML;
        }
    }


}

window.PipelineTable = PipelineTable;
// module.exports = PipelineTable;