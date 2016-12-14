# Tiq - Timed Invocation Queue

A very lightweight (+-660 bytes) script to run functions in a certain order with certain delays.

## Installation
`bower install ti-queue`

or

`npm install --save ti-queue`

or

`yarn add ti-queue`

## The Tiq object
```js
Tiq {
  queue: 'The execution queue'
  
  numberOfLoops: 'Number of loops to execute. Defaults to 1'
  timer: 'The current timeout ID'
  
  currentIndex: 'Current index'
  currentLoopIndex: 'Current loop index'
  
  sameMethodCounter: 'Counter of how many times a same method has been executed consecutively'
  executionCounter: 'Counter of how many methods were executed'
    
  lastCallback: 'The last callback that has been executed'
  beforeCallback: 'A callback method executed at the beginning of the queue'
  afterCallback: 'A callback method executed at the very end of the queue'
  
  playing: 'Is the queue running? true or false'
  hasExecutedBeforeCallback: 'Has the before callback been already executed? true or false'
}
```

## Methods

All callbacks have `this` binded to the current Tiq object. The current Tiq instance is also passed as a parameter.

```js
// Creates a new empty tiq
const tiq = new Tiq();

// Creates a new tiq with a specified queue
const tiq = new Tiq([[delay,function],[delay,function],...]);
```

```js
// Adds a method to the queue with the specified delay
tiq.add(delay, function(currentQueueIndex,sameMethodCounter, totalExecutions));
```

```js
// Add 'numberOfRepetitions' entries of 'function' to the queue
// The callback receives the same parameters as the .add() method
tiq.repeat(numberOfRepetitions, delay, function);
```

```js
// Method executed before the queue itself
tiq.before(function);
```

```js
// Method executed after the queue ends
tiq.after(function(invocationCounter, loopCounter));
```

```js
// Executed after each queue item has been processed
tiq.each(delay, function(currentQueueIndex,sameMethodCounter, totalExecutions));
```

```js
// Set the number of loops
// numberOfLoops is optional. If not set, loops indefinitely.
// Default: 1 (no looping)
tiq.loop(numberOfLoops);
```

```js
// Executed at the beginning of each loop iteration (if number of loops > 1)
tiq.beforeLoop(function(numberOfIterations));
```

```js
// Executed at the end of each loop iteration (if number of loops > 1)
tiq.afterLoop(function(numberOfIterations));
```

```js
// Runs the queue
tiq.run();
```

```js
// Stops the queue
tiq.stop();
```

```js
// Resets all of the queue's attributes (the queue array being an exception)
tiq.reset();
```

### Methods can be chained

```
new Tiq().add(...,...).before(...).after(...).repeat(...,...,...).run();
```

## Example

```js
const Tiq = require('./dist/tiq.js');
const noop = () => 0;

new Tiq()
  .add(100, () => console.log('Print 1'))
  .add(100, () => console.log('Print 2'))
  .add(100, () => console.log('Print 3'))
  .add(100, () => console.log('Print 4'))
  .before(() => console.log('Print Before'))
  .after(function () {
    console.log(`Print After ${this.executionCounter} executions.`);
    new Tiq([
        [100, noop],
        [200, noop],
        [300, noop]
      ])
      .before(() => console.log('Starting loop\n'))
      .beforeLoop(o => console.log(`Begining of loop iteration ${o.currentLoopIndex}\n`))
      .afterLoop(o => console.log(`\nEnd of one loop iteration ${o.currentLoopIndex}\n`))
      .each(o => console.log(`Current Index: ${o.currentIndex}`))
      .loop(3)
      .after(function () {
        console.log(`\nOk, ended looping ${this.currentLoopIndex} times with a total of ${this.executionCounter} method executions.\n`);
        new Tiq()
          .before(() => console.log('\nLets end this.\n'))
          .repeat(10, 100, function () {
            console.log(`${this.currentIndex + 1} - Ending ${Array(this.sameMethodCounter + 2).join('.')}`);
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
