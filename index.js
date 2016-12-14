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
