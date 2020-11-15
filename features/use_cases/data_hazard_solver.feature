Feature: Hazard solver
  Description: input different assembly snippets and make sure hazards are being detected and solved properly

  # data hazard
  Scenario: Store in rd from ALU
    Given that the assembly editor holds the input with no errors: "storeFromALU.txt"
    And the assembly code is cleaned
    And the data hazards are removed from the assembly code
    Then 2 data hazards are detected
    And there is a forwarding line from line 0 at cc 2.5 to line 1 at 1.5
    And there is a forwarding line from line 0 at cc 2.5 to line 2 at 1.5

  # data hazard
  Scenario: Store in rd from memory
    Given that the assembly editor holds the input with no errors: "storeFromMemory.txt"
    And the assembly code is cleaned
    And the data hazards are removed from the assembly code
    Then 2 data hazards are detected
    And there is a forwarding line from line 0 at cc 3.5 to line 2 at 1.5
    And there is a stall at line 1

  # data hazard
  Scenario: Store same rd twice in a row
    Given that the assembly editor holds the input with no errors: "rdWrittenTwice.txt"
    And the assembly code is cleaned
    And the data hazards are removed from the assembly code
    Then 5 data hazards are detected
    And there is a forwarding line from line 1 at cc 2.5 to line 2 at 1.5
    And there is a forwarding line from line 2 at cc 2.5 to line 3 at 1.5

  # data hazard
  Scenario: Fetch with "store" instruction
    Given that the assembly editor holds the input with no errors: "storeInstructionFetch.txt"
    And the assembly code is cleaned
    And the data hazards are removed from the assembly code
    Then 2 data hazards are detected
    And there is a forwarding line from line 0 at cc 2.5 to line 1 at 2.5
    And there is a forwarding line from line 4 at cc 3.5 to line 5 at 2.5

  # data hazard
  Scenario: Fetch register holding memory address
    Given that the assembly editor holds the input with no errors: "memAddressInReg.txt"
    And the assembly code is cleaned
    And the data hazards are removed from the assembly code
    Then 7 data hazards are detected
    And there is a forwarding line from line 0 at cc 2.5 to line 1 at 2.5
    And there is a forwarding line from line 1 at cc 3.5 to line 2 at 2.5
    And there is a forwarding line from line 3 at cc 2.5 to line 4 at 2.5
    And there is a forwarding line from line 4 at cc 3.5 to line 5 at 2.5
    And there is a forwarding line from line 4 at cc 3.5 to line 6 at 1.5

  # data hazard
  Scenario: Stall that solves more than one hazard
    Given that the assembly editor holds the input with no errors: "multipleStalls.txt"
    And the assembly code is cleaned
    And the data hazards are removed from the assembly code
    Then 8 data hazards are detected
    And there is a forwarding line from line 0 at cc 3.5 to line 2 at 1.5
    And there is a stall at line 1
    And there is a forwarding line from line 4 at cc 3.5 to line 6 at 1.5
    And there is a stall at line 5
    And there is a forwarding line from line 9 at cc 3.5 to line 11 at 1.5
    And there is a stall at line 10

  # no hazard
  Scenario: Branch/jump label has a register name that has just been stored in
    Given that the assembly editor holds the input with no errors: "labelNameIsRegName.txt"
    And the assembly code is cleaned
    And the data hazards are removed from the assembly code
    Then 0 data hazards are detected
    And there are no forwarding lines

  # no hazard
  Scenario: Data hazard with x0 => not a data hazard
    Given that the assembly editor holds the input with no errors: "loadAndStoreX0.txt"
    And the assembly code is cleaned
    And the data hazards are removed from the assembly code
    Then 0 data hazards are detected
    And there are no forwarding lines



