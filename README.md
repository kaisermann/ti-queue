# Tiq - Timed Invocation Queue

## Methods
```` 
// Creates a new tiq
var tiq = new Tiq();

// Adds a method to the queue with the specified delay
tiq.add(delay, function);

// Add 'numberOfRepetitions' entries of 'function' to the queue
tiq.repeat(delay, function(methodExecutionIndex), numberOfRepetitions);

// Sets the whole queue through an array of [delay, function]
tiq.setQueue([[delay,function],[delay,function],...]);

// Method executed before the queue itself
tiq.before(function);

// Method executed after the queue ends
tiq.after(function);
// Executed after each queue item has been processed
tiq.each(function(itemIndex, numberOfQueueItensProcessed, methodExecutionIndex));

// Set the number of loops
// numberOfLoops is optional. If not set, loops indefinitely.
tiq.loop(numberOfLoops);

// Executed at the end of each loop iteration
tiq.eachLoop(function(numberOfIterations));

// Runs the queue
tiq.run();

// Stops the queue
tiq.stop();
```` 

#### Methods can be chained
```` 
new Tiq().add(...,...).before(...).after(...).repeat(...,...,...).run();
```` 


## Example
```` 
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
````