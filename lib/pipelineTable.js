/**
 * Creates pipeline table with 5 stages for each instruction from the assembly editor.
 * Converts the table to HTML.
 */
class PipelineTable {

    /**
     * Constructor.
     */
    constructor() {}

    /**
     *
     * @param codeArray
     * @returns {*|jQuery.fn.init|jQuery|HTMLElement}
     */
    getInitialPipelineHTML(codeArray) {
        let initialPipelineArray = this.getInitialPipelineArray(codeArray.length);
        return this.getHTMLTableFromArray(initialPipelineArray);
    }

    /**
     * Creates pipeline table with 5 stages for each instruction from the assembly editor.
     * Does not consider data hazards.
     * @param numberOfAssemblyLines
     * @returns {*|*[]} - Pipeline table as a 2-dimensional array.
     */
    getInitialPipelineArray(numberOfAssemblyLines) {
        let cols = 5+numberOfAssemblyLines-1;
        // Get empty table
        let pipelineArray = this.getEmpty2DArray(numberOfAssemblyLines,cols*2);
        // Set table header with clock cycles
        pipelineArray = this.setClockCycleRow(pipelineArray, cols*2)

        let pipelineStages = ["IF","ID","EX","MEM","WB"];

        // iterate table rows
        for (var j = 1; j <= numberOfAssemblyLines; j++) {
            var i = 0;
            // iterate table columns
            for (var k = 0; k < cols*2; k++) {
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
    getHTMLTableFromArray(array) {
        // set table HTML tag
        var table = $('<table id="pipeline-table" class="display table-striped hover table-bordered table-sm">');

        // create HTML rows from array
        var rows = [];
        for (var i = 0; i < array.length; i = i + 1) {
            var row = $('<tr />');
            for (var j = 0; j < array[i].length; j = j + 1) {
                if (i === 0) {
                    row.append($('<th />').html(array[i][j]));
                } else {
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

}

// window.PipelineTable = PipelineTable;
module.exports = PipelineTable;