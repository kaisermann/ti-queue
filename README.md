# Tiq - Timed Invocation Queue

## Methods
```` 
// Creates a new tiq
var tiq = new Tiq();

// Adds a method to the queue with the specified delay
tiq.add(delay, function);

// Starts the queue
tiq.start();

// Start the queue and loop it
tiq.loop();

// Stops the queue
tiq.pause();

// Sets the whole queue through an array of [delay, function]
tiq.setQueue([[delay,function],[delay,function],...]);

// Method executed before the queue itself
tiq.before(function);

// Method executed after the queue ends
tiq.after(function);

// Executed at the end of a loop iteration
tiq.iteration(function(numberOfIterations));

// Executed after each queue item has been processed
tiq.each(function(itemIndex, numberOfQueueItensProcessed));
```` 

#### Methods can be chained together
```` 
new Tiq().add(...,...).add(...,...).add(...,...).before(...).after(...).start();
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
.before(function() { console.log("Print 0"); })
.after(function()
{ 
	new Tiq()
	.setQueue([
		[100, function() { console.log("Loop 1"); }],
		[100, function() { console.log("Loop 2"); }],
		[100, function() { console.log("Loop 3"); }],
		])
	.before(function(){console.log("Starting loop");})
	.after(function(){console.log("There's no after while looping (this will never be executed).");})
	.iteration(function (count) // The iteration number is passed as a parameter
	{ 
		console.log("End of one loop iteration " + count);
		if(count==5)
			this.stop();
	})
	.each(function(i, counter)
	{
		console.log("Loop Queue index: " + i + " - Loop Queue Execution Counter: " + counter);
	})
	.loop();
})
.start();
````