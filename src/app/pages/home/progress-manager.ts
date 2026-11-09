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
      <h3>{{ text().transferTitle }}</h3>
      <p class="hint">{{ text().transferHint }}</p>
      <div class="actions">
        <button type="button" class="button secondary" (click)="copyCode()">
          {{ copied() ? text().codeCopied : text().copyCode }}
        </button>
      </div>
      @if (code()) {
        <label class="field">
          {{ text().yourCode }}
          <textarea readonly rows="3" [value]="code()" (focus)="$any($event.target).select()"></textarea>
        </label>
      }
      <form class="field" (submit)="applyCode($event, pasted)">
        <label for="transfer-code">{{ text().pasteCode }}</label>
        <textarea #pasted id="transfer-code" rows="3" required spellcheck="false" autocomplete="off"></textarea>
        <div class="actions">
          <button type="submit" class="button secondary">{{ text().applyCode }}</button>
        </div>
      </form>
      <p class="status" role="status">
        @switch (status()) {
          @case ('fileInvalid') {
            <span class="error">{{ text().importFailed }}</span>
          }
          @case ('codeInvalid') {
            <span class="error">{{ text().codeInvalid }}</span>
          }
          @case ('imported') {
            {{ text().importDone }}
          }
        }
      </p>
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
    h3 {
      margin: 1.5rem 0 0;
      font-size: 1rem;
    }
    .field {
      display: grid;
      gap: 0.4rem;
      margin-top: 0.75rem;
      font-weight: 600;
    }
    textarea {
      width: 100%;
      padding: 0.5rem 0.7rem;
      border: 1px solid var(--border-strong);
      border-radius: 0.5rem;
      background: var(--bg);
      color: var(--text);
      font: 0.85rem/1.4 ui-monospace, 'Cascadia Code', Consolas, monospace;
      word-break: break-all;
      resize: vertical;
    }
    .status {
      min-height: 1.5em;
      margin-bottom: 0;
    }
  `,
})
export class ProgressManager {
  private readonly progress = inject(ProgressService);

  readonly lang = input.required<Lang>();
  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly status = signal<'' | 'fileInvalid' | 'codeInvalid' | 'imported'>('');
  protected readonly code = signal('');
  protected readonly copied = signal(false);

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
    const json = await file.text();
    input.value = '';
    if (!this.confirmReplace()) return;
    this.status.set(this.progress.importJson(json) ? 'imported' : 'fileInvalid');
  }

  /** Shows the transfer code (for copying by hand) and puts it on the clipboard. */
  protected copyCode(): void {
    const code = this.progress.exportCode();
    this.code.set(code);
    navigator.clipboard?.writeText(code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  protected applyCode(event: Event, field: HTMLTextAreaElement): void {
    event.preventDefault();
    if (!field.value.trim() || !this.confirmReplace()) return;
    const ok = this.progress.importJson(field.value);
    this.status.set(ok ? 'imported' : 'codeInvalid');
    if (ok) field.value = '';
  }

  private confirmReplace(): boolean {
    return !this.progress.hasData() || confirm(this.text().importConfirm);
  }

  protected reset(): void {
    if (confirm(this.text().resetConfirm)) this.progress.reset();
  }
}
