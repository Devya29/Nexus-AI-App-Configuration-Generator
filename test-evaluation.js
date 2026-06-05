
const { runEvaluation } = require('./src/evaluation');

async function main() {
  await runEvaluation();
}

main().catch(err => console.error(err));
