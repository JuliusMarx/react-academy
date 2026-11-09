import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { GLOSSARY } from '../../content/glossary';
import { UI_TEXT } from '../../core/ui-text';

/** Text split at `backticks`: odd parts are code. */
const segments = (text: string) => text.split('`').map((part, i) => ({ code: i % 2 === 1, part }));
/** First letter for grouping; terms starting with a symbol (e.g. "@defer") go by their first letter. */
const letterOf = (term: string) => (term.replace(/^[^\p{L}]+/u, '')[0] ?? '#').toLocaleUpperCase();
const normalize = (text: string) => text.toLocaleLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

/** Key terms in alphabetical order, with a filter and links to the lessons that explain them. */
@Component({
  selector: 'app-glossary-page',
  imports: [RouterLink],
  templateUrl: './glossary-page.html',
  styleUrl: './glossary-page.scss',
})
export default class GlossaryPage {
  private readonly content = inject(ContentService);

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly query = signal('');

  private readonly entries = computed(() => {
    const lang = this.lang();
    const lessons = new Map(this.content.allLessons(lang).map((lesson) => [lesson.id, lesson]));
    return GLOSSARY.map((entry) => {
      const term = typeof entry.term === 'string' ? entry.term : entry.term[lang];
      const text = entry.text[lang];
      return {
        id: entry.id,
        term,
        letter: letterOf(term),
        text: segments(text),
        search: normalize(`${term} ${text}`),
        lessons: entry.lessons.map((id) => lessons.get(id)).filter((lesson) => lesson !== undefined),
      };
    }).sort((a, b) => a.letter.localeCompare(b.letter, lang) || a.term.localeCompare(b.term, lang, { sensitivity: 'base' }));
  });

  protected readonly filtered = computed(() => {
    const words = normalize(this.query()).split(/\s+/).filter(Boolean);
    return this.entries().filter((entry) => words.every((word) => entry.search.includes(word)));
  });

  /** Entries grouped by first letter. */
  protected readonly groups = computed(() => {
    const groups: { letter: string; entries: ReturnType<GlossaryPage['filtered']> }[] = [];
    for (const entry of this.filtered()) {
      const last = groups.at(-1);
      if (last?.letter === entry.letter) last.entries.push(entry);
      else groups.push({ letter: entry.letter, entries: [entry] });
    }
    return groups;
  });

  constructor() {
    const title = inject(Title);
    effect(() => title.setTitle(`${this.text().glossary} – ${this.text().appName}`));
  }
}
