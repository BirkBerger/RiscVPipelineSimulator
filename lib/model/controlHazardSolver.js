// // For testing
// // const AssemblyInterpreter = require("../../lib/model/assemblyInterpreter");
//
// /**
//  * Solve control hazards in code array by ordering instructions according to execution and inserting flushes.
//  */
// class ControlHazardSolver {
//
//     constructor(code) {
//         this.code = code;
//         this.controlHazardFreeCode = [];
//         this.highlightOrder = [];
//         this.pipelineOrder = [];
//     }
//
//     /**
//      * Solves control hazards in code array by interpreting the code, hence simulating its execution in a 5-stage pipeline.
//      * @param interpreter
//      */
//     setInterpretedCode(interpreter) {
//         this.highlightOrder = interpreter.highlightOrder;
//         this.pipelineOrder = interpreter.pipelineOrder;
//
//         // Create control-hazard-free code array from interpreter pipeline order
//         for (var i = 0; i < this.pipelineOrder.length; i++) {
//             if (this.pipelineOrder[i][1]) {
//                 this.controlHazardFreeCode[i] = this.code[this.pipelineOrder[i][0]].slice();
//             } else {
//                 this.controlHazardFreeCode[i] = ["Flush", "", "", "", [false, ""],[],this.highlightOrder[i]];
//             }
//         }
//     }
// }
//
// window.ControlHazardSolver = ControlHazardSolver;
// // module.exports = ControlHazardSolver;