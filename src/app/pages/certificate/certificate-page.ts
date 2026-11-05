import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { ProgressService } from '../../core/progress.service';
import { UI_TEXT } from '../../core/ui-text';
import { ProgressBar } from '../../shared/progress-bar';

/** Certificate of completion, available once every lesson is done. Printable or savable as PDF. */
@Component({
  selector: 'app-certificate-page',
  imports: [RouterLink, ProgressBar],
  templateUrl: './certificate-page.html',
  styleUrl: './certificate-page.scss',
})
export default class CertificatePage {
  private readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly lessons = computed(() => this.content.allLessons(this.lang()));
  protected readonly chapterCount = computed(() => this.content.chapters(this.lang()).length);
  protected readonly doneCount = computed(() => this.lessons().filter((l) => this.progress.completed().has(l.id)).length);
  protected readonly percent = computed(() => this.progress.percent(this.lessons().map((l) => l.id)));
  protected readonly complete = computed(() => this.doneCount() === this.lessons().length);
  protected readonly nextLesson = computed(() => this.lessons().find((l) => !this.progress.completed().has(l.id)));

  protected readonly certificate = computed(() => this.progress.progress().certificate);
  /** Whether the name form is shown: before the certificate exists, or while changing the name. */
  protected readonly editing = linkedSignal(() => !this.certificate());
  protected readonly date = computed(() => {
    const date = this.certificate()?.date;
    return date ? new Intl.DateTimeFormat(this.lang(), { dateStyle: 'long' }).format(Date.parse(date)) : '';
  });

  constructor() {
    effect(() => this.title.setTitle(`${this.text().certificate} – ${this.text().appName}`));
  }

  protected save(event: SubmitEvent, name: string): void {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    this.progress.setCertificateName(trimmed);
    this.editing.set(false);
  }

  protected print(): void {
    this.document.defaultView?.print();
  }
}
