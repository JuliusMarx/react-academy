import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Lang } from '../content/content.model';
import { ContentService } from '../content/content.service';
import { ProgressService } from '../core/progress.service';
import { UI_TEXT } from '../core/ui-text';
import { ProgressBar } from '../shared/progress-bar';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, ProgressBar],
  template: `
    <nav [attr.aria-label]="text().courseNav">
      <div class="overall">
        <span class="label">{{ text().progress }}</span>
        <app-progress-bar [value]="overall()" [label]="text().progress" />
      </div>

      @for (chapter of chapters(); track chapter.slug; let i = $index) {
        <section>
          <h2>
            <span class="number">{{ i + 1 }}</span>
            {{ chapter.title }}
          </h2>
          <ul>
            @for (lesson of chapter.lessons; track lesson.id) {
              <li>
                <a
                  [routerLink]="['/', lang(), chapter.slug, lesson.slug]"
                  routerLinkActive="active"
                  ariaCurrentWhenActive="page"
                >
                  <span class="check" [class.done]="progress.completed().has(lesson.id)" aria-hidden="true">✓</span>
                  {{ lesson.title }}
                  @if (progress.completed().has(lesson.id)) {
                    <span class="visually-hidden">({{ text().markedDone }})</span>
                  }
                </a>
              </li>
            }
          </ul>
        </section>
      }
    </nav>
  `,
  styles: `
    :host {
      display: block;
      padding: 1.25rem 0.75rem 2rem;
    }
    .overall {
      padding: 0 0.5rem 1rem;
      margin-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
    }
    .label {
      display: block;
      margin-bottom: 0.4rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1.25rem 0.5rem 0.4rem;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
    }
    .number {
      display: inline-grid;
      place-items: center;
      width: 1.3rem;
      height: 1.3rem;
      border-radius: 50%;
      background: var(--surface-hover);
      font-size: 0.7rem;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.5rem;
      border-radius: 0.4rem;
      color: var(--text);
      font-size: 0.92rem;
      text-decoration: none;
      &:hover {
        background: var(--surface-hover);
      }
      &.active {
        background: var(--accent-soft);
        color: var(--accent-text);
        font-weight: 600;
      }
    }
    .check {
      flex: none;
      display: inline-grid;
      place-items: center;
      width: 1.1rem;
      height: 1.1rem;
      border: 1.5px solid var(--border-strong);
      border-radius: 50%;
      font-size: 0.65rem;
      color: transparent;
      &.done {
        border-color: var(--success);
        background: var(--success);
        color: #fff;
      }
    }
  `,
})
export class Sidebar {
  private readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly chapters = computed(() => this.content.chapters(this.lang()));
  protected readonly overall = computed(() =>
    this.progress.percent(this.content.allLessons(this.lang()).map((l) => l.id)),
  );
}
