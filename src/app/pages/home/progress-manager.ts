import { Component, computed, inject, input, signal } from '@angular/core';
import { Lang } from '../../content/content.model';
import { ProgressService } from '../../core/progress.service';
import { UI_TEXT } from '../../core/ui-text';

/** Export, import and reset of the locally stored progress. */
@Component({
  selector: 'app-progress-manager',
  template: `
    <details>
      <summary>{{ text().manageProgress }}</summary>
      <p class="hint">{{ text().progressHint }}</p>
      <div class="actions">
        <button type="button" class="button secondary" (click)="export()">{{ text().exportProgress }}</button>
        <label class="button secondary">
          {{ text().importProgress }}
          <input type="file" accept="application/json,.json" class="visually-hidden" (change)="import($event)" />
        </label>
        <button type="button" class="button secondary danger" (click)="reset()">{{ text().resetProgress }}</button>
      </div>
      @if (error()) {
        <p class="error" role="alert">{{ text().importFailed }}</p>
      }
    </details>
  `,
  styles: `
    details {
      padding: 1rem 1.25rem;
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      background: var(--surface);
    }
    summary {
      font-weight: 600;
      cursor: pointer;
    }
    .hint {
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .danger {
      color: var(--danger);
    }
    label:focus-within {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .error {
      color: var(--danger);
    }
  `,
})
export class ProgressManager {
  private readonly progress = inject(ProgressService);

  readonly lang = input.required<Lang>();
  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly error = signal(false);

  protected export(): void {
    const blob = new Blob([this.progress.exportJson()], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'react-academy-progress.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  protected async import(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.error.set(!this.progress.importJson(await file.text()));
    input.value = '';
  }

  protected reset(): void {
    if (confirm(this.text().resetConfirm)) this.progress.reset();
  }
}
