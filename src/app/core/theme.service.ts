import { DOCUMENT } from '@angular/common';
import { afterNextRender, inject, Service, signal } from '@angular/core';
import { BrowserStorage } from './browser-storage';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'react-academy.theme';

/** The initial theme is applied by an inline script in index.html to avoid a flash. */
@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(BrowserStorage);
  readonly theme = signal<Theme>('light');

  constructor() {
    afterNextRender(() => {
      this.theme.set(this.document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light');
    });
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.document.documentElement.dataset['theme'] = next;
    this.storage.write(STORAGE_KEY, next);
  }
}
