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

// Executed at the end of a loop iteration
tiq.iteration(function(numberOfIterations));

// Executed after each queue item has been processed
tiq.each(function(itemIndex, numberOfQueueItensProcessed, methodExecutionIndex));

// Starts the queue
tiq.start();

// Stops the queue
tiq.stop();

// Start the queue and loop it
// numberOfLoops is optional. If not set, loops indefinitely.
tiq.loop(numberOfLoops);
```` 

#### Methods can be chained
```` 
new Tiq().add(...,...).before(...).after(...).repeat(...,...,...).start();
```` 


## Example
```` 
var Tiq = require("./dist/tiq.js");

new Tiq()
.add(500, function(){ console.log("Print 1"); })
.add(500, function(){ console.log("Print 2"); })
.add(500, function(){ console.log("Print 3"); })
.add(200, function(){ console.log("Print 4"); })
.each(function(i, counter)
{
	console.log("Queue index: " + i + " - Queue Execution Counter: " + counter);
})
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
	.before(function() { console.log("Starting loop"); })
	.iteration(function (count) // The iteration number is passed as a parameter
	{ 
		console.log("End of one loop iteration " + count);
	})
	.each(function(i, counter, methodExecutionIndex)
	{
		console.log("Loop Queue index: " + i + " - Loop Queue Execution Counter: " + counter + " - " + methodExecutionIndex);
	})
	.after(function() 
	{
		console.log("Ok, loop ended.");
		new Tiq()
		.repeat(100, sequenceHelper, 15)
		.add(1000, function(index){ console.log("Lets end this."); })
		.repeat(200, function(index) { console.log("Ending"+Array(index+2).join(".")); }, 15)
		.after(function(){ console.log("Ok, done."); })
		.start();
	})
	.loop(5);
})
.start();

function loopHelper(methodExecutionIndex) { console.log("*Show element " + methodExecutionIndex + "*"); }
function sequenceHelper(methodExecutionIndex) { console.log("*Transform element " + methodExecutionIndex + "*");}
````