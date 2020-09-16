Feature: Assembly parser
  Description: input different assembly snippets and check output

  Scenario: Too many instruction fields
    Given that the assembly editor holds the content of "tooManyFields.txt"
    Then the error message is thrown
      """
      Error in...
      line 3:
      - Unexpected number of instruction fields

      """

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

  Scenario: Register does not exist
    Given that the assembly editor holds the content of "invalidRegister.txt"
    Then the error message is thrown
      """
      Error in...
      line 7:
      - the register name "x32" is not recognized
      line 10:
      - the register name "xxdf" is not recognized

      """

  Scenario: Invalid memory address format
    Given that the assembly editor holds the content of "invalidMemAddress.txt"
    Then the error message is thrown
      """
      Error in...
      line 3:
      - the memory address is invalid
      line 12:
      - the memory address is invalid

      """


  Scenario: Branch label called but not declared
    Given that the assembly editor holds the content of "undeclaredLabel.txt"
    Then the error message is thrown
      """
      Error in...
      line 8:
      - the label is not found in code
      line 9:
      - the label name is already in use

      """

  Scenario: Branch address does not exist
    Given that the assembly editor holds the content of "invalidBranchAddress.txt"
    Then the error message is thrown
      """
      Error in...
      line 11:
      - branch address 296 is not found in code

      """
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
#
#  Scenario: Labels declared after call

# Scenario: Multiple occurrences of label name
#
  Scenario: Correct program
    Given that the assembly editor holds the content of "validProgram.txt"
    Then the error message is thrown
      """

      """


