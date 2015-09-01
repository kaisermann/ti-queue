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

