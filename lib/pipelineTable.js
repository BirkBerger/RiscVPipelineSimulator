/**
 * Creates html pipeline table with or without hazard graphics.
 */
class PipelineTable {

    /**
     * Constructor.
     */
    constructor() {
        this.numberOfColumns = null;
        this.htmlTable = null;
        this.forwardingHTML = "";
        this.hazardFreeCode = [];
        this.ccColWidth = 40;
        this.inBetweenCcColWidth = 30;
        this.headerHeight = 50;
        this.rowHeight = 31;
        this.midRowHeight = 18.5;
    }

    setTableMeasures() {

    }

    /**
     * Creates HTML table from array of assembly code.
     * @param cleanCode - The input array of assembly code with or without hazard fixes.
     * @returns {*|jQuery.fn.init|jQuery|HTMLElement} - The resulting HTML table
     */
    setHTMLTable(cleanCode) {
        this.hazardFreeCode = [...cleanCode];
        let numberOfFilledColumns = (cleanCode.length+4) * 2;
        this.numberOfColumns = Math.max(numberOfFilledColumns,23);
        var tableHTML = $('<table id="pipeline-table">');
        let pipelineStages = ["IF","ID","EX","MEM","WB"];

        var rows = [];
        var ccCounter = 1;
        // iterate rows
        for (var j = -1; j < cleanCode.length; j = j + 1) {
            var row = $('<tr />');
            var i = 0;
            // iterate columns
            for (var k = 0; k < this.numberOfColumns; k++) {
                var cellHTML;
                // set header cells
                if (j === -1) {
                    let headerText = k%2 === 0 ? ("CC " + ccCounter) : "";
                    ccCounter = k%2 === 0 ? (ccCounter + 1) : ccCounter;
                    cellHTML = $('<th />').html(headerText);
                } // set pipeline stage cells
                else if (k < numberOfFilledColumns && !(cleanCode[j][0] === "" || cleanCode[j][0] === "Flush" || cleanCode[j][0] === "Stall") && k >= j*2 && k <= j*2+8) {
                    // clock cycle columns
                    if (k%2 === 0) {
                        cellHTML = $('<th class="stage-cell"/>').html(pipelineStages[i]);
                        i++;
                    } // in-between clock cycle columns
                    else {
                        cellHTML = $('<th class="stage-wire"/>').html("");
                        cellHTML.append($('<img width="100%" src="../images/stage-wire.png" alt="wire"/>'));
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
        this.htmlTable = tableHTML;
    }

    /**
     * Inserts bubbles, forwarding lines, and flushes directly to html pipeline table.
     */
    insertHazardSolutionGraphics() {
        this.forwardingHTML = "";
        // get table from base.html
        let tableFromBase = document.getElementById('pipeline-table');
        for (var i = 0; i < this.hazardFreeCode.length; i++) {
            // insert bubbles
            if (this.hazardFreeCode[i][0] === "Stall") {
                this.insertStallGraphics(i+1, tableFromBase);
            }
            // insert flush
            else if (this.hazardFreeCode[i][0] === "Flush") {
                this.insertFlushGraphics(i+1, tableFromBase);
            }
            // insert forwarding end points and set forwarding lines for forwardingHTML
            else if (this.hazardFreeCode[i][5].length > 0) {
                this.insertForwardingGraphics(i, tableFromBase);
            }
        }
        // add forwardingHTML to table
        $('#forwarding-lines').html(this.forwardingHTML);
    }

    insertFlushGraphics(rowNumber, tableFromBase) {
        let startCol = (rowNumber - 1) * 2;
        for (var j = startCol; j < startCol+10; j+=2) {
            tableFromBase.rows[rowNumber].cells[j].id = "flush-cell";
            tableFromBase.rows[rowNumber].cells[j].innerHTML = '<img width="100%" src="../images/wave_3.png" alt="flush">';
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
            tableFromBase.rows[rowNumber].cells[j].id = "stall-cell";
            tableFromBase.rows[rowNumber].cells[j].innerHTML = '<img width="103%" src="../images/bubble_small.png" alt="stall">';
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
        let pointImageHTML  = '<img width="100%" src="../images/wireForwardEndPoint.png" alt="endPoint">';

        // for each triple element in the forwarding array => draw a forwarding line
        for (var j = 0; j < srcForwardingArray.length; j+=3) {
            let srcRow = srcLineNumber + 1;
            let desRow = srcForwardingArray[j + 1] + 1;
            let srcCol = srcLineNumber * 2 + srcForwardingArray[j] * 2;
            let desCol = srcForwardingArray[j + 1] * 2 + srcForwardingArray[j + 2] * 2;
            // insert forwarding end point HTML at designated table cells
            tableFromBase.rows[srcRow].cells[srcCol].innerHTML = pointImageHTML;
            tableFromBase.rows[desRow].cells[desCol].innerHTML = pointImageHTML;
            // add lines between forwarding end points
            this.setForwardingLines(srcCol, desCol, srcRow, desRow);
        }
    }

    /**
     * Adds forwarding line html to the attribute "forwardingHTML".
     * When all lines have been added, "forwardingHTML" is added to the tableWrapper.
     * @param srcCol - The column with the forwarding source point.
     * @param desCol - The column with the forwarding destination point.
     * @param srcRow - The row with the forwarding source point.
     * @param desRow - The row with the forwarding destination point.
     */
    setForwardingLines(srcCol, desCol, srcRow, desRow) {
        let x1 = this.ccColWidth * (srcCol+1)/2 + this.inBetweenCcColWidth * srcCol/2;
        let y1 = this.headerHeight + (this.rowHeight*(srcRow-1)) + this.midRowHeight;
        let x2 = this.ccColWidth * (desCol+1)/2 + this.inBetweenCcColWidth * desCol/2;
        let y2 = this.headerHeight + (this.rowHeight*(desRow-1)) + this.midRowHeight;
        this.forwardingHTML += " <line x1=" + x1 + " y1=" + y1 + " x2=" + x2 + " y2=" + y2 + " stroke-width=" + 2 + "px stroke=\"#1F7FC2\"/>";
    }

    /**
     * Returns the total table width and height in pixels
     * @returns {number[]} - The table dimensions
     */
    getTableDimensions() {
        let numberOfRows = this.hazardFreeCode.length;
        let numberOfColumns = this.numberOfColumns - 1;
        let numberOfCC = Math.floor((numberOfColumns % 2) + (numberOfColumns/2));
        let numberOfBetween = numberOfColumns-numberOfCC;
        let width = (numberOfCC * this.ccColWidth) + (numberOfBetween * this.inBetweenCcColWidth);
        let height = this.headerHeight + (this.rowHeight * numberOfRows);

        return [width,height];
    }

    highlightPipelineRowsOnClick(highlightingList, rowClicked) {

        console.log("highlightingList: " + highlightingList);
        $('#pipeline-table tr').css('background', 'white');

        // highlight all table rows connected to clicked assembly code line
        for (var i = 0; i < highlightingList[rowClicked].length; i++) {
            let tableRow = highlightingList[rowClicked][i];
            let rowHTML = "#pipeline-table tr:nth-child(" + (tableRow+1) + ")";
            $(rowHTML).css('background', '#91D8DB');
        }
    }

    showHazardHighlighting(lineNumbersWithHazards) {

        $('#pipeline-table tr').css('background', 'white');

        for (var i = 0; i < lineNumbersWithHazards.length; i++) {
            let tableRow = lineNumbersWithHazards[i][0];
            let rowHTML = "#pipeline-table tr:nth-child(" + (tableRow+1) + ")";
            let color = lineNumbersWithHazards[i][1] === 'data' ? '#B5FFBA' : '#CCCCFF';
            $(rowHTML).css('background', color);
        }
    }


    // getHighlightingList(cleanCode, pipelineOrder) {
    //     let highlightingList = new Array(cleanCode.length);
    //     for (var i = 0; i < pipelineOrder.length; i++) {
    //         let lineNumber = pipelineOrder[i];
    //         if (typeof highlightingList[lineNumber] === "undefined") {
    //             highlightingList[lineNumber] = [i];
    //         } else {
    //             highlightingList[lineNumber] = highlightingList[lineNumber].concat([i]);
    //         }
    //     }
    //     return highlightingList;
    // }
}

window.PipelineTable = PipelineTable;
// module.exports = PipelineTable;