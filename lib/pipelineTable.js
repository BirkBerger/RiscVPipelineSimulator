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
        let cols = 5+numberOfAssemblyLines-1;
        // Get empty table
        let pipelineArray = this.getEmpty2DArray(numberOfAssemblyLines,cols*2);
        // Set table header with clock cycles
        pipelineArray = this.setClockCycleRow(pipelineArray, cols*2)

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

                if (makeHazardGraphics && i > 0 && this.hazardFreeCode[i-1][0] === "Stall") {
                    row.append($('<td><img style="display:block;" width="100%" height="100%" src="../images/bubble.jpg"/></td>'));
                    // row.append($('<td />').html("Stall"));
                }
                // create header cells
                else if (i === 0) {
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

    insertDataHazardGraphics(hazardFreeCode) {
        // // iterate assembly code
        // for (var i = 0; i < hazardFreeCode.length; i++) {
        //     console.log(hazardFreeCode[i][0]);
        //     // insert stall bubbles
        //     if (hazardFreeCode[i][0] === "Stall") {
        //         this.insertStall(i, hazardFreeCode.length);
        //     }
        // }
    }

    insertStall(lineNumber, numberOfCols) {
        // console.log(this.htmlTable);
        // for (var i = 0; i < numberOfCols; i++) {
        //     console.log(this.htmlTable.);
        //     this.htmlTable.rows[lineNumber+1].cells[i].innerHTML = "BUBBLE";
        // }
    }


}

window.PipelineTable = PipelineTable;
// module.exports = PipelineTable;