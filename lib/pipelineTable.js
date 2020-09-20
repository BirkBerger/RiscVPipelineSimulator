class PipelineTable {

    constructor() {}

    getInitialPipelineHTML(codeArray) {
        let initialPipelineArray = this.getInitialPipelineArray(codeArray.length);
        return this.getHTMLTableFromArray(initialPipelineArray);
    }

    getInitialPipelineArray(numberOfAssemblyLines) {
        let cols = 5+numberOfAssemblyLines-1;
        let pipelineArray = this.make2dimArray(numberOfAssemblyLines,cols);
        pipelineArray = this.setClockCycleRow(pipelineArray, cols)

        let pipelineStages = ["IF","ID","EX","MEM","WB"];

        for (var j = 1; j < numberOfAssemblyLines; j++) {
            var i = 0;
            for (var k = 0; k < cols; k++) {
                if (k >= (j-1) && k <= (j+4)) {
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
        for (var i = 0; i < rows; i++) {
            array[i] = new Array(cols);
        }
        return array;
    }

    setClockCycleRow(table, tableCols) {
        for (var i = 0; i < tableCols; i++) {
            table[0][i] = "CC " + (i+1);
        }
        return table;
    }

    getHTMLTableFromArray(array) {
        var table = $('<table />');

        var rows = [];
        var thead = rows.shift();
        thead = $('<thead />').append(thead);
        table.append(thead);

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
            table.append(row);
        }

        return table;
    }

}

window.PipelineTable = PipelineTable;