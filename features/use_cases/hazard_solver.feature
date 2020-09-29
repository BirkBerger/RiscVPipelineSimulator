Feature: Hazard solver
  Description: input different assembly snippets and make sure hazards are being detected and solved properly

  # data hazard
  Scenario: Load from both following lines: Store from ALU
#    Given that the assembly editor holds the content of "loadFromBothFollowingLines.txt"
#    And the data hazards are removed from the assembly code
#    Then 2 data hazards are detected
#    And there is a forwarding line from line 0 at cc 2.5 to line 1 at 1.5
#    And there is a forwarding line from line 0 at cc 3.5 to line 2 at 1.5

#  # data hazard
#  Scenario: Store from memory
#    Given that the assembly editor holds the content of "storeFromMemory.txt"
#    And the data hazards are removed from the assembly code
#    Then 2 data hazards are detected
#    And there is a forwarding line from line 0 at cc 3.5 to line 2 at 1.5
#    And there is a stall at line 1
#

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



