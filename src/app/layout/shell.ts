import { DOCUMENT, ViewportScroller } from '@angular/common';
import { afterNextRender, Component, computed, effect, inject, Injector, input, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map, pairwise, startWith } from 'rxjs';
import { Lang } from '../content/content.model';
import { CloudService } from '../core/cloud.service';
import { SITE } from '../core/site';
import { UI_TEXT } from '../core/ui-text';
import { Header } from './header';
import { SearchDialog } from './search-dialog';
import { Sidebar } from './sidebar';
import { UpdateBanner } from './update-banner';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, Header, SearchDialog, Sidebar, UpdateBanner],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  host: {
    '(document:keydown.escape)': 'closeMenu()',
    '(document:keydown)': 'onShortcut($event)',
  },
})
export default class Shell {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  protected readonly repoUrl = SITE.repoUrl;

  readonly lang = input.required<Lang>();
  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly menuOpen = signal(false);
  private readonly searchDialog = viewChild.required(SearchDialog);
  /** Matches the breakpoint in shell.scss below which the sidebar becomes a slide-in menu. */
  protected readonly isMobile = signal(false);

  protected readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  constructor() {
    // Restores a signed-in account (if any) on every page, not only on the account page.
    inject(CloudService);
    // Anchor links (table of contents) must not scroll headings under the sticky header.
    // The router ignores CSS scroll-padding, so read the header height and pass it on.
    const scroller = inject(ViewportScroller);
    afterNextRender(() => {
      const header = this.document.querySelector('app-header')?.getBoundingClientRect().height ?? 60;
      scroller.setOffset([0, header + 16]);

      const query = this.document.defaultView?.matchMedia('(max-width: 900px)');
      if (!query) return;
      this.isMobile.set(query.matches);
      query.addEventListener('change', (e) => this.isMobile.set(e.matches));
    });
    effect(() => {
      this.document.documentElement.lang = this.lang();
    });
    // Close the mobile menu whenever the user navigates.
    effect(() => {
      this.url();
      this.menuOpen.set(false);
    });
    // When the mobile menu opens, move keyboard focus into it (once it is rendered visible).
    const injector = inject(Injector);
    effect(() => {
      if (this.menuOpen()) {
        afterNextRender(() => this.document.querySelector<HTMLElement>('#course-nav a')?.focus(), { injector });
      }
    });
    this.moveFocusOnNavigation();
  }

  /** Ctrl+K / ⌘K anywhere, or "/" when not typing, opens the search. */
  protected onShortcut(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const typing = !!target?.closest('input, textarea, select, [contenteditable="true"]');
    const ctrlK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
    if (ctrlK || (event.key === '/' && !typing)) {
      event.preventDefault();
      this.searchDialog().open();
    }
  }

  protected skipToContent(event: Event): void {
    event.preventDefault();
    const main = this.document.getElementById('main');
    main?.focus({ preventScroll: true });
    main?.scrollIntoView();
  }

  /** Escape or a click on the backdrop: close the menu and return focus to its button. */
  protected closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.document.querySelector<HTMLElement>('.menu-button')?.focus();
  }

  /**
   * After a client-side navigation, focus would stay on the clicked link (e.g. in the sidebar),
   * so screen readers wouldn't notice the new page. Move it to the content – or, for an anchor
   * link within the same page, to the target heading.
   */
  private moveFocusOnNavigation(): void {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((e) => e.urlAfterRedirects),
        startWith(this.router.url),
        pairwise(),
        takeUntilDestroyed(),
      )
      .subscribe(([previous, current]) => {
        const [prevPath] = previous.split('#');
        const [path, fragment] = current.split('#');
        const target =
          path === prevPath && fragment
            ? this.document.getElementById(decodeURIComponent(fragment))
            : this.document.getElementById('main');
        if (!target || path === prevPath && !fragment) return;
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
  }
}
