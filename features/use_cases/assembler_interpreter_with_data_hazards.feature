Feature: Assembly interpreter
  Description: Input different assembly snippets without errors or data hazards and check that the program is being interpreted correctly

  Scenario: Writing registers => with data hazards
    Given that the assembly editor holds the input from file: "arithmetic_DH.txt"
    And the code is cleaned and assembled
    And the code is interpreted while still having data hazards
    And the result of register "x0" is 0 at cc 11
    And the result of register "x1" is 1 at cc 5
    And the result of register "x1" is 2 at cc 6
    And the result of register "x1" is 3 at cc 7
    And the result of register "x4" is 0 at cc 7
    And the result of register "x4" is 2 at cc 8
    And the result of register "x5" is 0 at cc 8
    And the result of register "x5" is 4 at cc 9
    And the result of register "x6" is 0 at cc 9
    And the result of register "x6" is 6 at cc 10
    And the result of register "x7" is 0 at cc 10
    And the result of register "x7" is 6 at cc 11

  Scenario: Writing registers => without data hazards
    Given that the assembly editor holds the input from file: "arithmetic_DH.txt"
    And the code is cleaned and assembled
    And the code is interpreted with no data hazards
    And the result of register "x0" is 0 at cc 11
    And the result of register "x1" is 1 at cc 5
    And the result of register "x1" is 2 at cc 6
    And the result of register "x1" is 3 at cc 7
    And the result of register "x4" is 0 at cc 7
    And the result of register "x4" is 6 at cc 8
    And the result of register "x5" is 0 at cc 8
    And the result of register "x5" is 6 at cc 9
    And the result of register "x6" is 0 at cc 9
    And the result of register "x6" is 6 at cc 10
    And the result of register "x7" is 0 at cc 10
    And the result of register "x7" is 6 at cc 11

  Scenario: Writing memory => with data hazards
    Given that the assembly editor holds the input from file: "branch_DH.txt"
    And the code is cleaned and assembled
    And the code is interpreted while still having data hazards
    And the result of register "x0" is 0 at cc 10
    And the result of register "x1" is 0 at cc 4
    And the result of register "x1" is 1 at cc 5
    And the result of register "x2" is 0 at cc 5
    And the result of register "x2" is 2 at cc 6
    And the result of register "x4" is 0 at cc 9
    And the result of register "x4" is 7 at cc 10


  Scenario: Writing memory => without data hazards
    Given that the assembly editor holds the input from file: "branch_DH.txt"
    And the code is cleaned and assembled
    And the code is interpreted with no data hazards
    And the result of register "x0" is 0 at cc 9
    And the result of register "x1" is 0 at cc 4
    And the result of register "x1" is 1 at cc 5
    And the result of register "x2" is 0 at cc 5
    And the result of register "x2" is 2 at cc 6
    And the result of register "x1" is 1 at cc 7
    And the result of register "x2" is 2 at cc 8
    And the result of register "x4" is 0 at cc 8
    And the result of register "x4" is 7 at cc 9