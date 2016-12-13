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
