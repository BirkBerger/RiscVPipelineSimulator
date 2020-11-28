Feature: Assembly interpreter - with and without data hazards
  Description: Input different assembly snippets (hazardous or data-hazard-free) without errors check that the program is being interpreted correctly

  Scenario: "Arithmetic data hazard"
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

  Scenario: "Arithmetic data hazard" with simulated forwarding
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

  Scenario: "Branch data hazard"
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

  Scenario: "Branch data hazard" with simulated forwarding
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

  Scenario: "Store data hazard"
    Given that the assembly editor holds the input from file: "store_DH.txt"
    And the code is cleaned and assembled
    And the code is interpreted while still having data hazards
    And the result of register "x1" is 0 at cc 4
    And the result of register "x1" is -1 at cc 5
    And the result of register "x1" is -2 at cc 6
    And the result of register "x1" is -3 at cc 7
    And the value at memory address 284 at cc 7 is 0
    And the value at memory address 285 at cc 7 is 0
    And the value at memory address 286 at cc 7 is 0
    And the value at memory address 287 at cc 7 is -2
    And the value at memory address 288 at cc 7 is -1
    And the value at memory address 289 at cc 7 is -1
    And the value at memory address 290 at cc 7 is -1
    And the value at memory address 291 at cc 7 is 0
    And the value at memory address 28 at cc 8 is 0
    And the value at memory address 29 at cc 8 is 0
    And the value at memory address 30 at cc 8 is -3
    And the value at memory address 31 at cc 8 is -1

  Scenario: "Store data hazard" with simulated forwarding
    Given that the assembly editor holds the input from file: "store_DH.txt"
    And the code is cleaned and assembled
    And the code is interpreted with no data hazards
    And the value at memory address 284 at cc 7 is 0
    And the result of register "x1" is 0 at cc 4
    And the result of register "x1" is -1 at cc 5
    And the result of register "x1" is -2 at cc 6
    And the result of register "x1" is -3 at cc 7
    And the value at memory address 284 at cc 7 is 0
    And the value at memory address 285 at cc 7 is 0
    And the value at memory address 286 at cc 7 is -3
    And the value at memory address 287 at cc 7 is -1
    And the value at memory address 288 at cc 7 is -1
    And the value at memory address 289 at cc 7 is -1
    And the value at memory address 290 at cc 7 is 0
    And the value at memory address 291 at cc 7 is 0
    And the value at memory address 28 at cc 8 is 0
    And the value at memory address 29 at cc 8 is 0
    And the value at memory address 30 at cc 8 is -3
    And the value at memory address 31 at cc 8 is -1

  Scenario: "Memory address data hazards"
    Given that the assembly editor holds the input from file: "memory_address_DH.txt"
    And the code is cleaned and assembled
    And the code is interpreted while still having data hazards
    And the result of register "x10" is 0 at cc 4
    And the result of register "x10" is 10 at cc 5
    And the result of register "x5" is 0 at cc 5
    And the result of register "x5" is 5 at cc 6
    And the result of register "x4" is 0 at cc 6
    And the result of register "x4" is 0 at cc 7
    And the result of register "x5" is 5 at cc 7
    And the result of register "x5" is 19 at cc 8
    And the result of register "x6" is 0 at cc 8
    And the result of register "x6" is 5 at cc 9
    And the result of register "x7" is 0 at cc 9
    And the result of register "x7" is 6 at cc 10
    And the result of register "x8" is 0 at cc 12
    And the result of register "x8" is 0 at cc 13
    And the result of register "x9" is 0 at cc 13
    And the result of register "x9" is 0 at cc 14
    And the pipeline order is "0,1,2,3,4,5,6,7,8,9,10"

  Scenario: "Memory address data hazards" with simulated forwarding and stalling
    Given that the assembly editor holds the input from file: "memory_address_DH.txt"
    And the code is cleaned and assembled
    And the code is interpreted with no data hazards
    And the result of register "x10" is 0 at cc 4
    And the result of register "x10" is 10 at cc 5
    And the result of register "x5" is 0 at cc 5
    And the result of register "x5" is 5 at cc 6
    And the result of register "x4" is 0 at cc 6
    And the result of register "x4" is 50 at cc 7
    And the result of register "x5" is 5 at cc 7
    And the result of register "x5" is -92 at cc 8
    And the result of register "x6" is 0 at cc 8
    And the result of register "x6" is -2 at cc 9
    And the result of register "x7" is 0 at cc 9
    And the result of register "x7" is 6 at cc 10
    And the result of register "x8" is 0 at cc 12
    And the result of register "x8" is 100 at cc 13
    And the result of register "x9" is 0 at cc 13
    And the result of register "x9" is 20 at cc 14
    And the pipeline order is "0,1,2,3,4,5,6,7,6,7,8,9,10"

  Scenario: Storing and loading - no data hazards
    Given that the assembly editor holds the input from file: "loading_mem.txt"
    And the code is cleaned and assembled
    And the code is interpreted while still having data hazards
    And the result of register "x2" is 0 at cc 4
    And the result of register "x2" is -2 at cc 5
    And the value at memory address 8 at cc 6 is -2
    And the value at memory address 9 at cc 6 is -1
    And the result of register "x3" is 0 at cc 7
    And the result of register "x3" is -1 at cc 8