// Materializes every example into one Vite workspace so they can be type-checked and every
// exercise can be run twice – with the starter code and with the solution.
//
//   node scripts/verify-exercises.mjs <outDir>
//   cd <outDir> && npm install && npx tsc && npx vite
//
// Then open http://localhost:5173/ – the runner page loads every exercise variant in a frame and
// lists the check results: each starter must fail at least one check, each solution must pass all.
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const EXAMPLES = join(ROOT, 'examples');
const out = resolve(process.argv[2] ?? '');
if (!process.argv[2]) throw new Error('Usage: node scripts/verify-exercises.mjs <outDir>');

const ids = (await readdir(EXAMPLES, { withFileTypes: true }))
  .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
  .map((e) => e.name)
  .sort();

const variants = [];
await mkdir(out, { recursive: true });
for (const entry of await readdir(out)) {
  if (entry !== 'node_modules' && entry !== 'package-lock.json') await rm(join(out, entry), { recursive: true, force: true });
}

async function materialize(target, layers, urlPath) {
  for (const layer of layers) {
    if (existsSync(layer)) await cp(layer, target, { recursive: true, filter: (src) => !/[\\/](solution|meta\.json)$/.test(src) || src === layer });
  }
  // Every variant is served from a sub-path of the shared dev server. The app itself expects to run
  // at "/" (like in StackBlitz, e.g. for React Router), so the URL is reset before it starts – and the
  // entry script therefore needs its absolute path.
  const html = join(target, 'index.html');
  const resetUrl = "<script>history.replaceState(null, '', '/');</script>";
  // Hidden pages (e.g. a background browser tab) never fire requestAnimationFrame – fall back to timers.
  const rafShim = '<script>if (document.hidden) window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);</script>';
  await writeFile(
    html,
    (await readFile(html, 'utf8'))
      .replace('src="/src/main.tsx"', `src="/${urlPath}/src/main.tsx"`)
      .replace('</head>', `  ${rafShim}\n    ${resetUrl}\n  </head>`),
  );
  for (const file of ['package.json', 'vite.config.ts', 'tsconfig.json']) await rm(join(target, file), { force: true });
}

for (const id of ids) {
  const dir = join(EXAMPLES, id);
  const meta = existsSync(join(dir, 'meta.json')) ? JSON.parse(await readFile(join(dir, 'meta.json'), 'utf8')) : {};
  const base = [join(EXAMPLES, '_base')];
  if (meta.exercise) {
    const kit = join(EXAMPLES, '_exercise-kit');
    await materialize(join(out, id, 'starter'), [...base, dir, kit], `${id}/starter`);
    await materialize(join(out, id, 'solution'), [...base, dir, join(dir, 'solution'), kit], `${id}/solution`);
    variants.push(`${id}/starter`, `${id}/solution`);
  } else {
    await materialize(join(out, id, 'example'), [...base, dir], `${id}/example`);
  }
}

const basePkg = JSON.parse(await readFile(join(EXAMPLES, '_base/package.json'), 'utf8'));
// One shared node_modules: the base packages plus every example's extra "dependencies".
const extraDeps = {};
for (const id of ids) {
  const metaPath = join(EXAMPLES, id, 'meta.json');
  if (existsSync(metaPath)) Object.assign(extraDeps, JSON.parse(await readFile(metaPath, 'utf8')).dependencies);
}
await writeFile(
  join(out, 'package.json'),
  JSON.stringify({ ...basePkg, name: 'verify-exercises', dependencies: { ...basePkg.dependencies, ...extraDeps } }, null, 2),
);
// One shared Vite config for all variants. Examples with their own vite.config.ts only add plugins
// (e.g. Tailwind) or dev-server options, so the plugins of every example are combined here.
const usesTailwind = '@tailwindcss/vite' in extraDeps;
await writeFile(
  join(out, 'vite.config.ts'),
  `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
${usesTailwind ? "import tailwindcss from '@tailwindcss/vite';\n" : ''}
export default defineConfig({
  plugins: [react()${usesTailwind ? ', tailwindcss()' : ''}],
});
`,
);
const tsconfig = JSON.parse(await readFile(join(EXAMPLES, '_base/tsconfig.json'), 'utf8'));
await writeFile(join(out, 'tsconfig.json'), JSON.stringify({ ...tsconfig, include: ['*/*/src'] }, null, 2));

await writeFile(
  join(out, 'index.html'),
  `<!doctype html>
<meta charset="utf-8">
<title>Exercise verification</title>
<style>body{font:14px system-ui;margin:1rem} iframe{width:240px;height:160px;border:1px solid #ccc;margin:2px} .bad{color:crimson} .ok{color:green}</style>
<h1>Exercise verification</h1>
<table id="results" border="1" cellpadding="4"><tr><th>Variant</th><th>Result</th><th>Failed checks</th></tr></table>
<script type="module">
const variants = ${JSON.stringify(variants)};
const results = {};
window.__verify = { done: false, results, problems: [] };
const table = document.getElementById('results');
for (const variant of variants) {
  const [exercise, kind] = variant.split('/');
  const result = await new Promise((resolve) => {
    const frame = document.createElement('iframe');
    const timer = setTimeout(() => resolve(null), 20000);
    const onMessage = (e) => {
      if (e.source !== frame.contentWindow || e.data?.exercise !== exercise) return;
      clearTimeout(timer);
      removeEventListener('message', onMessage);
      resolve(e.data.results);
    };
    addEventListener('message', onMessage);
    frame.src = '/' + variant + '/';
    document.body.append(frame);
  });
  results[variant] = result;
  const failed = result ? result.filter((r) => !r.passed) : null;
  const ok = result && (kind === 'starter' ? failed.length > 0 : failed.length === 0);
  if (!ok) window.__verify.problems.push(variant);
  const row = table.insertRow();
  row.className = ok ? 'ok' : 'bad';
  row.insertCell().textContent = variant;
  row.insertCell().textContent = !result ? 'timeout' : ok ? 'as expected' : 'UNEXPECTED';
  row.insertCell().textContent = failed ? failed.map((f) => f.id + ': ' + f.message).join(' | ') : '';
}
window.__verify.done = true;
</script>
`,
);
console.log(`Materialized ${ids.length} examples (${variants.length / 2} exercises) into ${out}`);
