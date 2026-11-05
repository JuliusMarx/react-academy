import { DOCUMENT } from '@angular/common';
import { afterNextRender, inject, Service, signal } from '@angular/core';
import { BrowserStorage } from './browser-storage';

/** "short" shows the quick-course summary of a lesson, "full" the whole text. */
export type ReadingMode = 'short' | 'full';
const STORAGE_KEY = 'react-academy.reading-mode';

/**
 * Lessons render both versions; CSS on html[data-reading] shows one of them. The stored mode is
 * applied by an inline script in index.html, so prerendered pages don't flash the other version.
 */
@Service()
export class ReadingModeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(BrowserStorage);
  readonly mode = signal<ReadingMode>('full');

  constructor() {
    afterNextRender(() => {
      this.mode.set(this.document.documentElement.dataset['reading'] === 'short' ? 'short' : 'full');
    });
  }

  set(mode: ReadingMode): void {
    this.mode.set(mode);
    this.document.documentElement.dataset['reading'] = mode;
    this.storage.write(STORAGE_KEY, mode);
  }
}
