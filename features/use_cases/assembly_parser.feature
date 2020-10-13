Feature: Assembly parser
  Description: input different assembly snippets and check that errors are being reported properly

  # fail
  Scenario: Too many instruction fields
    Given that the assembly editor holds the content of "tooManyFields.txt"
    Then the error message is thrown
      """
      Error in...
      line 3:
      - Unexpected number of instruction fields

      """

  # fail
  Scenario: Not enough instruction fields specified by opcode
    Given that the assembly editor holds the content of "missingFields.txt"
    Then the error message is thrown
      """
      Error in...
      line 1:
      - register is missing
      - register is missing

      """

  # fail
  Scenario: Opcode does not exist
    Given that the assembly editor holds the content of "invalidOpcode.txt"
    Then the error message is thrown
      """
      Error in...
      line 5:
      - the opcode "addo" is not recognized

      """

  # fail
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

  # fail
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

  # fail
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

  # fail
  Scenario: Branch address does not exist
    Given that the assembly editor holds the content of "invalidBranchAddress.txt"
    Then the error message is thrown
      """
      Error in...
      line 11:
      - branch address 296 is not found in code

      """

#  # fail
#  Scenario: sc.d memory address not reserved
#    Given that the assembly editor holds the content of "memAddressNotReserved.txt"
#    Then the error message is thrown
#      """
#      Error in...
#      line 3:
#      - memory address has not been reserved
#
#      """

  # fail
  Scenario: Invalid immediate value
    Given that the assembly editor holds the content of "invalidImm.txt"
    Then the error message is thrown
      """
      Error in...
      line 5:
      - immediate value is missing
      line 8:
      - the immediate value is invalid
      line 9:
      - the immediate value is invalid

      """

  # fail
  Scenario: Empty file
    Given that the assembly editor holds the content of "emptyFile.txt"
    Then the error message is thrown
      """
      Please type in code to pipeline
      """

  # success
  Scenario: Correct program
    Given that the assembly editor holds the content of "correctProgram.txt"
    Then the error message is thrown
      """

      """

  # success
  Scenario: Lots of white space
   Given that the assembly editor holds the content of "lotsOfWhiteSpace.txt"
   Then the error message is thrown
      """

      """



