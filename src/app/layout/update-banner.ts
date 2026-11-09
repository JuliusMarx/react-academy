import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';
import { Lang } from '../content/content.model';
import { UI_TEXT } from '../core/ui-text';

/**
 * The service worker keeps the course readable offline. After a deploy it loads the new version in
 * the background – this banner offers to switch to it (the open page keeps running the old one).
 */
@Component({
  selector: 'app-update-banner',
  template: `
    <div role="status">
      @if (ready()) {
        <div class="banner no-print">
          <p>{{ text().updateReady }}</p>
          <button type="button" class="button" (click)="reload()">{{ text().updateReload }}</button>
          <button type="button" class="dismiss" [attr.aria-label]="text().updateDismiss" (click)="ready.set(false)">
            <span aria-hidden="true">×</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .banner {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      z-index: 50;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      max-width: calc(100vw - 2rem);
      padding: 0.75rem 0.75rem 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 0.6rem;
      background: var(--surface);
      color: var(--text);
      box-shadow: 0 6px 24px rgb(0 0 0 / 0.18);
      p {
        margin: 0;
      }
    }
    .dismiss {
      padding: 0.25rem 0.5rem;
      border: 0;
      background: none;
      color: var(--text-muted);
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
    }
  `,
})
export class UpdateBanner {
  private readonly document = inject(DOCUMENT);
  readonly lang = input.required<Lang>();
  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly ready = signal(false);

  constructor() {
    const updates = inject(SwUpdate);
    if (!updates.isEnabled) return;
    updates.versionUpdates.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event.type === 'VERSION_READY') this.ready.set(true);
    });
    // The cached version can no longer be served (e.g. its files are gone) – only a reload helps.
    updates.unrecoverable.pipe(takeUntilDestroyed()).subscribe(() => this.reload());
  }

  protected reload(): void {
    this.document.location.reload();
  }
}
