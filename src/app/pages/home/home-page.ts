import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { ProgressService } from '../../core/progress.service';
import { UI_TEXT } from '../../core/ui-text';
import { ProgressBar } from '../../shared/progress-bar';
import { ProgressManager } from './progress-manager';

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

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly chapters = computed(() =>
    this.content.chapters(this.lang()).map((chapter) => ({
      ...chapter,
      percent: this.progress.percent(chapter.lessons.map((l) => l.id)),
    })),
  );

  /** Where the primary button leads: the last visited lesson, or the very first one. */
  protected readonly startLesson = computed(() => {
    const lessons = this.content.allLessons(this.lang());
    const last = this.progress.progress().lastLesson;
    return lessons.find((l) => l.id === last) ?? lessons[0];
  });
  protected readonly hasStarted = computed(() => !!this.progress.progress().lastLesson);

  constructor() {
    effect(() => this.title.setTitle(this.text().appName));
  }
}
