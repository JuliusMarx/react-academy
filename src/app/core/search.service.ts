import { Service } from '@angular/core';
import type MiniSearch from 'minisearch';
import { Lang, SearchDoc } from '../content/content.model';
import { searchLoaders } from '../content/generated/search';

export interface SnippetPart {
  text: string;
  hit: boolean;
}

export interface SearchHit {
  doc: SearchDoc;
  snippet: SnippetPart[];
}

const SNIPPET_LENGTH = 150;

/** Full-text search over all lesson sections. Index and library are loaded on first use. */
@Service()
export class SearchService {
  private readonly indexes = new Map<Lang, Promise<MiniSearch<SearchDoc>>>();

  /** Starts loading the index in the background, e.g. when the search dialog opens. */
  preload(lang: Lang): void {
    void this.index(lang);
  }

  async search(lang: Lang, query: string, limit = 8): Promise<SearchHit[]> {
    if (query.trim().length < 2) return [];
    const index = await this.index(lang);
    // Exact and prefix matches first. Only if that finds nothing, tolerate typos – fuzzy matching
    // on every search would bury "asReadonly" under unrelated "readonly" hits.
    // (0.4: swapped letters like "singal" count as two edits.)
    let results = index.search(query);
    if (results.length === 0) results = index.search(query, { fuzzy: (term) => (term.length > 3 ? 0.4 : false) });
    return results
      .slice(0, limit)
      .map((result) => {
        const doc = result as unknown as SearchDoc;
        // Fuzzy matches ("readonly" for "asReadonly") would clutter the highlight – prefer words
        // that start with what was typed, and fall back to all matched terms (e.g. for typos).
        const typed = result.terms.filter((term) => result.queryTerms.some((q) => term.startsWith(q)));
        return { doc, snippet: snippet(doc.text, typed.length ? typed : result.terms) };
      });
  }

  private index(lang: Lang): Promise<MiniSearch<SearchDoc>> {
    let index = this.indexes.get(lang);
    if (!index) {
      index = Promise.all([import('minisearch'), searchLoaders[lang]()]).then(([{ default: MiniSearch }, docs]) => {
        const search = new MiniSearch<SearchDoc>({
          fields: ['lessonTitle', 'heading', 'text'],
          tokenize,
          storeFields: ['lesson', 'lessonTitle', 'chapter', 'anchor', 'heading', 'text', 'exercise'],
          searchOptions: {
            boost: { lessonTitle: 3, heading: 2 },
            prefix: true,
            combineWith: 'AND',
            // The query stays whole: "asReadonly" should not also search for every "readonly".
            tokenize: splitWords,
          },
        });
        search.addAll(docs);
        return search;
      });
      this.indexes.set(lang, index);
    }
    return index;
  }
}

const splitWords = (text: string): string[] => text.split(/[^\p{L}\p{N}_]+/u).filter(Boolean);

/**
 * For the index: words plus the parts of camelCase words – so "cleanup" finds "onCleanup"
 * and "signal" finds "linkedSignal".
 */
function tokenize(text: string): string[] {
  return splitWords(text).flatMap((word) => {
    const parts = word.split(/(?<=\p{Ll})(?=\p{Lu})/u);
    return parts.length > 1 ? [word, ...parts] : [word];
  });
}

/** A short excerpt around the first matching term, with all matching terms marked. */
function snippet(text: string, terms: string[]): SnippetPart[] {
  // A rough position is enough to pick the excerpt; the exact word match happens below.
  const lower = text.toLowerCase();
  const first = Math.min(...terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0), text.length);
  const start = first === text.length ? 0 : Math.max(0, first - 40);
  const excerpt = (start > 0 ? '…' : '') + text.slice(start, start + SNIPPET_LENGTH) + (start + SNIPPET_LENGTH < text.length ? '…' : '');
  // Marks whole words or whole camelCase parts – "clear" must not light up inside "cleared",
  // but "cleanup" should inside "onCleanup".
  const matches = (s: string) => terms.includes(s.toLowerCase());
  const parts: SnippetPart[] = [];
  for (const piece of excerpt.split(/([^\p{L}\p{N}_]+)/u)) {
    if (!piece) continue;
    if (matches(piece)) {
      parts.push({ text: piece, hit: true });
      continue;
    }
    for (const camel of piece.split(/(?<=\p{Ll})(?=\p{Lu})/u)) parts.push({ text: camel, hit: matches(camel) });
  }
  return parts;
}
