import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, input, resource } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { summaryLoaders } from '../../content/generated/summaries';
import { UI_TEXT } from '../../core/ui-text';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';

/** All lesson summaries on one page, grouped by chapter – to look things up or print. */
@Component({
  selector: 'app-cheatsheet-page',
  imports: [RouterLink, SafeHtmlPipe],
  templateUrl: './cheatsheet-page.html',
  styleUrl: './cheatsheet-page.scss',
  host: { '(click)': 'onClick($event)' },
})
export default class CheatsheetPage {
  private readonly content = inject(ContentService);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly chapters = computed(() => this.content.chapters(this.lang()));
  protected readonly summaries = resource({
    params: () => this.lang(),
    loader: ({ params }) => summaryLoaders[params](),
  });

  constructor() {
    effect(() => this.title.setTitle(`${this.text().cheatsheet} – ${this.text().appName}`));
  }

  protected print(): void {
    this.document.defaultView?.print();
  }

  /** Copy buttons live inside the rendered summaries, so they are handled by delegation. */
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
