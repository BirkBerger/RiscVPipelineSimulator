Feature: Assembler
  Description: Check that an assembly program is correctly converted to binary and correctly stored in memory.

  Scenario:
    Given that the assembly program "program1.txt" is input
    And the program is assembled and stored in memory
    Then there are 4 bytes for every program instruction
    And the memory byte array starting at address zero is "13,01,00,00,93,01,00,00,93,85,f5,7f,93,85,f5,7f,13,03,f0,ff,b3,85,65,02,33,86,25,00,b3,81,b5,00,33,07,a6,02,97,95,09,02,37,96,09,02"


  Scenario:
    Given that the assembly program "program2.txt" is input
    And the program is assembled and stored in memory
    Then there are 4 bytes for every program instruction
    And the memory byte array starting at address zero is "63,84,31,00,93,81,94,00,33,11,35,02,13,02,40,00,33,fa,41,02,83,84,07,00,b3,08,94,00,63,92,98,00,33,81,84,40,b3,81,76,00,b3,00,52,40,03,14,3f,00,a3,15,85,22"
