import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { ProgressService } from '../../core/progress.service';
import { UI_TEXT } from '../../core/ui-text';

/** Bookmarked lessons and all personal notes on one page – to find them again or print them. */
@Component({
  selector: 'app-notes-page',
  imports: [RouterLink],
  templateUrl: './notes-page.html',
  styleUrl: './notes-page.scss',
})
export default class NotesPage {
  private readonly content = inject(ContentService);
  private readonly document = inject(DOCUMENT);
  protected readonly progress = inject(ProgressService);

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  /** Every lesson with its chapter title, by lesson id. */
  private readonly lessons = computed(() => {
    const lessons = this.content.chapters(this.lang()).flatMap((chapter) =>
      chapter.lessons.map((lesson) => ({ ...lesson, chapter: chapter.slug, chapterTitle: chapter.title })),
    );
    return new Map(lessons.map((lesson) => [lesson.id, lesson]));
  });
  /** Bookmarks in the order they were added; ids of lessons that no longer exist are skipped. */
  protected readonly bookmarks = computed(() =>
    this.progress
      .progress()
      .bookmarks.map((id) => this.lessons().get(id))
      .filter((lesson) => lesson !== undefined),
  );
  /** Notes in course order. */
  protected readonly notes = computed(() => {
    const notes = this.progress.progress().notes;
    return [...this.lessons().values()]
      .filter((lesson) => notes[lesson.id])
      .map((lesson) => ({ lesson, note: notes[lesson.id] }));
  });

  constructor() {
    const title = inject(Title);
    effect(() => title.setTitle(`${this.text().notes} – ${this.text().appName}`));
  }

  protected print(): void {
    this.document.defaultView?.print();
  }
}
