import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { ProgressService } from '../../core/progress.service';
import { ReadingMode, ReadingModeService } from '../../core/reading-mode.service';
import { UI_TEXT } from '../../core/ui-text';
import { ProgressBar } from '../../shared/progress-bar';
import { ProgressManager } from './progress-manager';

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ProgressBar, ProgressManager],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export default class HomePage {
  private readonly content = inject(ContentService);
  private readonly progress = inject(ProgressService);
  private readonly title = inject(Title);
  protected readonly readingMode = inject(ReadingModeService);

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly chapters = computed(() =>
    this.content.chapters(this.lang()).map((chapter) => ({
      ...chapter,
      percent: this.progress.percent(chapter.lessons.map((l) => l.id)),
      minutes: sum(chapter.lessons.map((l) => l.minutes)),
      summaryMinutes: sum(chapter.lessons.map((l) => l.summaryMinutes)),
    })),
  );

  /** Where the primary button leads: the last visited lesson, or the very first one. */
  protected readonly startLesson = computed(() => {
    const lessons = this.content.allLessons(this.lang());
    const last = this.progress.progress().lastLesson;
    return lessons.find((l) => l.id === last) ?? lessons[0];
  });
  /** The two ways through the course; the choice is the reading mode of every lesson. */
  protected readonly modes = computed(() => {
    const lessons = this.content.allLessons(this.lang());
    const text = this.text();
    const option = (mode: ReadingMode, title: string, description: string, minutes: number) => ({ mode, title, description, minutes });
    return [
      option('short', text.courseShort, text.courseShortText, sum(lessons.map((l) => l.summaryMinutes))),
      option('full', text.courseFull, text.courseFullText, sum(lessons.map((l) => l.minutes))),
    ];
  });
  protected readonly tools = computed(() => {
    const text = this.text();
    return [
      { path: 'placement', title: text.placement, description: text.toolPlacementText },
      { path: 'review', title: text.review, description: text.toolReviewText },
      { path: 'cheatsheet', title: text.cheatsheet, description: text.toolCheatsheetText },
      { path: 'certificate', title: text.certificate, description: text.toolCertificateText },
    ];
  });
  protected readonly lessonCount = computed(() => this.content.allLessons(this.lang()).length);
  protected readonly hasStarted = computed(() => !!this.progress.progress().lastLesson);
  /** Due review questions; 0 until the stored progress is loaded (the prerendered page knows none). */
  protected readonly reviewDue = computed(() => (this.progress.loaded() ? this.progress.dueReviews().length : 0));

  constructor() {
    effect(() => this.title.setTitle(this.text().appName));
  }
}
