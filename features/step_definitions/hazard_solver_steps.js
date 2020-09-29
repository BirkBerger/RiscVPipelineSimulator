const {After, Before, Given, When, Then } = require('cucumber');
const assert = require('assert');
const fs = require('fs')
// const AssemblyParser = require('/Users/birkberger/Documents/DTU/Bachelorprojekt/bachelorThesis2/lib/assemblyParser');


Given('the data hazards are removed from the assembly code', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('{int} data hazards are detected', function (int) {
    // Then('{float} data hazards are detected', function (float) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('there is a forwarding line from line {int} at cc {float} to line {int} at {float}', function (int, float, int2, float2) {
    // Then('there is a forwarding line from line {int} at cc {float} to line {float} at {float}', function (int, float, float2, float3) {
    // Then('there is a forwarding line from line {float} at cc {float} to line {int} at {float}', function (float, float2, int, float3) {
    // Then('there is a forwarding line from line {float} at cc {float} to line {float} at {float}', function (float, float2, float3, float4) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('there is a stall at line {int}', function (int) {
    // Then('there is a stall at line {float}', function (float) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});