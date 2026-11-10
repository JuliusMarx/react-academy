import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { BrowserStorage } from './browser-storage';
import { CloudService } from './cloud.service';
import { SITE } from './site';

/** Set this localStorage key to count page views on localhost too (e.g. to try the dashboard). */
export const TRACK_LOCAL_KEY = `${SITE.storagePrefix}.track-local`;

/**
 * Counts page views for the admin dashboard – without cookies or a visitor ID: each view is stored
 * with its page, language and time only (plus the account if signed in). Local development and the
 * e2e tests run on localhost and are not counted.
 */
@Service()
export class AnalyticsService {
  private readonly cloud = inject(CloudService);

  constructor() {
    const document = inject(DOCUMENT);
    if (!isPlatformBrowser(inject(PLATFORM_ID)) || !this.cloud.enabled) return;
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(document.location.hostname);
    if (local && !inject(BrowserStorage).has(TRACK_LOCAL_KEY)) return;

    let previous = '';
    inject(Router)
      .events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const path = event.urlAfterRedirects.split(/[?#]/)[0].replace(/\/$/, '') || '/';
        // Same page again (e.g. only the #anchor changed) and the admin's own dashboard don't count.
        if (path === previous || /^\/\w+\/admin$/.test(path)) return;
        previous = path;
        const lang = path.split('/')[1] ?? '';
        void this.cloud.recordPageView(path.slice(0, 200), lang);
      });
  }
}
