Feature: Assembly interpreter
  Description: Input different assembly snippets with no errors and check that the program is being interpreted correctly

  Scenario: Load double, word, half, and byte - signed/unsigned
    Given that the assembly editor holds the input with no syntax errors: "load.txt"
    And the code is cleaned
    And the code is interpreted
    Then the result of register "x0" is "0"
    And the result of register "x1" is "2047"
    And the result of register "x2" is "576188069258921983"
    And the result of register "x3" is "134154239"
    And the result of register "x4" is "134154239"
    And the result of register "x5" is "2047"
    And the result of register "x6" is "2047"
    And the result of register "x7" is "-1"
    And the result of register "x8" is "255"
    And the result of register "x9" is "8"
    And the value at memory address 8 is -1
    And the value at memory address 9 is 7
    And the value at memory address 10 is -1
    And the value at memory address 11 is 7
    And the value at memory address 12 is -1
    And the value at memory address 13 is 7
    And the value at memory address 14 is -1
    And the value at memory address 15 is 7
    And the value at memory address 16 is -1
    And the value at memory address 17 is 7
    And the value at memory address 18 is -1
    And the value at memory address 19 is 7

  Scenario: Store double, word, half, and byte
    Given that the assembly editor holds the input with no syntax errors: "store.txt"
    And the code is cleaned
    And the code is interpreted
    Then the result of register "x0" is "0"
    And the result of register "x5" is "-1323"
    And the result of register "x3" is "3"
    And the result of register "x11" is "11"
    And the result of register "x29" is "29"
    And the value at memory address 251 is -43
    And the value at memory address 252 is -6
    And the value at memory address 253 is -1
    And the value at memory address 254 is -1
    And the value at memory address 255 is -1
    And the value at memory address 256 is -1
    And the value at memory address 257 is -1
    And the value at memory address 258 is -1
    And the value at memory address 20 is -43
    And the value at memory address 21 is -6
    And the value at memory address 22 is -1
    And the value at memory address 23 is -1
    And the value at memory address 1 is -43
    And the value at memory address 2 is -6
    And the value at memory address 8 is -43

  Scenario: Arithmetic: addition, subtraction, multiplication, division, and modulus
    Given that the assembly editor holds the input with no syntax errors: "arithmetic.txt"
    And the code is cleaned
    And the code is interpreted
    Then the result of register "x0" is "0"
    And the result of register "x3" is "-16376"
    And the result of register "x4" is "-2048"
    And the result of register "x6" is "-1"
    And the result of register "x7" is "-3"
    And the result of register "x8" is "8190"
    And the result of register "x9" is "-7"
    And the result of register "x10" is "2047"
    And the result of register "x11" is "-8188"
    And the result of register "x12" is "-8186"
    And the result of register "x14" is "-6139"
    And the result of register "x15" is "0"
    And the result of register "x16" is "-8188"
    And the result of register "x17" is "201252864"
    And the result of register "x18" is "1169"
    And the result of register "x20" is "1874"
    And the result of register "x21" is "1874"
    And the result of register "x22" is "0"
    And the result of register "x23" is "-1170"
    And the result of register "x24" is "0"
    And the result of register "x25" is "544"
    And the result of register "x26" is "1874"
    And the result of register "x27" is "1874"
    And the result of register "x28" is "0"
    And the result of register "x29" is "0"
    And the result of register "x30" is "1"
    And the result of register "x31" is "1"

  Scenario: Logical: and, or, and xor
    Given that the assembly editor holds the input with no syntax errors: "logic.txt"
    And the code is cleaned
    And the code is interpreted
    Then the result of register "x0" is "0"
    And the result of register "x1" is "1928"
    And the result of register "x2" is "1288"
    And the result of register "x3" is "2009"
    And the result of register "x4" is "2040"
    And the result of register "x5" is "81"
    And the result of register "x6" is "752"
    And the result of register "x9" is "2009"
    And the result of register "x10" is "1928"

  Scenario: Shift double, word, half, and byte - logical/arithmetic, left/right
    Given that the assembly editor holds the input with no syntax errors: "shift.txt"
    And the code is cleaned
    And the code is interpreted
    Then the result of register "x0" is "0"
    Then the result of register "x1" is "-1"
    Then the result of register "x2" is "-85743552400000000"
    Then the result of register "x3" is "2171272192"
    Then the result of register "x4" is "-1339743006250000"
    Then the result of register "x5" is "3322260464"
    Then the result of register "x6" is "18014316738058262"
    Then the result of register "x7" is "-83733937890625"
    Then the result of register "x8" is "4127922198"
    Then the result of register "x9" is "2305832542471457623"
    Then the result of register "x10" is "10"
    Then the result of register "x11" is "93064023"
    Then the result of register "x12" is "-81771423722"
    Then the result of register "x13" is "-167045098"
    Then the result of register "x14" is "-10466742236329"
    Then the result of register "x15" is "93064023"

  Scenario: Branch and jump
    Given that the assembly editor holds the input with no syntax errors: "branch_and_jump.txt"
    And the code is cleaned
    And the code is interpreted
    Then the result of register "x0" is "0"
    And the result of register "x1" is "1"
    And the result of register "x2" is "1"
    And the result of register "x3" is "1"
    And the result of register "x4" is "1"
    And the result of register "x5" is "0"
    And the result of register "x6" is "1"
    And the result of register "x7" is "1"
    And the result of register "x8" is "21"
    And the result of register "x9" is "24"
    And the result of register "x10" is "6"
    And the result of register "x11" is "34181145"
    And the result of register "x12" is "34181120"
    And the result of register "x30" is "9"
    And the result of register "x31" is "-9"
    And the pipelineOrder is "0,1,2,3,4,12,13,14,15,10,11,12,13,8,9,10,11,14,15,16,17,21,22,23,24,17,18,19,20,24,23,25,26"

  Scenario: Program 1: Mixed instructions
    Given that the assembly editor holds the input with no syntax errors: "program1.txt"
    And the code is cleaned
    And the code is interpreted
    Then the result of register "x0" is "0"
    And the result of register "x2" is "9"
    And the result of register "x3" is "0"
    And the result of register "x5" is "18"
    And the result of register "x11" is "9"
    And the result of register "x13" is "-9"
    And the result of register "x20" is "13"
    And the result of register "x22" is "-4"
    And the value at memory address 9 is 9
