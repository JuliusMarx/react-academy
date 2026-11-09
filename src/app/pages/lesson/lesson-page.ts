import { DOCUMENT, ViewportScroller } from '@angular/common';
import { afterNextRender, Component, computed, effect, inject, Injector, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Lang, Lesson } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { ProgressService } from '../../core/progress.service';
import { ReadingModeService } from '../../core/reading-mode.service';
import { reportIssueUrl } from '../../core/site';
import { UI_TEXT } from '../../core/ui-text';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { Exercise } from './exercise';
import { LessonNotes } from './lesson-notes';
import { Quiz } from './quiz';
import { Toc } from './toc';
import { TryIt } from './try-it';

@Component({
  selector: 'app-lesson-page',
  imports: [RouterLink, SafeHtmlPipe, Exercise, LessonNotes, Quiz, Toc, TryIt],
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.scss',
  host: { '(click)': 'onClick($event)' },
})
export default class LessonPage {
  private readonly content = inject(ContentService);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);
  protected readonly progress = inject(ProgressService);
  protected readonly readingMode = inject(ReadingModeService);

  readonly lang = input.required<Lang>();
  readonly chapter = input.required<string>();
  readonly lesson = input.required<string>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly lessonId = computed(() => `${this.chapter()}/${this.lesson()}`);
  protected readonly chapterInfo = computed(() =>
    this.content.chapters(this.lang()).find((c) => c.slug === this.chapter()),
  );
  protected readonly neighbours = computed(() => this.content.neighbours(this.lang(), this.lessonId()));
  /** 1-based position of this lesson within the whole course. */
  protected readonly position = computed(() => {
    const lessons = this.content.allLessons(this.lang());
    const index = lessons.findIndex((l) => l.id === this.lessonId());
    return index < 0 ? null : { index: index + 1, total: lessons.length };
  });

  /** Loaded by the route resolver (see app.routes.ts); undefined for an unknown lesson. */
  readonly lessonData = input<Lesson>();

  protected readonly reportUrl = computed(() => {
    const lesson = this.lessonData();
    return lesson ? reportIssueUrl(lesson, this.lang()) : '';
  });
  protected readonly done = computed(() => this.progress.completed().has(this.lessonId()));
  protected readonly bookmarked = computed(() => this.progress.bookmarks().has(this.lessonId()));

  constructor() {
    effect(() => {
      const lesson = this.lessonData();
      this.title.setTitle(lesson ? `${lesson.title} – ${this.text().appName}` : this.text().appName);
    });
    effect(() => this.progress.visit(this.lessonId()));

    // Coming from another lesson (e.g. a search hit), the router scrolls to #anchor before the
    // lazily loaded lesson is rendered – so scroll (and move focus) once it is.
    const fragment = toSignal(inject(ActivatedRoute).fragment);
    const scroller = inject(ViewportScroller);
    const injector = inject(Injector);
    effect(() => {
      const id = fragment();
      if (!this.lessonData() || !id) return;
      afterNextRender(
        () => {
          const heading = this.document.getElementById(id);
          if (!heading) return;
          // Search hits point into the full text – show it if the summary is active.
          if (heading.closest('.full-only')) this.readingMode.set('full');
          scroller.scrollToAnchor(id);
          if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
          heading.focus({ preventScroll: true });
        },
        { injector },
      );
    });
  }

  protected toggleDone(): void {
    if (this.done()) this.progress.markIncomplete(this.lessonId());
    else this.progress.markCompleted(this.lessonId());
  }

  /** Copy buttons live inside Markdown-rendered HTML, so they are handled by delegation. */
  protected onClick(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]');
    const code = button?.parentElement?.querySelector('pre')?.textContent;
    if (!button || code == null) return;
    navigator.clipboard?.writeText(code).then(() => {
      button.textContent = this.text().copied;
      setTimeout(() => (button.textContent = this.text().copy), 1500);
    });
  }
}
