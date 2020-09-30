Feature: Hazard solver
  Description: input different assembly snippets and make sure hazards are being detected and solved properly

#  # data hazard
#  Scenario: Store from ALU
#    Given that the assembly editor holds the input with no errors: "storeFromALU.txt"
#    And the assembly code is compiled
#    And the data hazards are removed from the assembly code
#    Then 2 data hazards are detected
#    And there is a forwarding line from line 0 at cc 2.5 to line 1 at 1.5
#    And there is a forwarding line from line 0 at cc 3.5 to line 2 at 1.5
#
#  # data hazard
#  Scenario: Store from memory
#    Given that the assembly editor holds the input with no errors: "storeFromMemory.txt"
#    And the assembly code is compiled
#    And the data hazards are removed from the assembly code
#    Then 2 data hazards are detected
#    And there is a forwarding line from line 0 at cc 3.5 to line 2 at 1.5
#    And there is a stall at line 1
#
#  # data hazard
#  Scenario: Rd written twice in a row
#    Given that the assembly editor holds the input with no errors: "rdWrittenTwice.txt"
#    And the assembly code is compiled
#    And the data hazards are removed from the assembly code
#    Then 3 data hazards are detected
#    And there is a forwarding line from line 1 at cc 2.5 to line 2 at 1.5
#    And there is a forwarding line from line 2 at cc 2.5 to line 3 at 1.5

  # data hazard
  Scenario: Fetch with "store" instruction after ALU store and and after memory store
    Given that the assembly editor holds the input with no errors: "storeInstructionFetch.txt"
    And the assembly code is compiled
    And the data hazards are removed from the assembly code
    Then 2 data hazards are detected
    And there is a forwarding line from line 1 at cc 2.5 to line 2 at 2.5
    And there is a forwarding line from line 6 at cc 3.5 to line 7 at 2.5

#  # data hazard
#  Scenario: Store from ALU + memory, load from 2 registers in the same line
#
#
#  # no hazard
#  Scenario: Branch with register name as label
#
#  # no hazard
#  Scenario: Jump with register name as label
#
#  # no hazard
#  Scenario: Store from ALU + memory, load from 5th following line
#
#  # no hazard
#  Scenario: Store to x0 followed by a load of x0



