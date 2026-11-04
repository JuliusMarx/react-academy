// Moves the correct quiz answer of every question to a deterministic position (same in DE and EN).
// Usage: node scripts/shuffle-quiz-answers.cjs content   (run after writing the German lesson, before translating)
// Idempotent: a question whose answer is already at its target position is left alone.
const fs = require('fs');
const path = require('path');
const yaml = require(require.resolve('js-yaml', { paths: [process.cwd()] }));

const contentDir = process.argv[2];
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const counts = {};
let changed = 0;

for (const lang of ['de', 'en']) {
  for (const chapter of fs.readdirSync(path.join(contentDir, lang))) {
    for (const file of fs.readdirSync(path.join(contentDir, lang, chapter))) {
      if (file.startsWith('_')) continue;
      const p = path.join(contentDir, lang, chapter, file);
      const lines = fs.readFileSync(p, 'utf8').split('\n');
      let q = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i] === '---' && i > 0) break; // end of frontmatter
        if (/^  - question:/.test(lines[i])) q++;
        const opt = lines[i].match(/^    options: (\[.*\])\s*$/);
        if (!opt) continue;
        const ansLine = lines.findIndex((l, j) => j > i && /^    answer: \d+\s*$/.test(l));
        const options = yaml.load(opt[1]);
        const answer = Number(lines[ansLine].match(/\d+/)[0]);
        const target = hash(`${chapter}/${file}#${q}`) % options.length;
        if (target !== answer) {
          [options[answer], options[target]] = [options[target], options[answer]];
          lines[i] = `    options: ${JSON.stringify(options)}`;
          lines[ansLine] = `    answer: ${target}`;
          changed++;
        }
        if (lang === 'de') counts[target] = (counts[target] ?? 0) + 1;
      }
      fs.writeFileSync(p, lines.join('\n'));
    }
  }
}
console.log(`changed ${changed} questions; DE distribution:`, counts);
