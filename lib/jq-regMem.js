let lastTableCell;

$(document).ready(function(){

    $('#reg-mem-slider').attr("checked",false);
});

function regTitleClicked() {
    $('#reg-mem-slider').attr("checked",false);
    sliderChanged();
}

function memTitleClicked() {
    $('#reg-mem-slider').attr("checked",true);
    sliderChanged();
}

function sliderChanged() {
    pipelineHeaderClicked(lastTableCell);
}

function pipelineHeaderClicked(tableCell) {
    let slider = document.getElementById('reg-mem-slider');
    if (slider.checked) {
        showMemory(tableCell);
    } else {
        showRegisters(tableCell);
    }
}

function formatMemAddress(memSlot) {
    let address = memSlot[0].toString(16);
    while (address.length < 8) {
        address =  "0" + address;
    }
    return "0x" + address;
}

function showRegisters(tableCell) {
    var table = document.getElementById("register-memory-table");
    $("#register-memory-table > tbody").empty();

    let cellHTML = tableCell.innerHTML;
    let cc = parseInt(cellHTML.substring(2,cellHTML.length));
    lastTableCell = tableCell;

    let registers = Object.values(registerLog)[cc];

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

function showMemory(tableCell) {
    var table = document.getElementById("register-memory-table");
    $("#register-memory-table > tbody").empty();

    let cellHTML = tableCell.innerHTML;
    let cc = parseInt(cellHTML.substring(2,cellHTML.length));
    lastTableCell = tableCell;

    let mem = Object.values(dataMemLog)[cc];

    var rowNumber = 0;
    for (var j = mem.length-4; j >= 0; j-=4) {
        let memSlot = mem[j];
        var memRow = table.insertRow(rowNumber);
        rowNumber++;
        var memAddress = memRow.insertCell(0);
        memAddress.innerHTML = formatMemAddress(memSlot);
        memAddress.id = "mem-address-cell";
        for (var k = 0; k < 4; k++) {
            memSlot = mem[j+k];
            var memValue = memRow.insertCell(1 + k);
            memValue.id = "mem-value-cell";
            memValue.innerHTML = BigInt.asUintN(8, memSlot[1]).toString(16);
        }
    }

}