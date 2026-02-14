const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const clientSrc = path.join(repoRoot, 'packages', 'client', 'src');

function walk(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const res = path.join(dir, e.name);
    if (e.isDirectory()) {
      results = results.concat(walk(res));
    } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) {
      results.push(res);
    }
  }
  return results;
}

function toPosix(p){ return p.split(path.sep).join('/'); }

const files = walk(clientSrc);
let changed = 0;

for (const abs of files) {
  let src = fs.readFileSync(abs, 'utf8');
  const dir = path.dirname(abs);
  const re = /from\s+(["'])@\/(.*?)\1/g;
  let out = src.replace(re, (m0, quote, impPath) => {
    const target = path.join(clientSrc, impPath);
    let rel = path.relative(dir, target);
    rel = toPosix(rel);
    rel = rel.startsWith('.') ? rel : './' + rel;
    return `from ${quote}${rel}${quote}`;
  });
  if (out !== src) {
    fs.writeFileSync(abs, out, 'utf8');
    changed++;
  }
}
console.log('Converted imports in', changed, 'files');
