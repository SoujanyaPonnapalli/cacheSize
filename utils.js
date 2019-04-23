const hashAsBuffer = require('bigint-hash').hashAsBuffer;
const HashType = require('bigint-hash').HashType;

module.exports = {
  generateStandardTree,
}

function generateStandardTree (rounds) {
  let seed = Buffer.alloc(32, 0 + Math.floor(Math.random() * (9)));
  let batchOps = [];
  for (let i = 1; i <= rounds; i++) {
    seed = hashAsBuffer(HashType.KECCAK256, seed);
    batchOps.push({
      key: seed,
      val: hashAsBuffer(HashType.KECCAK256, seed),
      value: hashAsBuffer(HashType.KECCAK256, seed),
      type: 'put'
    });
  }
  return batchOps;
};
