const CachedMerklePatriciaTree = require('@rainblock/merkle-patricia-tree').CachedMerklePatriciaTree;
const generateStandardTree = require('./utils').generateStandardTree;

const start = 1000000
const end = 10000000
const increment = start
const precision = 5

for (let i = start; i <= end; i += increment) {
  let pruneDepth = 10;
  const tree = new CachedMerklePatriciaTree({putCanDelete: false}, pruneDepth);
  const ops = generateStandardTree(i);
  const root = tree.batch(ops);

  let avgDepth = 0;
  let maxDepth = 0;
  for (let i = 0; i < ops.length; i++) {
    const depth = tree.get(ops[i].key).proof.length;
    avgDepth += depth;
    maxDepth = (maxDepth > depth)? maxDepth: depth;
  }
  avgDepth /= ops.length;
  console.log(i, root.toString('hex'), avgDepth, maxDepth);
  const beforeNodes = tree.nodeCount();
  const beforeSize = tree.size();

  pruneDepth = maxDepth - 2;
  tree.maxCacheDepth = pruneDepth;
  while (pruneDepth > avgDepth - 3) {
    tree.maxCacheDepth = pruneDepth;
    
    tree.pruneStateCache();
    const afterNodes = tree.nodeCount();
    const afterSize = tree.size();
    
    console.log(pruneDepth, beforeNodes, afterNodes, Number(((beforeNodes - afterNodes)*100/beforeNodes).toFixed(precision)),
        beforeSize, afterSize, Number(((beforeSize - afterSize)*100/beforeSize).toFixed(2)));
    
    pruneDepth -= 1
  }
}
