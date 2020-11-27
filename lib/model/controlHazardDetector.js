/**
 * Detects control hazards.
 */
class ControlHazardDetector {

    constructor(code) {
        this.code = code;
        this.numberOfHazards = 0;
    }

    /**
     * For each jump or branch instruction => increment number of control hazards
     */
    detectAll() {
        for (var i = 0; i < this.code.length; i++) {
            let opcode = this.code[i][0];
            if (opcode === "jal" ||
                opcode === "jalr" ||
                opcode === "beq" ||
                opcode === "bne" ||
                opcode === "blt" ||
                opcode === "bge" ||
                opcode === "bltu" ||
                opcode === "bgeu") {
                this.numberOfHazards += 1;
            }
        }
    }
}

// window.ControlHazardDetector = ControlHazardDetector;
module.exports = ControlHazardDetector;