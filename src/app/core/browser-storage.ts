import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service } from '@angular/core';

/** localStorage wrapper that is a no-op during prerendering and never throws. */
@Service()
export class BrowserStorage {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  read<T>(key: string): T | undefined {
    if (!this.isBrowser) return undefined;
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? undefined : (JSON.parse(raw) as T);
    } catch {
      return undefined;
    }
  }

  /** True if anything is stored under the key, even a value that isn't JSON. */
  has(key: string): boolean {
    if (!this.isBrowser) return false;
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

  remove(key: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Blocked storage – nothing to remove.
    }
  }

  write(key: string, value: unknown): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked (private mode) – progress simply isn't persisted.
    }
  }
}
