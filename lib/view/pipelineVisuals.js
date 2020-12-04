/**
 * Creates html pipeline table with or without hazard graphics.
 */
class PipelineVisuals {
    
    constructor() {
        this.numberOfColumns = null;
        this.htmlTable = null;
        this.forwardingHTML = "";
        this.hazardFreeCode = [];
        this.borderSpacing = 8;
        this.ccColWidth = 40;
        this.inBetweenCcColWidth = 30;
        this.headerHeight = 40 + (2 * this.borderSpacing);
        this.rowHeight = 23 + this.borderSpacing;
        this.halfRowHeight = (this.rowHeight-this.borderSpacing)/2.0;
    }

    /**
     * Creates HTML table from array of assembly code.
     * @param cleanCode - The input array of assembly code with or without hazard fixes.
     * @returns {*|jQuery.fn.init|jQuery|HTMLElement} - The resulting HTML table
     */
    setHTMLTable(cleanCode) {
        this.hazardFreeCode = [...cleanCode];
        let numberOfFilledColumns = (cleanCode.length+4) * 2 + 2;
        this.numberOfColumns = Math.max(numberOfFilledColumns,20);
        var tableHTML = $('<table id="pipeline-table">');
        let pipelineStages = ["IF","ID","EX","MEM","WB"];

        var rows = [];
        var ccCounter = 1;
        // iterate rows
        for (var j = -1; j < cleanCode.length; j++) {
            var row = $('<tr />');
            var i = 0;
            // iterate columns
            for (var k = 0; k < this.numberOfColumns; k++) {
                var cellHTML;
                // set header cells
                if (j === -1) {
                    let headerText = k%2 === 0 ? ("CC " + ccCounter) : "";
                    ccCounter = k%2 === 0 ? (ccCounter + 1) : ccCounter;
                    cellHTML = k%2 === 0 ? $('<th onclick="pipelineHeaderClicked(this)" />').html(headerText) : $('<th />').html(headerText);
                } // set pipeline stage cells
                else if ((k < numberOfFilledColumns) && (k >= j*2 && k <= j*2+8) && !(cleanCode[j][0] === "")) {
                    // clock cycle columns
                    if (k%2 === 0) {
                        cellHTML = $('<th class="stage-cell"/>').html(pipelineStages[i]);
                        i++;
                    } // in-between clock cycle columns
                    else {
                        cellHTML = $('<th class="stage-wire"/>').html("");
                        cellHTML.append($('<img width="100%" src="images/wire_light_gray.png" alt="wire"/>'));
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
        // get table from index.html
        let tableFromBase = document.getElementById('pipeline-table');
        var previousFlush = false;

        for (var i = 0; i < this.hazardFreeCode.length; i++) {
            // insert bubbles
            if (this.hazardFreeCode[i][0] === "Stall") {
                this.insertStallGraphics(i+1, tableFromBase);
                previousFlush = false;
            }
            // insert flush
            else if (this.hazardFreeCode[i][0] === "Flush") {
                this.insertFlushGraphics(i+1, tableFromBase, previousFlush);
                previousFlush = true;
            }
            // insert forwarding end points and set forwarding lines for forwardingHTML
            else if (this.hazardFreeCode[i][5].length > 0) {
                this.insertForwardingGraphics(i, tableFromBase);
                previousFlush = false;
            }
        }
        // add forwardingHTML to table
        $('#forwarding-lines').html(this.forwardingHTML);
    }

    insertFlushGraphics(rowNumber, tableFromBase, previousFlush) {
        let startCol = (rowNumber - 1) * 2 + (previousFlush ? 1 : 3);
        let endCol = startCol + (previousFlush ? 8 : 6);
        for (var j = startCol; j < endCol; j++) {
            if (j % 2 === 0) {
                tableFromBase.rows[rowNumber].cells[j].id = "flush-cell";
                tableFromBase.rows[rowNumber].cells[j].innerHTML = '<img width="100%" src="images/wave.png" alt="flush">';
            } else {
                tableFromBase.rows[rowNumber].cells[j].innerHTML = '';
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
        for (var j = startCol+3; j < startCol+10; j++) {
            if (j % 2 === 0) {
                tableFromBase.rows[rowNumber].cells[j].id = "stall-cell";
                tableFromBase.rows[rowNumber].cells[j].innerHTML = '<img width="100%" src="images/bubble_small.png" alt="stall">';
            } else {
                tableFromBase.rows[rowNumber].cells[j].innerHTML = '';
            }
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
        let pointImageHTML  = '<img width="100%" src="images/wireForwardEndPoint.png" alt="endPoint">';

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
        let x1 = this.ccColWidth * (srcCol+1)/2 + this.inBetweenCcColWidth * srcCol/2.0;
        let y1 = this.headerHeight + (this.rowHeight*(srcRow-1)) + this.halfRowHeight;
        let x2 = this.ccColWidth * (desCol+1)/2 + this.inBetweenCcColWidth * desCol/2.0;
        let y2 = this.headerHeight + (this.rowHeight*(desRow-1)) + this.halfRowHeight;
        this.forwardingHTML += " <line x1=" + x1 + " y1=" + y1 + " x2=" + x2 + " y2=" + y2 + " stroke-width=" + 2 + "px stroke=\"#1F7FC2\"/>";
    }

    /**
     * Returns the total table width and height in pixels
     * @returns {number[]} - The table dimensions
     */
    getTableDimensions() {
        let numberOfRows = this.hazardFreeCode.length;
        let numberOfColumns = this.numberOfColumns;
        let numberOfCC = Math.floor((numberOfColumns % 2) + (numberOfColumns/2));
        let numberOfBetween = numberOfColumns-numberOfCC;
        let width = (numberOfCC * this.ccColWidth) + (numberOfBetween * this.inBetweenCcColWidth);
        let height = this.headerHeight + (this.rowHeight * numberOfRows);

        return [width,height];
    }

    /**
     * Change color of table row depending on editor gutter click
     * @param highlightingList - The list mapping assembly lines to pipeline rows
     * @param rowClicked - The assembly line number clicked
     */
    highlightPipelineRowsOnClick(highlightingList, rowClicked) {
        // reset all row colors to white
        $('#pipeline-table tr').css('background', 'white');

        if (typeof highlightingList[rowClicked] !== "undefined") {
            // highlight all table rows connected to clicked assembly code line
            for (var i = 0; i < highlightingList[rowClicked].length; i++) {
                let tableRow = highlightingList[rowClicked][i];
                let rowHTML = "#pipeline-table tr:nth-child(" + (tableRow + 1) + ")";
                $(rowHTML).css('background', '#deeaea');
            }
        }
    }

    /**
     * Change color of cc cell depending on clock cycle clicked
     * @param tableCell
     */
    highlightCcCell(tableCell) {
        // reset all header cells to white
        $('#pipeline-table thead th').css('background', 'white');

        // highlight clicked cell
        let cellHTML = tableCell.innerHTML;
        let cc = parseInt(cellHTML.substring(2, cellHTML.length)) - 1;
        let rowHTML = "#pipeline-table thead tr th:nth-child(" + (cc * 2 + 1) + ")";
        $(rowHTML).css('background', '#E6E6E6');
    }

    /**
     * Create html pipeline table from code array and put it in table wrapper
     * @param code
     */
    fillTable(code) {

        let tableWrapper = $('.table-wrapper');

        // create HTML table
        this.setHTMLTable(code);

        // clear and fill wrapper
        tableWrapper.empty();
        tableWrapper.append(this.htmlTable);

        // fit table wrapper to table dimensions
        let tableDim = this.getTableDimensions();
        tableWrapper.width(tableDim[0]);
        tableWrapper.height(tableDim[1]);

        // add forwarding line graphics to wrapper
        tableWrapper.append($("<svg width=" + tableDim[0] + "px" + " height=" + tableDim[1] + "px" + " id=\"forwarding-lines\"> </svg>"));
        this.insertHazardSolutionGraphics();
    }


}

window.PipelineVisuals = PipelineVisuals;
// module.exports = PipelineVisuals;