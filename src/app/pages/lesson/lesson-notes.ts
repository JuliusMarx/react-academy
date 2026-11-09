import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { Lang } from '../../content/content.model';
import { ProgressService } from '../../core/progress.service';
import { UI_TEXT } from '../../core/ui-text';

/** How long to wait after the last keystroke before saving. */
const SAVE_DELAY = 600;

/** Personal notes on a lesson, saved automatically into the progress. */
@Component({
  selector: 'app-lesson-notes',
  template: `
    <section class="notes" [class.no-print]="!draft().trim()" aria-labelledby="lesson-notes-title">
      <h2 id="lesson-notes-title">{{ text().myNotes }}</h2>
      <label for="lesson-notes" class="visually-hidden">{{ text().noteLabel }}</label>
      <textarea
        id="lesson-notes"
        rows="4"
        aria-describedby="lesson-notes-hint"
        [placeholder]="text().notePlaceholder"
        [value]="draft()"
        [disabled]="!progress.loaded()"
        (input)="edit($any($event.target).value)"
        (blur)="save()"
      ></textarea>
      <p class="hint no-print">
        <span id="lesson-notes-hint">{{ text().noteHint }}</span>
        <span class="saved" role="status">{{ saved() ? text().noteSaved : '' }}</span>
      </p>
    </section>
  `,
  styles: `
    .notes {
      margin-top: 2.5rem;
    }
    h2 {
      margin-bottom: 0.75rem;
    }
    textarea {
      width: 100%;
      padding: 0.7rem 0.85rem;
      border: 1px solid var(--border-strong);
      border-radius: 0.5rem;
      background: var(--surface);
      color: var(--text);
      font: inherit;
      line-height: 1.5;
      resize: vertical;
    }
    .hint {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.5rem;
      margin: 0.4rem 0 0;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .saved {
      color: var(--success);
      font-weight: 600;
    }
    @media print {
      textarea {
        border: 0;
        padding: 0;
        resize: none;
        field-sizing: content;
      }
    }
  `,
})
export class LessonNotes {
  protected readonly progress = inject(ProgressService);

  readonly lessonId = input.required<string>();
  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  private readonly stored = computed(() => this.progress.progress().notes[this.lessonId()] ?? '');
  /** What is in the field; follows the stored note when the lesson changes or the progress loads. */
  protected readonly draft = linkedSignal(() => this.stored());
  protected readonly saved = signal(false);

  private timer: ReturnType<typeof setTimeout> | undefined;
  /** Unsaved text and the lesson it belongs to – the input may already point to the next lesson. */
  private unsaved: { lessonId: string; value: string } | undefined;

  constructor() {
    // A new lesson starts without the "Saved" hint; text still unsaved from the last one is saved by the timer.
    effect(() => {
      this.lessonId();
      untracked(() => this.saved.set(false));
    });
    inject(DestroyRef).onDestroy(() => this.save());
  }

  protected edit(value: string): void {
    this.unsaved = { lessonId: this.lessonId(), value };
    this.draft.set(value);
    this.saved.set(false);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.save(), SAVE_DELAY);
  }

  protected save(): void {
    clearTimeout(this.timer);
    if (!this.unsaved) return;
    const { lessonId, value } = this.unsaved;
    this.unsaved = undefined;
    this.progress.setNote(lessonId, value);
    if (lessonId === this.lessonId()) this.saved.set(true);
  }
}
