/**
 * Empties and fill register/memory table.
 */
class RegMemVisuals {

    /**
     * Empty register/memory table and show placeholder
     */
    emptyRegisterMemoryTable() {
        // clear register/memory table
        $("#register-memory-table > tbody").empty();
        // set register/memory placeholder
        $('.register-memory-placeholder').css('display','block');
        $('.register-memory-placeholder').text("Solve all hazards and click on a clock cycle in the pipeline to see the RISC-V general purpose registers and relevant data memory contents at this time");
        lastTableCell = undefined;
    }

    /**
     * Get cc value from header cell clicked
     * @param tableCell - Cell text (for example "CC 32")
     * @returns {number} - CC represented by clicked cell (for example 32)
     */
    getCC(tableCell) {
        let cellHTML = tableCell.innerHTML;
        let cc = parseInt(cellHTML.substring(2, cellHTML.length)) - 1;
        lastTableCell = tableCell;
        return cc;
    }

    /**
     * Show registers in register/memory table
     * @param tableCell
     */
    showRegisters(tableCell) {
        // empty table and remove placeholder
        var table = document.getElementById("register-memory-table");
        $("#register-memory-table > tbody").empty();
        $('.register-memory-placeholder').css('display','none');

        // get registers at clicked cc
        let cc = this.getCC(tableCell)
        let registers = currentRegisterLog[cc]

        // fill register table
        for (var i = 0; i < registers.length; i++) {
            let regContent = Number(registers[i]);
            var regRow = table.insertRow(i);
            var regName = regRow.insertCell(0);
            var regValue = regRow.insertCell(1);
            regName.innerHTML = "x" + i;
            regName.id = "reg-name-cell";
            regValue.innerHTML = regContent.toString();
        }
    }

    /**
     * Show memory bytes in regiser/memory table
     * @param tableCell
     */
    showMemory(tableCell) {
        // empty table and remove placeholder
        var table = document.getElementById("register-memory-table");
        $("#register-memory-table > tbody").empty();
        $('.register-memory-placeholder').css('display','none');

        // get memory at cc clicked
        let cc = this.getCC(tableCell)
        let memMap = currentMemLog[cc];
        let memAddress = null;

        console.log("memMap");
        console.log(memMap);


        // convert memMap to sorted array
        const memArray = this.sortByAddress(Array.from(memMap).map(([address, value]) => ({address, value})));
        var rowNumber = 0;

        console.log("memArray");
        console.log(memArray);

        for (var j = memArray.length-4; j >= 0; j -= 4) {

            // if there is a gab between memory addresses => insert connecting table row
            if (memAddress !== null && memAddress > memArray[j].address+7) {
                this.insertConnectingRow(table, rowNumber);
                rowNumber++;
            }

            // create row
            var memRow = table.insertRow(rowNumber);
            rowNumber++;

            // create address cell
            var memAddressCell = memRow.insertCell(0);

            memAddressCell.innerHTML = this.formatMemAddress(memArray[j].address);
            memAddressCell.id = "mem-address-cell";

            // create value cells (4 per address)
            for (var k = 0; k < 4; k++) {
                memAddress = memArray[j + k].address;
                let memValue = memArray[j + k].value;
                var memValueCell = memRow.insertCell(1 + k);
                memValueCell.id = "mem-value-cell";
                memValueCell.innerHTML = this.formatMemValue(memValue);
            }
        }
    }

    /**
     * Insert intermediate row holding three vertical dots
     * @param table - Table to add row to
     * @param rowNumber - Row position in table
     */
    insertConnectingRow(table, rowNumber) {
        // insert row of five empty cells
        let row = table.insertRow(rowNumber);
        for (var k = 0; k < 5; k++) {
            let cell = row.insertCell(k);
            cell.innerHTML = "";
        }
        // add three dots to first cell
        row.id = "connecting-row";
        row.cells[0].id = "three-dots-cell";
    }

    /**
     * Convert decimal to hex
     * @param decimalValue
     * @returns {string}
     */
    formatMemValue(decimalValue) {
        let hexValue = BigInt.asUintN(8, decimalValue).toString(16);
        if (hexValue.length < 2) {
            return "0" + hexValue;
        } return hexValue;
    }

    /**
     * Convert decimal to hex in memory address format
     * @param decimalAddress
     * @returns {string}
     */
    formatMemAddress(decimalAddress) {
        let hexAddress = decimalAddress.toString(16);
        while (hexAddress.length < 8) {
            hexAddress = "0" + hexAddress;
        }
        return "0x" + hexAddress;
    }

    sortByAddress(mem) {
        return mem.sort(function(a, b) {
            var x = a.address;
            var y = b.address;
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

}

window.RegMemVisuals = RegMemVisuals;
// module.exports = RegMemVisuals;