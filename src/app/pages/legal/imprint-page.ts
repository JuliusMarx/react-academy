import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Lang } from '../../content/content.model';
import { SITE } from '../../core/site';
import { UI_TEXT } from '../../core/ui-text';

/** Imprint (§ 5 DDG). The operator's details live in core/site.ts. */
@Component({
  selector: 'app-imprint-page',
  template: `
    <div class="prose legal">
      <h1>{{ text().imprint }}</h1>
      @if (lang() === 'de') {
        <h2>Angaben gemäß § 5 DDG</h2>
        <address>
          {{ operator.name }}<br />
          {{ operator.street }}<br />
          {{ operator.city }}<br />
          {{ operator.country }}
        </address>

        <h2>Kontakt</h2>
        <p>E-Mail: {{ operator.email }}</p>

        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>{{ operator.name }}, Anschrift wie oben.</p>

        <h2>Haftung für Links</h2>
        <p>
          Die Seite enthält Links zu externen Websites, etwa zu StackBlitz und GitHub. Auf deren Inhalte habe ich keinen
          Einfluss, dafür ist der jeweilige Anbieter verantwortlich. Sollte mir ein Rechtsverstoß auf einer verlinkten Seite
          bekannt werden, entferne ich den Link.
        </p>
      } @else {
        <p class="note">This is an English translation. The German version is legally binding.</p>
        <h2>Information according to § 5 DDG (German Digital Services Act)</h2>
        <address>
          {{ operator.name }}<br />
          {{ operator.street }}<br />
          {{ operator.city }}<br />
          Germany
        </address>

        <h2>Contact</h2>
        <p>Email: {{ operator.email }}</p>

        <h2>Responsible for the content according to § 18 (2) MStV</h2>
        <p>{{ operator.name }}, address as above.</p>

        <h2>Liability for links</h2>
        <p>
          This site links to external websites such as StackBlitz and GitHub. I have no influence on their content; their
          providers are responsible for it. If I learn of a legal violation on a linked page, I will remove the link.
        </p>
      }
    </div>
  `,
  styleUrl: './legal.scss',
})
export default class ImprintPage {
  private readonly title = inject(Title);

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly operator = SITE.operator;

  constructor() {
    effect(() => this.title.setTitle(`${this.text().imprint} – ${this.text().appName}`));
  }
}
