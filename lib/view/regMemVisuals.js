class RegMemVisuals {

    emptyRegisterMemoryTable() {
        // clear register/memory table
        $("#register-memory-table > tbody").empty();
        // set register/memory placeholder
        $('.register-memory-placeholder').text("Solve all hazards and click on a clock cycle in the pipeline to see the RISC-V general purpose registers and relevant data memory contents at this time");
        allHazardsAreSolved = false;
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

        let cc = this.getCC(tableCell)

        let registers = registerLog[cc]

        $('.register-memory-placeholder').empty();

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

        let cc = this.getCC(tableCell)

        let mem = dataMemLog[cc];

        // if there is no relevant data memory to show => set register/memory placeholder
        if (mem.length === 0) {
            $('.register-memory-placeholder').text("No data memory has been accessed for reading or writing at this point in the pipeline");
        } else {
            $('.register-memory-placeholder').empty();
        }

        // this.updatePlaceHolder(mem.length, )

        var rowNumber = 0;
        for (var j = mem.length - 4; j >= 0; j -= 4) {
            let memSlot = mem[j];
            var memRow = table.insertRow(rowNumber);
            rowNumber++;
            var memAddress = memRow.insertCell(0);
            memAddress.innerHTML = this.formatMemAddress(memSlot);
            memAddress.id = "mem-address-cell";
            for (var k = 0; k < 4; k++) {
                memSlot = mem[j + k];
                var memValue = memRow.insertCell(1 + k);
                memValue.id = "mem-value-cell";
                memValue.innerHTML = this.formatMemValue(memSlot[1]);
            }
        }
    }

    formatMemValue(memSlot) {
        let hex = BigInt.asUintN(8, memSlot).toString(16);
        if (hex.length < 2) {
            return "0" + hex;
        } return hex;
    }

    formatMemAddress(memSlot) {
        let address = memSlot[0].toString(16);
        while (address.length < 8) {
            address = "0" + address;
        }
        return "0x" + address;
    }
}

window.RegMemVisuals = RegMemVisuals;
// module.exports = RegMemVisuals;