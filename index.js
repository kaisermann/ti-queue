var Tiq = require("./dist/tiq.js");

new Tiq()
.add(500, function(){ console.log("Print 1"); })
.add(500, function(){ console.log("Print 2"); })
.add(500, function(){ console.log("Print 3"); })
.add(200, function(){ console.log("Print 4"); })
.before(function() { console.log("Print Before"); })
.after(function()
{ 
    console.log("Print After");
    new Tiq()   
    .setQueue([
        [100, loopHelper],
        [100, loopHelper],
        [100, loopHelper]
        ])
    .before(function() { console.log("Starting loop\n"); })
    .eachLoop(function (count) // The loop iteration number is passed as a parameter
    { 
        console.log("End of one loop iteration " + count);
    })
    .each(function(i, counter, methodExecutionIndex)
    {
        console.log("Loop Queue index: " + i + " - Loop Queue Execution Counter: " + counter + " - " + methodExecutionIndex);
    })
    .after(function() 
    {
        console.log("\nOk, loop ended.\n");
        new Tiq()
        .repeat(100, sequenceHelper, 15)
        .add(1000, function(index){ console.log("\nLets end this.\n"); })
        .repeat(200, function(index) { console.log("Ending"+Array(index+2).join(".")); }, 15)
        .after(function(){ console.log("\nOk, done."); })
        .run();
    })
    .loop(5)
    .run();
})
.run();

function loopHelper(methodExecutionIndex) { console.log("*Show element " + methodExecutionIndex + "*"); }
function sequenceHelper(methodExecutionIndex) { console.log("*Transform element " + methodExecutionIndex + "*");}