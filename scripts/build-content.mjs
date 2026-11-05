// Reads content/ and examples/ and generates TypeScript modules under
// src/app/content/generated/ that the app imports (lazy-loaded per lesson).
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { createHighlighter } from 'shiki';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT_DIR = join(ROOT, 'content');
const EXAMPLES_DIR = join(ROOT, 'examples');
const OUT_DIR = join(ROOT, 'src/app/content/generated');
const LANGS = ['de', 'en'];

const highlighter = await createHighlighter({
  themes: ['github-light-default', 'github-dark-default'],
  langs: ['ts', 'tsx', 'js', 'jsx', 'html', 'css', 'json', 'bash'],
});

const LANG_ALIASES = { typescript: 'ts', javascript: 'js', sh: 'bash', shell: 'bash' };

/** h2 headings of the lesson currently being rendered – reset per lesson, used for the table of contents. */
let headings = [];

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const marked = new Marked({
  renderer: {
    heading({ tokens, depth }) {
      const html = this.parser.parseInline(tokens);
      if (depth !== 2 && depth !== 3) return `<h${depth}>${html}</h${depth}>\n`;
      const text = html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      let id = slugify(text) || 'section';
      for (let n = 2; headings.some((h) => h.id === id); n++) id = `${slugify(text)}-${n}`;
      headings.push({ id, text, depth });
      return `<h${depth} id="${id}">${html}</h${depth}>\n`;
    },
    code({ text, lang }) {
      const requested = (lang ?? '').trim().split(/\s+/)[0] || 'text';
      const shikiLang = LANG_ALIASES[requested] ?? requested;
      const html = highlighter.getLoadedLanguages().includes(shikiLang)
        ? highlighter.codeToHtml(text, {
            lang: shikiLang,
            themes: { light: 'github-light-default', dark: 'github-dark-default' },
            defaultColor: false,
          })
        : `<pre class="shiki"><code>${escapeHtml(text)}</code></pre>`;
      return `<div class="code-block"><button type="button" class="copy-button" data-copy>Copy</button>${html}</div>`;
    },
  },
});

/** Strips the numeric ordering prefix: "01-introduction" -> "introduction". */
const slugOf = (name) => name.replace(/^\d+-/, '').replace(/\.md$/, '');

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Quiz questions and options often contain markup like "<input #search />" that must stay text,
 * so only `backticks` become <code> – everything else is escaped.
 */
const inlineCode = (s) => escapeHtml(s).replace(/`([^`]+)`/g, '<code>$1</code>');

/** GitHub-style alerts: "> [!TIP]" blockquotes become callout boxes. */
function renderCallouts(html) {
  return html.replace(
    /<blockquote>\s*<p>\[!(NOTE|TIP|WARNING)\]\s*/g,
    (_, kind) => `<blockquote class="callout callout-${kind.toLowerCase()}"><p>`,
  );
}

/**
 * Splits the markdown body at "::tryit{example-id}" lines so the app can render
 * an interactive component in between the static HTML segments.
 */
function renderSegments(markdown, exampleIds, file, lang) {
  const segments = [];
  const parts = markdown.split(/^::tryit\{([\w-]+)\}\s*$/m);
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      if (!exampleIds.has(part)) throw new Error(`${file}: unknown example "${part}"`);
      segments.push({ type: 'tryit', example: part });
    } else if (part.trim()) {
      segments.push({ type: 'html', html: localize(renderCallouts(marked.parse(part)), lang) });
    }
  });
  return segments;
}

const COPY_LABEL = { de: 'Kopieren', en: 'Copy' };
const localize = (html, lang) => html.replaceAll('data-copy>Copy</button>', `data-copy>${COPY_LABEL[lang]}</button>`);

async function sortedDirs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && !e.name.startsWith('_')).map((e) => e.name).sort();
}

async function readExampleFiles(dir, base = dir) {
  const files = {};
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    // solution/ of an exercise is shown on the course page, not shipped in the project.
    if (entry.isDirectory() && !(dir === base && entry.name === 'solution')) {
      Object.assign(files, await readExampleFiles(path, base));
    } else if (entry.isFile() && entry.name !== 'meta.json') {
      files[relative(base, path).replace(/\\/g, '/')] = await readFile(path, 'utf8');
    }
  }
  return files;
}

const CODE_LANG = { ts: 'ts', tsx: 'tsx', js: 'js', jsx: 'jsx', html: 'html', css: 'css', json: 'json' };

/** Highlighted solution files of an exercise, rendered at build time. */
async function renderSolution(dir) {
  if (!existsSync(dir)) return [];
  const files = await readExampleFiles(dir);
  return Object.entries(files).map(([path, code]) => ({
    path,
    html: highlighter.codeToHtml(code, {
      lang: CODE_LANG[path.split('.').pop()] ?? 'text',
      themes: { light: 'github-light-default', dark: 'github-dark-default' },
      defaultColor: false,
    }),
  }));
}

/** Extra npm packages of an example ("dependencies" in meta.json) are added to the base package.json. */
function withDependencies(packageJson, dependencies) {
  const pkg = JSON.parse(packageJson);
  pkg.dependencies = { ...pkg.dependencies, ...dependencies };
  return JSON.stringify(pkg, null, 2) + '\n';
}

/** Exercise projects additionally get the check kit (examples/_exercise-kit): it reloads on every save and runs the checks. */
function withExerciseKit(files, kitFiles) {
  return { ...files, ...kitFiles };
}

async function buildExamples() {
  const baseFiles = await readExampleFiles(join(EXAMPLES_DIR, '_base'));
  const kitFiles = await readExampleFiles(join(EXAMPLES_DIR, '_exercise-kit'));
  // Test examples ("kit": "test") run their *.test.tsx files in the preview (examples/_test-kit);
  // test exercises grade the learner's tests against mutants (examples/_test-exercise-kit).
  const kits = {
    test: {
      files: await readExampleFiles(join(EXAMPLES_DIR, '_test-kit')),
      exercise: await readExampleFiles(join(EXAMPLES_DIR, '_test-exercise-kit')),
    },
  };
  const ids = await sortedDirs(EXAMPLES_DIR);
  /** exercise id → check ids declared in its checks.ts */
  const exercises = new Map();
  await mkdir(join(OUT_DIR, 'examples'), { recursive: true });
  for (const id of ids) {
    const dir = join(EXAMPLES_DIR, id);
    const meta = existsSync(join(dir, 'meta.json')) ? JSON.parse(await readFile(join(dir, 'meta.json'), 'utf8')) : {};
    const kit = meta.kit ? kits[meta.kit] : undefined;
    if (meta.kit && !kit) throw new Error(`examples/${id}: unknown kit "${meta.kit}"`);
    const ownFiles = { ...baseFiles, ...kit?.files, ...(await readExampleFiles(dir)) };
    if (meta.dependencies) ownFiles['package.json'] = withDependencies(ownFiles['package.json'], meta.dependencies);
    if (meta.exercise) {
      const checks = ownFiles['src/exercise/checks.tsx'];
      if (!checks) throw new Error(`examples/${id}: exercises need src/exercise/checks.tsx`);
      if (!checks.includes(`exercise = '${id}'`)) throw new Error(`examples/${id}: checks.tsx must export exercise = '${id}'`);
      exercises.set(id, [...checks.matchAll(/\bid: '([\w-]+)'/g)].map((m) => m[1]));
    }
    const example = {
      id,
      openFile: meta.openFile ?? 'src/App.tsx',
      files: meta.exercise ? withExerciseKit(ownFiles, kit?.exercise ?? kitFiles) : ownFiles,
      ...(meta.exercise ? { solution: await renderSolution(join(dir, 'solution')) } : {}),
    };
    await writeTs(join(OUT_DIR, 'examples', `${id}.ts`), `export default ${JSON.stringify(example, null, 2)} satisfies Example;`, "import type { Example } from '../../content.model';");
  }
  const loaders = ids.map((id) => `  '${id}': () => import('./examples/${id}').then((m) => m.default),`).join('\n');
  await writeTs(
    join(OUT_DIR, 'examples.ts'),
    `export const exampleLoaders: Record<string, () => Promise<Example>> = {\n${loaders}\n};`,
    "import type { Example } from '../content.model';",
  );
  return { exampleIds: new Set(ids), exercises };
}

async function buildLessons(exampleIds, exercises) {
  const curriculum = {};
  const loaders = [];
  const searchDocs = Object.fromEntries(LANGS.map((l) => [l, []]));
  const placement = Object.fromEntries(LANGS.map((l) => [l, []]));
  for (const lang of LANGS) {
    curriculum[lang] = [];
    const langDir = join(CONTENT_DIR, lang);
    for (const chapterDir of await sortedDirs(langDir)) {
      const chapterSlug = slugOf(chapterDir);
      const chapterMeta = matter(await readFile(join(langDir, chapterDir, '_chapter.md'), 'utf8')).data;
      const chapter = { slug: chapterSlug, title: chapterMeta.title, description: chapterMeta.description ?? '', lessons: [] };
      const files = (await readdir(join(langDir, chapterDir))).filter((f) => f.endsWith('.md') && !f.startsWith('_')).sort();
      const quizzes = new Map();
      for (const file of files) {
        const path = join(langDir, chapterDir, file);
        const raw = await readFile(path, 'utf8');
        const { data, content } = matter(raw);
        assertNoYamlComments(raw, data, relative(ROOT, path));
        const lessonSlug = slugOf(file);
        const id = `${chapterSlug}/${lessonSlug}`;
        headings = [];
        const segments = renderSegments(content, exampleIds, relative(ROOT, path), lang);
        assertRenderable(segments, data, relative(ROOT, path));
        const lesson = {
          id,
          title: data.title,
          minutes: data.minutes ?? 5,
          toc: headings.filter((h) => h.depth === 2).map(({ id, text }) => ({ id, text })),
          segments,
          ...buildSummary(data.summary, relative(ROOT, path), lang),
          quiz: (data.quiz ?? []).map((q) => ({
            ...q,
            question: inlineCode(String(q.question)),
            options: q.options.map((o) => inlineCode(String(o))),
            explanation: q.explanation && marked.parseInline(q.explanation),
          })),
          ...(data.exercise ? { exercise: buildExercise(data.exercise, exercises, relative(ROOT, path), lang) } : {}),
        };
        chapter.lessons.push({ id, slug: lessonSlug, title: data.title, minutes: lesson.minutes, summaryMinutes: lesson.summaryMinutes });
        const out = join(OUT_DIR, 'lessons', lang, chapterSlug, `${lessonSlug}.ts`);
        await mkdir(join(out, '..'), { recursive: true });
        await writeTs(out, `export default ${JSON.stringify(lesson, null, 2)} satisfies Lesson;`, "import type { Lesson } from '../../../../content.model';");
        loaders.push(`  '${lang}/${id}': () => import('./lessons/${lang}/${id}').then((m) => m.default),`);
        searchDocs[lang].push(...searchDocsFor(lesson, chapter));
        quizzes.set(lessonSlug, lesson.quiz);
      }
      placement[lang].push(placementQuestion(chapterMeta.placement, chapter.slug, quizzes, join(lang, chapterDir, '_chapter.md')));
      curriculum[lang].push(chapter);
    }
  }
  assertSameStructure(curriculum);
  await mkdir(join(OUT_DIR, 'search'), { recursive: true });
  for (const lang of LANGS) {
    await writeTs(
      join(OUT_DIR, 'search', `${lang}.ts`),
      `export default ${JSON.stringify(searchDocs[lang])} satisfies SearchDoc[];`,
      "import type { SearchDoc } from '../../content.model';",
    );
  }
  await writeTs(
    join(OUT_DIR, 'search.ts'),
    `export const searchLoaders: Record<Lang, () => Promise<SearchDoc[]>> = {\n` +
      LANGS.map((l) => `  ${l}: () => import('./search/${l}').then((m) => m.default),`).join('\n') +
      '\n};',
    "import type { Lang, SearchDoc } from '../content.model';",
  );
  await mkdir(join(OUT_DIR, 'placement'), { recursive: true });
  for (const lang of LANGS) {
    await writeTs(
      join(OUT_DIR, 'placement', `${lang}.ts`),
      `export default ${JSON.stringify(placement[lang], null, 2)} satisfies PlacementQuestion[];`,
      "import type { PlacementQuestion } from '../../content.model';",
    );
  }
  await writeTs(
    join(OUT_DIR, 'placement.ts'),
    `export const placementLoaders: Record<Lang, () => Promise<PlacementQuestion[]>> = {\n` +
      LANGS.map((l) => `  ${l}: () => import('./placement/${l}').then((m) => m.default),`).join('\n') +
      '\n};',
    "import type { Lang, PlacementQuestion } from '../content.model';",
  );
  await writeTs(
    join(OUT_DIR, 'curriculum.ts'),
    `export const curriculum: Record<Lang, Chapter[]> = ${JSON.stringify(curriculum, null, 2)};\n\n` +
      `export const lessonLoaders: Record<string, () => Promise<Lesson>> = {\n${loaders.join('\n')}\n};`,
    "import type { Chapter, Lang, Lesson } from '../content.model';",
  );
  return loaders.length;
}

/**
 * In unquoted YAML, " #" starts a comment – "Variables with @let and #ref" silently becomes
 * "Variables with @let and". Fail the build when a parsed value is followed by " #" in the source.
 */
function assertNoYamlComments(raw, data, file) {
  const values = [data.title, ...(data.quiz ?? []).flatMap((q) => [q.question, ...q.options])];
  for (const value of values) {
    if (typeof value === 'string' && raw.includes(`${value} #`)) {
      throw new Error(`${file}: "${value} #…" was cut off by YAML – put the value in quotes.`);
    }
  }
}

/** Catches markup that renders badly: empty table header cells (an axe violation) and bold in quiz texts. */
function assertRenderable(segments, data, file) {
  if (/<th[^>]*><\/th>/.test(JSON.stringify(segments))) {
    throw new Error(`${file}: a table has an empty header cell – give the first column a heading.`);
  }
  const quizTexts = (data.quiz ?? []).flatMap((q) => [q.question, ...q.options]);
  const bold = quizTexts.find((text) => String(text).replace(/`[^`]*`/g, '').includes('**'));
  if (bold) throw new Error(`${file}: quiz texts only support inline code, not **bold**: "${bold}"`);
}

const toPlainText = (html) =>
  html
    .replace(/<button[^>]*data-copy[^>]*>.*?<\/button>/g, '')
    // Block ends become spaces; inline tags (e.g. the many <span>s of highlighted code) vanish.
    .replace(/<\/(p|li|h\d|td|th|pre|div|tr|blockquote)>|<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    // Shiki writes some characters as numeric entities, e.g. "&#x3C;" for "<".
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * One search document per lesson section (split at h2), plus one for the exercise – so a hit
 * can link straight to the matching heading.
 */
function searchDocsFor(lesson, chapter) {
  const html = lesson.segments.filter((s) => s.type === 'html').map((s) => s.html).join('\n');
  const parts = html.replace(/<h1>.*?<\/h1>/s, '').split(/<h2 id="([^"]+)">(.*?)<\/h2>/s);
  const base = { lesson: lesson.id, lessonTitle: lesson.title, chapter: chapter.title };
  const docs = [{ ...base, id: `${lesson.id}#`, anchor: '', heading: '', text: toPlainText(parts[0]) }];
  for (let i = 1; i < parts.length; i += 3) {
    docs.push({ ...base, id: `${lesson.id}#${parts[i]}`, anchor: parts[i], heading: toPlainText(parts[i + 1]), text: toPlainText(parts[i + 2] ?? '') });
  }
  if (lesson.exercise) {
    docs.push({
      ...base,
      id: `${lesson.id}#exercise-title`,
      anchor: 'exercise-title',
      heading: lesson.exercise.title,
      text: toPlainText(lesson.exercise.task),
      exercise: true,
    });
  }
  return docs;
}

/**
 * "summary:" frontmatter – the short version of a lesson for the quick course: a few key points
 * and the most important code. Required, so the quick course never has gaps.
 */
/** The placement test asks one quiz question per chapter, picked in _chapter.md. */
function placementQuestion(def, chapter, quizzes, file) {
  const question = def && quizzes.get(def.lesson)?.[def.question];
  if (!question) {
    throw new Error(
      `${file}: every chapter needs "placement: { lesson: <lesson slug>, question: <index> }" pointing to an existing quiz question.`,
    );
  }
  // All questions are on one page, so spread the correct answers over the positions:
  // rotate the options (keeping their order) so the answer lands at a position derived from the chapter slug –
  // fixed across builds and languages, but without a visible pattern.
  const n = question.options.length;
  const target = [...chapter].reduce((hash, c) => (hash * 31 + c.charCodeAt(0)) % 1000003, 7) % n;
  const shift = (question.answer - target + n) % n;
  const options = [...question.options.slice(shift), ...question.options.slice(0, shift)];
  return { chapter, lesson: `${chapter}/${def.lesson}`, question: { ...question, options, answer: target } };
}

function buildSummary(summary, file, lang) {
  if (typeof summary !== 'string' || !summary.trim()) {
    throw new Error(`${file}: every lesson needs a "summary: |-" block for the quick course.`);
  }
  const html = localize(renderCallouts(marked.parse(summary)), lang);
  const words = toPlainText(html).split(' ').length;
  return { summary: html, summaryMinutes: Math.max(1, Math.round(words / 150)) };
}

/** Validates the "exercise:" frontmatter against the exercise project and renders its texts. */
function buildExercise(def, exercises, file, lang) {
  const checkIds = exercises.get(def.example);
  if (!checkIds) throw new Error(`${file}: "${def.example}" is not an exercise (meta.json needs "exercise": true)`);
  const labels = def.checks ?? {};
  const missing = checkIds.filter((id) => !labels[id]);
  const unknown = Object.keys(labels).filter((id) => !checkIds.includes(id));
  if (missing.length || unknown.length) {
    throw new Error(`${file}: exercise checks out of sync – missing labels: [${missing}], unknown: [${unknown}]`);
  }
  return {
    example: def.example,
    title: def.title,
    task: localize(renderCallouts(marked.parse(def.task ?? '')), lang),
    checks: checkIds.map((id) => ({ id, label: marked.parseInline(labels[id]) })),
  };
}

/** The language switch keeps the URL, so every lesson must exist in every language. */
function assertSameStructure(curriculum) {
  const idsOf = (lang) => curriculum[lang].flatMap((c) => c.lessons.map((l) => l.id)).join('\n');
  const [first, ...others] = LANGS;
  for (const lang of others) {
    if (idsOf(lang) !== idsOf(first)) {
      throw new Error(`Lessons in content/${lang} differ from content/${first} – every lesson needs both languages.`);
    }
  }
}

async function writeTs(path, body, imports) {
  await writeFile(path, `// Generated by scripts/build-content.mjs – do not edit.\n${imports}\n\n${body}\n`);
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });
const { exampleIds, exercises } = await buildExamples();
const lessonCount = await buildLessons(exampleIds, exercises);
console.log(`Content built: ${lessonCount} lessons, ${exampleIds.size} examples (${exercises.size} exercises).`);
