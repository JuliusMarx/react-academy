import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lang, TocEntry } from '../../content/content.model';
import { UI_TEXT } from '../../core/ui-text';

/** "On this page" navigation that highlights the section currently in view. */
@Component({
  selector: 'app-toc',
  imports: [RouterLink],
  template: `
    <nav [attr.aria-labelledby]="'toc-title'">
      <p id="toc-title" class="title">{{ text().onThisPage }}</p>
      <ul>
        @for (entry of entries(); track entry.id) {
          <li>
            <a
              [routerLink]="[]"
              [fragment]="entry.id"
              [class.active]="entry.id === active()"
              [attr.aria-current]="entry.id === active() ? 'location' : null"
              >{{ entry.text }}</a
            >
          </li>
        }
      </ul>
    </nav>
  `,
  styles: `
    :host {
      display: block;
    }
    .title {
      margin: 0 0 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      border-left: 2px solid var(--border);
    }
    a {
      display: block;
      margin-left: -2px;
      padding: 0.3rem 0 0.3rem 0.85rem;
      border-left: 2px solid transparent;
      font-size: 0.88rem;
      line-height: 1.4;
      color: var(--text-muted);
      text-decoration: none;
      &:hover {
        color: var(--text);
      }
      &.active {
        border-left-color: var(--accent);
        color: var(--accent-text);
        font-weight: 600;
      }
    }
  `,
})
export class Toc {
  private readonly document = inject(DOCUMENT);

  readonly entries = input.required<TocEntry[]>();
  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly active = signal<string | null>(null);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      // A heading counts as current once it passes the upper third of the viewport.
      this.observer = new IntersectionObserver(
        (records) => {
          const visible = records.filter((r) => r.isIntersecting).map((r) => r.target.id);
          if (visible.length) this.active.set(visible[0]);
        },
        { rootMargin: '0px 0px -66% 0px' },
      );
      this.observe();
    });
    // Re-observe when the lesson (and thus the headings) changes.
    effect(() => {
      this.entries();
      this.active.set(null);
      queueMicrotask(() => this.observe());
    });
    inject(DestroyRef).onDestroy(() => this.observer?.disconnect());
  }

  private observe(): void {
    if (!this.observer) return;
    this.observer.disconnect();
    for (const entry of this.entries()) {
      const heading = this.document.getElementById(entry.id);
      if (heading) this.observer.observe(heading);
    }
  }
}
