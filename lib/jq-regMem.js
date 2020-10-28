$(document).ready(function(){


    // $("#register-memory-table.rows").click(function(){
    //     alert("Click!");
    // });
});



function headerClicked(tableCell) {

    var table = document.getElementById("register-memory-table");
    $("#register-memory-table > tbody").empty();

    let cellHTML = tableCell.innerHTML;
    let cc = parseInt(cellHTML.substring(2,cellHTML.length));

    if (cc !== "") {
        let registers = Object.values(registerLog)[cc];
        let mem = Object.values(dataMemLog)[cc];

        // for (var i = 0; i < registers.length; i++) {
        //     let regContent = Number(registers[i]);
        //
        //     var regRow = table.insertRow(i);
        //     var regName = regRow.insertCell(0);
        //     var regValue = regRow.insertCell(1);
        //     regName.innerHTML = "x" + i;
        //     regName.id = "reg-name-cell";
        //     regValue.innerHTML = regContent.toString();
        //
        // }

        console.log("cc clicked: " + cc);
        console.log("mem.length: " + mem.length);
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
                console.log("memSlot: " + memSlot);
                var memValue = memRow.insertCell(1 + k);
                memValue.id = "mem-value-cell";
                memValue.innerHTML = BigInt.asUintN(8, memSlot[1]).toString(16);
            }
        }
    }

}

function formatMemAddress(memSlot) {
    let address = memSlot[0].toString(16);
    while (address.length < 8) {
        address =  "0" + address;
    }
    return "0x" + address;
}