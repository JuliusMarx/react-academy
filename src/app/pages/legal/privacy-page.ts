import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang } from '../../content/content.model';
import { SITE } from '../../core/site';
import { UI_TEXT } from '../../core/ui-text';

/**
 * Privacy policy. It describes what the site actually does – keep it in sync when adding anything
 * that loads external resources or stores data (see the sections on hosting, storage and StackBlitz).
 */
@Component({
  selector: 'app-privacy-page',
  imports: [RouterLink],
  templateUrl: './privacy-page.html',
  styleUrl: './legal.scss',
})
export default class PrivacyPage {
  private readonly title = inject(Title);

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly site = SITE;
  protected readonly date = computed(() =>
    new Intl.DateTimeFormat(this.lang(), { dateStyle: 'long' }).format(Date.parse(SITE.privacyDate)),
  );

  constructor() {
    effect(() => this.title.setTitle(`${this.text().privacy} – ${this.text().appName}`));
  }
}
