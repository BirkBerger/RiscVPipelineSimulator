Feature: Assembly parser
  Description: input different assembly snippets and check output

  Scenario: Too many instruction fields

  Scenario: Not enough instruction fields specified by opcode
    Given that the assembly editor holds the content of "invalidFields.txt"
    Then the error message "Error in...\nline 2:- Expected 2 or 3 instruction fields but found 1"

#  Scenario: Opcode does not exist
#
#  Scenario: Register does not exist
#
#  Scenario: Invalid memory address format
#
#  Scenario: Invalid register as memory address format
#
#  Scenario: Branch label called but not declared
#
#  Scenario: Branch address does not exist
#
#  Scenario: sc.d memory address not reserved
#
#  Scenario: Invalid immediate value
#
#  Scenario: Correct R-type instruction
#
#  Scenario: Correct I-type instruction
#
#  Scenario: Correct S-type instruction
#
#  Scenario: Correct SB-type instruction
#
#  Scenario: Correct UJ-type instruction
#
#  Scenario: Correct U-type instruction


