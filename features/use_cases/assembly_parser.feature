Feature: Assembly parser
  Description: input different assembly snippets and check output

#  Scenario: Too many instruction fields

  Scenario: Not enough instruction fields specified by opcode
    Given that the assembly editor holds the content of "missingFields.txt"
    Then the error message is thrown
      """
      Error in...
      line 1:
      - register is missing
      - register is missing

      """

  Scenario: Opcode does not exist
    Given that the assembly editor holds the content of "invalidOpcode.txt"
    Then the error message is thrown
      """
      Error in...
      line 5:
      - the instruction is not recognized

      """

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


