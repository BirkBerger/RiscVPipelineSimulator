class RegMemVisuals {

    emptyRegisterMemoryTable() {
        // clear register/memory table
        $("#register-memory-table > tbody").empty();
        // set register/memory placeholder
        $('.register-memory-placeholder').css('display','block');
        $('.register-memory-placeholder').text("Solve all hazards and click on a clock cycle in the pipeline to see the RISC-V general purpose registers and relevant data memory contents at this time");
        lastTableCell = undefined;
    }

    getCC(tableCell) {
        let cellHTML = tableCell.innerHTML;
        let cc = parseInt(cellHTML.substring(2, cellHTML.length)) - 1;
        lastTableCell = tableCell;
        return cc;
    }

    showRegisters(tableCell) {
        var table = document.getElementById("register-memory-table");
        $("#register-memory-table > tbody").empty();
        $('.register-memory-placeholder').css('display','none');

        let cc = this.getCC(tableCell)

        let registers = registerLog[cc]

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

    showMemory(tableCell) {
        var table = document.getElementById("register-memory-table");
        $("#register-memory-table > tbody").empty();
        $('.register-memory-placeholder').css('display','none');


        let cc = this.getCC(tableCell)

        let mem = dataMemLog[cc];
        var lastMemAddress = null;

        var rowNumber = 0;
        for (var j = mem.length - 4; j >= 0; j -= 4) {

            // if there is a gab between memory addresses => insert connecting table row
            if (lastMemAddress !== null && mem[j][0] < lastMemAddress-7) {
                this.insertConnectingRow(table, rowNumber);
                rowNumber++;
            }

            let memSlot = mem[j];

            var memRow = table.insertRow(rowNumber);
            rowNumber++;
            var memAddressCell = memRow.insertCell(0);
            memAddressCell.innerHTML = this.formatMemAddress(memSlot[0]);
            memAddressCell.id = "mem-address-cell";
            for (var k = 0; k < 4; k++) {
                memSlot = mem[j + k];
                var memValueCell = memRow.insertCell(1 + k);
                memValueCell.id = "mem-value-cell";
                memValueCell.innerHTML = this.formatMemValue(memSlot[1]);
            }
            lastMemAddress = memSlot[0];
        }
    }

    insertConnectingRow(table, rowNumber) {

        let row = table.insertRow(rowNumber);

            for (var k = 0; k < 5; k++) {
                let cell = row.insertCell(k);
                // cell.id = "three-dots-cell";
                cell.innerHTML = "";
            }
        row.id = "connecting-row";
        row.cells[0].id = "three-dots-cell";
    }

    formatMemValue(decimalValue) {
        let hexValue = BigInt.asUintN(8, decimalValue).toString(16);
        if (hexValue.length < 2) {
            return "0" + hexValue;
        } return hexValue;
    }

    formatMemAddress(decimalAddress) {
        let hexAddress = decimalAddress.toString(16);
        while (hexAddress.length < 8) {
            hexAddress = "0" + hexAddress;
        }
        return "0x" + hexAddress;
    }
}

window.RegMemVisuals = RegMemVisuals;
// module.exports = RegMemVisuals;