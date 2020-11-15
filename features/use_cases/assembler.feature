Feature: Assembler
  Description: Check that an assembly program is correctly converted to binary and correctly stored in memory.

  Scenario:
    Given that the assembly program "program1.txt" is input
    And the program is assembled and stored in memory
    Then there are 4 bytes for every program instruction
    And the memory byte array starting at address zero is
    """
    13,01,00,00,
    93,01,00,00,
    93,85,f5,7f,
    93,85,f5,7f,
    13,03,f0,ff,
    b3,85,65,02,
    33,86,25,00,
    b3,81,b5,00,
    33,07,a6,02,
    97,95,09,02,
    37,96,09,02
    """

  Scenario:
    Given that the assembly program "program2.txt" is input
    And the program is assembled and stored in memory
    Then there are 4 bytes for every program instruction
    And the memory byte array starting at address zero is
    """
    63,84,31,00,
    93,81,94,00,
    33,11,35,02,
    13,02,40,00,
    33,fa,41,02,
    83,84,07,00,
    b3,08,94,00,
    63,92,98,00,
    33,81,84,40,
    b3,81,76,00,
    b3,00,52,40,
    03,14,3f,00,
    a3,15,85,22
    """

  Scenario:
    Given that the assembly program "arithmetic.txt" is input
    And the program is assembled and stored in memory
    Then there are 4 bytes for every program instruction
    And the memory byte array starting at address zero is
    """
    13,05,f0,7f,
    93,05,f5,7f,
    93,85,f5,7f,
    93,85,f5,7f,
    13,03,f0,ff,
    b3,85,65,02,
    13,86,25,00,
    b3,81,b5,00,
    33,07,a6,00,
    33,04,36,40,
    b3,84,35,40,
    93,03,d0,ff,
    13,02,00,80,
    13,0a,20,75,
    b3,6a,4a,02,
    b3,7c,4a,02,
    33,7d,4a,02,
    b3,6d,4a,02,
    93,04,90,ff,
    13,ae,63,ff,
    93,be,63,ff,
    33,af,74,00,
    b3,bf,74,00,
    b3,97,b5,02,
    33,a8,b5,02,
    b3,08,c6,02,
    b3,88,48,02,
    33,c9,95,02,
    33,dc,95,02,
    b3,4b,94,02,
    33,5b,94,02
    """

  Scenario:
    Given that the assembly program "branch_and_jump.txt" is input
    And the program is assembled and stored in memory
    Then there are 4 bytes for every program instruction
    And the memory byte array starting at address zero is
    """
    13,0f,90,00,
    93,0f,70,ff,
    63,04,ef,03,
    93,00,80,00,
    13,01,80,00,
    93,01,80,00,
    13,02,80,00,
    93,02,80,00,
    93,00,10,00,
    63,6a,ff,01,
    13,01,10,00,
    e3,ca,ef,ff,
    93,01,10,00,
    e3,1a,0f,fe,
    13,02,10,00,
    63,5c,ff,01,
    93,02,10,00,
    13,03,10,00,
    13,05,60,00,
    93,04,40,00,
    67,84,44,01,
    93,03,10,00,
    e3,f6,ef,ff,
    ef,04,80,00,
    ef,f4,df,ff,
    97,95,09,02,
    37,96,09,02
    """

  Scenario:
    Given that the assembly program "load.txt" is input
    And the program is assembled and stored in memory
    Then there are 4 bytes for every program instruction
    And the memory byte array starting at address zero is
    """
    93,04,80,00,
    93,00,f0,7f,
    23,90,14,00,
    23,91,14,00,
    23,92,14,00,
    23,93,14,00,
    23,94,14,00,
    23,95,14,00,
    03,81,04,00,
    83,a1,04,00,
    03,a2,04,00,
    83,92,04,00,
    03,d3,04,00,
    83,83,04,00,
    03,c4,04,00,
    03,c0,04,00
    """

  Scenario:
    Given that the assembly program "logic.txt" is input
    And the program is assembled and stored in memory
    Then there are 4 bytes for every program instruction
    And the memory byte array starting at address zero is
    """
    93,04,90,7d,
    13,05,80,78,
    b3,70,95,00,
    13,71,85,57,
    b3,61,95,00,
    13,62,85,57,
    b3,42,95,00,
    13,43,85,57
    """

  Scenario:
    Given that the assembly program "shift.txt" is input
    And the program is assembled and stored in memory
    Then there are 4 bytes for every program instruction
    And the memory byte array starting at address zero is
    """
    93,00,f0,ff,
    13,05,a0,00,
    93,03,70,03,
    b3,83,73,02,
    b3,83,73,02,
    b3,83,73,02,
    b3,83,13,02,
    33,91,a3,00,
    13,92,43,00,
    33,d3,a3,00,
    93,d4,33,00,
    33,d6,a3,40,
    13,d7,33,40
    """

  Scenario:
    Given that the assembly program "store.txt" is input
    And the program is assembled and stored in memory
    Then there are 4 bytes for every program instruction
    And the memory byte array starting at address zero is
    """
    93,02,50,ad,
    93,01,30,00,
    93,05,b0,00,
    93,0e,d0,01,
    23,8f,5e,0c,
    a3,a4,55,00,
    a3,10,50,00,
    a3,82,51,00
    """

