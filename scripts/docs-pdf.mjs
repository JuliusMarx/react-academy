// Renders docs/PROJEKT.md (incl. Mermaid diagrams) to docs/PROJEKT.pdf with the local Chrome.
// Usage: node scripts/docs-pdf.mjs   (needs internet for the Mermaid script from jsDelivr)
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { marked } from 'marked';
import { chromium } from '@playwright/test';

const source = 'docs/PROJEKT.md';
const target = 'docs/PROJEKT.pdf';
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Same anchors as GitHub, so the table of contents links work in the PDF too.
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N} -]/gu, '')
    .replace(/ /g, '-');

let markdown = readFileSync(source, 'utf8').replace(/\r/g, '');
// Diagrams go in as empty placeholders (a blank line would end an HTML block in Markdown) and are filled in the page.
const diagrams = [];
markdown = markdown.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => `<div class="mermaid" data-diagram="${diagrams.push(code) - 1}"></div>\n`);

const renderer = new marked.Renderer();
renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  return `<h${depth} id="${slug(text)}">${text}</h${depth}>\n`;
};
const body = marked.parse(markdown, { renderer, gfm: true });

const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><title>Projektdokumentation – Angular & React Academy</title>
<style>
  @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
  body { font: 10.5pt/1.5 "Segoe UI", system-ui, sans-serif; color: #1b1d24; }
  h1 { font-size: 22pt; margin: 0 0 6pt; color: #c2185b; }
  h2 { font-size: 15pt; margin: 18pt 0 6pt; padding-bottom: 3pt; border-bottom: 1.5pt solid #c2185b; break-after: avoid; }
  h3 { font-size: 12pt; margin: 14pt 0 4pt; break-after: avoid; }
  p, li { orphans: 3; widows: 3; }
  a { color: #a3154d; text-decoration: none; }
  code { font: 9pt Consolas, monospace; background: #f1f2f5; padding: 0 3px; border-radius: 3px; }
  pre { background: #f6f7f9; border: 1px solid #e1e4ea; border-radius: 6px; padding: 8pt 10pt; overflow: hidden; white-space: pre-wrap; break-inside: avoid; }
  pre code { background: none; padding: 0; }
  table { width: 100%; border-collapse: collapse; margin: 6pt 0 10pt; font-size: 9.5pt; break-inside: auto; }
  tr { break-inside: avoid; }
  th, td { border: 1px solid #e1e4ea; padding: 4pt 6pt; text-align: left; vertical-align: top; }
  th { background: #f6f7f9; }
  hr { display: none; }
  .mermaid { margin: 8pt 0 12pt; text-align: center; break-inside: avoid; }
  .mermaid svg { max-width: 100% !important; height: auto; max-height: 200mm; }
  .mermaid svg[aria-roledescription="sequence"] { max-width: 92% !important; }
</style></head>
<body>${body}
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs';
  const diagrams = ${JSON.stringify(diagrams).replace(/</g, '\\u003c')};
  for (const el of document.querySelectorAll('.mermaid')) el.textContent = diagrams[el.dataset.diagram];
  mermaid.initialize({ startOnLoad: false, theme: 'neutral', fontFamily: 'Segoe UI, sans-serif' });
  await mermaid.run({ querySelector: '.mermaid' });
  document.body.dataset.ready = 'yes';
</script></body></html>`;

const htmlFile = 'docs/.PROJEKT.print.html';
writeFileSync(htmlFile, html);
const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' });
const page = await browser.newPage();
page.on('console', (message) => message.type() === 'error' && console.error('page:', message.text()));
page.on('pageerror', (error) => console.error('page:', error.message));
await page.goto(pathToFileURL(htmlFile).href);
await page.waitForSelector('body[data-ready="yes"]', { timeout: 30_000 });
await page.pdf({
  path: target,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate:
    '<div style="width:100%;font:8pt Segoe UI,sans-serif;color:#777;padding:0 16mm;display:flex;justify-content:space-between"><span>Angular Academy & React Academy – Projektdokumentation</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
  margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' },
});
await browser.close();
const { rmSync } = await import('node:fs');
rmSync(htmlFile);
console.log('written', target);
