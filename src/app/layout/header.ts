import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, model, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lang, LANGS } from '../content/content.model';
import { CloudService } from '../core/cloud.service';
import { ThemeService } from '../core/theme.service';
import { UI_TEXT } from '../core/ui-text';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, RouterLink],
  host: { role: 'banner' },
  template: `
    <button
      type="button"
      class="icon-button menu-button"
      [attr.aria-label]="text().menu"
      [attr.aria-expanded]="menuOpen()"
      aria-controls="course-nav"
      (click)="menuOpen.set(!menuOpen())"
    >
      <span aria-hidden="true">☰</span>
    </button>

    <a class="brand" [routerLink]="['/', lang()]">
      <img class="logo" ngSrc="logo.svg" width="32" height="32" alt="" priority />
      <span>{{ text().appName }}</span>
    </a>

    <button type="button" class="search-button" [attr.aria-keyshortcuts]="'Control+K /'" (click)="searchRequested.emit()">
      <span aria-hidden="true">⌕</span>
      <span class="label">{{ text().search }}</span>
      <kbd aria-hidden="true">{{ text().searchShortcut }}</kbd>
    </button>

    <nav class="actions" [attr.aria-label]="text().language">
      @for (l of langs; track l) {
        <a
          class="lang-link"
          [routerLink]="urlFor(l)"
          [class.active]="l === lang()"
          [attr.aria-current]="l === lang() ? 'true' : null"
          [attr.hreflang]="l"
          >{{ l.toUpperCase() }}</a
        >
      }
      <button type="button" class="icon-button" [attr.aria-label]="text().toggleTheme" (click)="theme.toggle()">
        <span aria-hidden="true">{{ theme.theme() === 'dark' ? '☀' : '☾' }}</span>
      </button>
    </nav>

    @if (cloud.enabled) {
      @if (cloud.user(); as user) {
        <a class="account-link signed-in" [routerLink]="['/', lang(), 'account']" [attr.aria-label]="text().accountOf(user.name)">
          <span class="avatar" aria-hidden="true">{{ user.name.charAt(0).toUpperCase() }}</span>
          <span class="label" aria-hidden="true">{{ user.name }}</span>
        </a>
      } @else {
        <a class="account-link" [routerLink]="['/', lang(), 'account']" [attr.aria-label]="text().signInShort">
          <svg class="person" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
          </svg>
          <span class="label" aria-hidden="true">{{ text().signInShort }}</span>
        </a>
      }
    }
  `,
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: 40;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      height: var(--header-height);
      padding: 0 1rem;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: 700;
      font-size: 1.1rem;
      white-space: nowrap;
      color: var(--text);
      text-decoration: none;
    }
    /* Phones: logo only, so search, language and theme still fit – the name stays for screen readers. */
    @media (max-width: 480px) {
      .brand span:last-child {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }
    }
    .logo {
      width: 2rem;
      height: 2rem;
    }
    .actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .lang-link {
      padding: 0.35rem 0.6rem;
      border-radius: 0.4rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      text-decoration: none;
      &:hover {
        background: var(--surface-hover);
      }
      &.active {
        color: var(--accent-text);
        background: var(--accent-soft);
      }
    }
    .menu-button {
      display: none;
    }
    @media (max-width: 900px) {
      .menu-button {
        display: inline-grid;
      }
    }
    .search-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: auto;
      padding: 0.35rem 0.6rem;
      border: 1px solid var(--border-strong);
      border-radius: 0.5rem;
      background: var(--bg);
      color: var(--text-muted);
      font: inherit;
      font-size: 0.9rem;
      cursor: pointer;
      &:hover {
        border-color: var(--accent);
        color: var(--text);
      }
      kbd {
        padding: 0 0.35rem;
        border: 1px solid var(--border);
        border-radius: 0.3rem;
        font-family: inherit;
        font-size: 0.75rem;
      }
    }
    .search-button + .actions {
      margin-left: 0;
    }
    .account-link {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      min-height: 2.25rem;
      padding: 0.25rem 0.7rem;
      border: 1px solid var(--accent);
      border-radius: 999px;
      color: var(--accent-text);
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      white-space: nowrap;
      &:hover {
        background: var(--accent-soft);
      }
      &.signed-in {
        padding-left: 0.25rem;
        border-color: var(--border-strong);
        color: var(--text);
      }
      .label {
        max-width: 9rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .person {
      width: 1.1rem;
      height: 1.1rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
    }
    .avatar {
      display: grid;
      place-items: center;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      background: var(--accent);
      color: #fff;
      font-size: 0.85rem;
    }
    /* Phones: icon or avatar only – the link keeps its name via aria-label. */
    @media (max-width: 600px) {
      .account-link {
        padding: 0.25rem;
        border-radius: 50%;
        .label {
          display: none;
        }
      }
      .account-link:not(.signed-in) {
        width: 2.25rem;
        justify-content: center;
      }
    }
    /* Narrow screens: icon only – the label stays available to screen readers. */
    @media (max-width: 600px) {
      .search-button .label {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }
      .search-button kbd {
        display: none;
      }
    }
  `,
})
export class Header {
  protected readonly theme = inject(ThemeService);
  protected readonly cloud = inject(CloudService);
  protected readonly langs = LANGS;

  readonly lang = input.required<Lang>();
  readonly url = input.required<string>();
  readonly menuOpen = model(false);
  readonly searchRequested = output<void>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);

  protected urlFor(lang: Lang): string {
    const path = this.url().split(/[?#]/)[0];
    return path.replace(/^\/(de|en)(?=\/|$)/, `/${lang}`) || `/${lang}`;
  }
}
