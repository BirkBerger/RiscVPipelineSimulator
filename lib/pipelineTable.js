class PipelineTable {

    constructor() {}

    getInitialPipelineHTML(codeArray) {
        let initialPipelineArray = this.getInitialPipelineArray(codeArray.length);
        return this.getHTMLTableFromArray(initialPipelineArray);
    }

    getInitialPipelineArray(numberOfAssemblyLines) {
        let cols = 5+numberOfAssemblyLines-1;
        let pipelineArray = this.make2dimArray(numberOfAssemblyLines,cols*2);
        pipelineArray = this.setClockCycleRow(pipelineArray, cols*2)

        let pipelineStages = ["IF","ID","EX","MEM","WB"];

        // iterate table rows
        for (var j = 1; j <= numberOfAssemblyLines; j++) {
            var i = 0;
            // iterate table columns
            for (var k = 0; k < cols*2; k++) {
                if (k%2 === 0 && k >= (j-1)*2 && k <= ((j-1)*2+8)) {
                    pipelineArray[j][k] = pipelineStages[i];
                    i++;
                } else {
                    pipelineArray[j][k] = "";
                }
            }
        }
        return pipelineArray;
    }

    make2dimArray(rows, cols) {
        var array = new Array(rows);
        for (var i = 0; i < rows+1; i++) {
            array[i] = new Array(cols*2);
        }
        return array;
    }

    setClockCycleRow(table, tableCols) {
        var j = 1;
        for (var i = 0; i < tableCols; i += 2) {
            table[0][i] = "CC " + j;
            table[0][i+1] = "";
            j++;
        }
        return table;
    }
    // class="cell-border dt-center nowrap hover"
    // class="table table-striped table-bordered nowrap hover"
    getHTMLTableFromArray(array) {
        var table = $('<table id="pipeline-table" class="display table-striped hover table-bordered table-sm">');

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

        var thead = rows.shift();
        thead = $('<thead />').append(thead);
        table.append(thead);

        for (i = 0; i < rows.length; i = i + 1) {
            table.append(rows[i]);
        }
        table.append($('</table>'))

        console.log(table);
        return table;
    }

}

window.PipelineTable = PipelineTable;