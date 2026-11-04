// Vite plugins for the in-browser test runner – you don't need to change this file.
import { existsSync } from 'node:fs';
import { dirname, relative } from 'node:path';
import type { Plugin } from 'vite';

/** ".../project/src/" for a file inside a project's src folder, otherwise null. */
function srcRootOf(file: string): string | null {
  const normalized = file.replace(/\\/g, '/').split('?')[0];
  const i = normalized.lastIndexOf('/src/');
  return i === -1 ? null : normalized.slice(0, i + 5);
}

/**
 * `import { describe, it, expect, vi } from 'vitest'` resolves to the small Vitest-compatible
 * runner in src/testing/vitest.ts, which runs the tests right in the preview.
 */
export function vitestShim(): Plugin {
  return {
    name: 'react-academy:vitest-shim',
    enforce: 'pre',
    resolveId(id, importer) {
      if (id !== 'vitest' || !importer) return null;
      const root = srcRootOf(importer);
      const shim = root && `${root}testing/vitest.ts`;
      return shim && existsSync(shim) ? shim : null;
    },
  };
}

/**
 * For test exercises: makes the default-exported component of every src/*.tsx file swappable, so
 * the checks can run the learner's tests against deliberately broken versions (mutants).
 */
export function mutantSwap(): Plugin {
  return {
    name: 'react-academy:mutant-swap',
    enforce: 'pre',
    transform(code, id) {
      const file = id.replace(/\\/g, '/').split('?')[0];
      const root = srcRootOf(file);
      if (!root || !file.endsWith('.tsx') || /\.test\.tsx$/.test(file)) return null;
      if (/\/src\/(testing|exercise)\//.test(file) || !existsSync(`${root}exercise/mutants.tsx`)) return null;
      const match = code.match(/export default function (\w+)\s*\(/);
      if (!match) return null;
      const name = match[1];
      let swap = relative(dirname(file), `${root}testing/swap.ts`).replace(/\\/g, '/');
      if (!swap.startsWith('.')) swap = `./${swap}`;
      return (
        code.replace(match[0], `function ${name}__original(`) +
        `\nimport { createElement as __createElement } from 'react';\n` +
        `import { pick as __pick } from '${swap}';\n` +
        `export default function ${name}(props: any) { return __createElement(__pick('${name}', ${name}__original), props); }\n`
      );
    },
  };
}
