const fs = require('fs');
const path = require('path');
const glob = require('glob');

const repoRoot = path.resolve(__dirname, '..');
const clientSrc = path.join(repoRoot, 'packages', 'client', 'src');

const files = glob.sync('**/*.{ts,tsx,js,jsx}', { cwd: clientSrc, nodir: true });
let changed = 0;

function toPosix(p){ return p.split(path.sep).join('/'); }

for (const f of files) {
  const abs = path.join(clientSrc, f);
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
process.exit(0);
