Feature: Assembly interpreter
  Description: input different assembly snippets with no syntax error and check that the program is being interpreted correctly

  # data hazard
  Scenario: Program 1: addi,
    Given that the assembly editor holds the input with no syntax errors: "program1.txt"
    And the code is cleaned
    And the code is interpreted
    Then the result of register "x2" is 9
    Then the result of register "x3" is 0
    Then the result of register "x5" is 18
    Then the result of register "x11" is 9
    Then the result of register "x13" is -9
    Then the result of register "x20" is 13
    Then the result of register "x22" is -4
    And the value at memory address 9 is 9
