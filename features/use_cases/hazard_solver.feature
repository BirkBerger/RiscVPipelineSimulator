Feature: Hazard solver
  Description: input different assembly snippets and make sure hazards are being detected and solved properly

  # data hazard
  Scenario: Store from ALU + memory, load from all four following lines
    Given that the assembly editor holds the content of "loadFromAllGour.txt"
    Then

  # data hazard
  Scenario: Store from ALU + memory, load from 2 registers in the same line


  # no hazard
  Scenario: Branch with register name as label

  # no hazard
  Scenario: Jump with register name as label

  # no hazard
  Scenario: Store from ALU + memory, load from 5th following line

  # no hazard
  Scenario: Store to x0 followed by a load of x0



