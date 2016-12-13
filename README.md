# Tiq - Timed Invocation Queue

## Installation
`bower install ti-queue`

or

`npm install --save ti-queue`

or

`yarn add ti-queue`

## Methods

```javascript
// Creates a new empty tiq
const tiq = new Tiq();

// Creates a new tiq with a specified queue
const tiq = new Tiq([[delay,function],[delay,function],...]);
```

```javascript
// Adds a method to the queue with the specified delay
tiq.add(delay, function(currentQueueIndex,sameMethodCounter, totalExecutions));
```

```javascript
// Add 'numberOfRepetitions' entries of 'function' to the queue
// The callback receives the same parameters as the .add() method
tiq.repeat(numberOfRepetitions, delay, function);
```

```javascript
// Method executed before the queue itself
tiq.before(function);
```

```javascript
// Method executed after the queue ends
tiq.after(function(invocationCounter, loopCounter));
```

```javascript
// Executed after each queue item has been processed
tiq.each(delay, function(currentQueueIndex,sameMethodCounter, totalExecutions));
```

```javascript
// Set the number of loops
// numberOfLoops is optional. If not set, loops indefinitely.
// Default: 1 (no looping)
tiq.loop(numberOfLoops);
```

```javascript
// Executed at the end of each loop iteration
tiq.eachLoop(function(numberOfIterations));
```

```javascript
// Runs the queue
tiq.run();
```

```javascript
// Stops the queue
tiq.stop();
```

### Methods can be chained

```
new Tiq().add(...,...).before(...).after(...).repeat(...,...,...).run();
```

## Example

```javascript
const Tiq = require('./dist/tiq.js');
const noop = () => 0;

new Tiq()
  .add(500, () => console.log('Print 1'))
  .add(500, () => console.log('Print 2'))
  .add(500, () => console.log('Print 3'))
  .add(200, () => console.log('Print 4'))
  .before(() => console.log('Print Before'))
  .after((totalExecutions, loopIndex) => {
    console.log(`Print After ${totalExecutions} executions.`);
    new Tiq([
        [1000, noop],
        [300, noop],
        [300, noop]
      ])
      .before(() => console.log('Starting loop\n'))
      // The loop iteration index is passed as a parameter
      .eachLoop((count) => console.log(`End of one loop iteration ${count}\n`))
      .each((currentQueueIndex, methodExecutionIndex, totalExecutions) =>
        console.log(`Current loop Queue index: ${currentQueueIndex}
Current loop method execution Counter: ${methodExecutionIndex}
Total executions: ${totalExecutions}
`)
      )
      .loop(3)
      .after((totalExecutions, loopIndex) => {
        console.log(`\nOk, ended looping ${loopIndex} times with a total of ${totalExecutions} method executions.\n`);
        new Tiq()
          .add(1000, () => console.log('\nLets end this.\n'))
          .repeat(10, 100, (currentQueueIndex, sameMethodCounter, totalExecutions) => {
            console.log(`Ending ${Array(sameMethodCounter + 2).join('.')}`);
          })
          .after(() => console.log('\nOk, done.'))
          .run();
      })
      .run();
  })
  .run();
```

## Demo

To see the code above being executed just run `node index.js`.
