Feature: Assembly interpreter
  Description: input different assembly snippets with no syntax error and check that the program is being interpreted correctly


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
    Then the result of register "x3" is "-16376"
    Then the result of register "x4" is "-1149"
    Then the result of register "x6" is "-1"
    Then the result of register "x7" is "-3"
    Then the result of register "x8" is "8190"
    Then the result of register "x9" is "-7"
    Then the result of register "x10" is "2047"
    Then the result of register "x11" is "-8188"
    Then the result of register "x12" is "-8186"
    Then the result of register "x14" is "-6139"
    Then the result of register "x15" is "0"
    Then the result of register "x16" is "-8188"
    Then the result of register "x17" is "314236524"
    Then the result of register "x18" is "1169"
    Then the result of register "x20" is "1622"
    Then the result of register "x21" is "473"
    Then the result of register "x22" is "0"
    Then the result of register "x23" is "-1170"
    Then the result of register "x24" is "0"
    Then the result of register "x25" is "1622"
    Then the result of register "x26" is "1622"
    Then the result of register "x27" is "473"
    Then the result of register "x28" is "0"
    Then the result of register "x29" is "0"
    Then the result of register "x30" is "1"
    Then the result of register "x31" is "1"



  Scenario: Logical: and, or, and xor

  Scenario: Shift double, word, half, and byte - logical/arithmetic, left/right

  Scenario: Branch and jump

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

#    overflow