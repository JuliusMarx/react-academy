import { Component, computed, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Lang } from '../content/content.model';
import { SearchHit, SearchService } from '../core/search.service';
import { UI_TEXT } from '../core/ui-text';

/** Modal search over all lessons (combobox pattern: arrow keys, Enter, Escape). */
@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.html',
  styleUrl: './search-dialog.scss',
})
export class SearchDialog {
  private readonly search = inject(SearchService);
  private readonly router = inject(Router);

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly query = signal('');
  protected readonly hits = signal<SearchHit[]>([]);
  protected readonly active = signal(0);
  protected readonly searched = signal(false);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');
  /** Ignores results of older queries that arrive after newer ones. */
  private requestId = 0;

  open(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) return;
    this.search.preload(this.lang());
    dialog.showModal();
    this.field().nativeElement.select();
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  protected async onInput(value: string): Promise<void> {
    this.query.set(value);
    const id = ++this.requestId;
    const hits = await this.search.search(this.lang(), value);
    if (id !== this.requestId) return;
    this.hits.set(hits);
    this.active.set(0);
    this.searched.set(value.trim().length >= 2);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.hits().length;
    if (event.key === 'ArrowDown' && count) {
      event.preventDefault();
      this.active.update((i) => (i + 1) % count);
      this.scrollActiveIntoView();
    } else if (event.key === 'ArrowUp' && count) {
      event.preventDefault();
      this.active.update((i) => (i - 1 + count) % count);
      this.scrollActiveIntoView();
    } else if (event.key === 'Enter' && count) {
      event.preventDefault();
      this.go(this.hits()[this.active()]);
    }
  }

  /** Clicks on the dimmed backdrop land on the dialog element itself. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }

  protected go(hit: SearchHit): void {
    this.close();
    const [chapter, lesson] = hit.doc.lesson.split('/');
    void this.router.navigate(['/', this.lang(), chapter, lesson], { fragment: hit.doc.anchor || undefined });
  }

  protected optionId(index: number): string {
    return `search-option-${index}`;
  }

  private scrollActiveIntoView(): void {
    queueMicrotask(() =>
      this.dialog().nativeElement.querySelector(`#${this.optionId(this.active())}`)?.scrollIntoView({ block: 'nearest' }),
    );
  }
}
