import { Component, computed, effect, inject, input, linkedSignal, resource, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang } from '../../content/content.model';
import { AdminStats, CloudService } from '../../core/cloud.service';
import { SITE } from '../../core/site';
import { UI_TEXT } from '../../core/ui-text';

const APPS = [
  { id: 'angular-academy', label: 'Angular Academy' },
  { id: 'react-academy', label: 'React Academy' },
];
const RANGES = [7, 30, 90];

const TEXT = {
  de: {
    title: 'Dashboard',
    noAccess: 'Diese Seite ist nur für Admins. Melde dich mit einem Admin-Konto an.',
    toAccount: 'Zur Kontoseite',
    site: 'Website',
    range: 'Zeitraum',
    days: (n: number) => `${n} Tage`,
    loading: 'Lade Zahlen …',
    failed: 'Die Zahlen konnten nicht geladen werden:',
    views: 'Seitenaufrufe',
    today: 'heute',
    signedIn: 'Angemeldet',
    anonymous: 'Nicht angemeldet',
    share: (p: number) => `${p} % angemeldet`,
    accounts: 'Konten',
    newAccounts: (n: number) => `${n} neu im Zeitraum`,
    activeUsers: 'Aktive Konten',
    activeHint: 'mit Seitenaufruf im Zeitraum',
    activeWeek: (n: number) => `${n} in den letzten 7 Tagen angemeldet`,
    providers: (github: number, email: number) => `GitHub ${github} · E-Mail ${email}`,
    learners: 'Lernstände in der Cloud',
    completed: (n: number) => `${n} erledigte Lektionen`,
    certificates: (n: number) => `${n} Zertifikate`,
    perDay: 'Seitenaufrufe pro Tag',
    asTable: 'Als Tabelle',
    day: 'Tag',
    total: 'Gesamt',
    topPages: 'Meistbesuchte Seiten',
    page: 'Seite',
    none: 'Noch keine Seitenaufrufe im Zeitraum.',
    note: 'Gezählt wird ohne Cookies und ohne Besucher-Kennung – Aufrufe von localhost zählen nicht.',
    chartLabel: (total: number, days: number) => `${total} Seitenaufrufe in ${days} Tagen, pro Tag nach angemeldet und nicht angemeldet`,
  },
  en: {
    title: 'Dashboard',
    noAccess: 'This page is for admins only. Sign in with an admin account.',
    toAccount: 'Go to account page',
    site: 'Site',
    range: 'Period',
    days: (n: number) => `${n} days`,
    loading: 'Loading numbers …',
    failed: 'The numbers could not be loaded:',
    views: 'Page views',
    today: 'today',
    signedIn: 'Signed in',
    anonymous: 'Not signed in',
    share: (p: number) => `${p}% signed in`,
    accounts: 'Accounts',
    newAccounts: (n: number) => `${n} new in this period`,
    activeUsers: 'Active accounts',
    activeHint: 'with a page view in this period',
    activeWeek: (n: number) => `${n} signed in during the last 7 days`,
    providers: (github: number, email: number) => `GitHub ${github} · email ${email}`,
    learners: 'Progress saved in the cloud',
    completed: (n: number) => `${n} completed lessons`,
    certificates: (n: number) => `${n} certificates`,
    perDay: 'Page views per day',
    asTable: 'As a table',
    day: 'Day',
    total: 'Total',
    topPages: 'Most visited pages',
    page: 'Page',
    none: 'No page views in this period yet.',
    note: 'Counted without cookies or a visitor ID – views from localhost are not counted.',
    chartLabel: (total: number, days: number) => `${total} page views in ${days} days, per day split by signed in and not signed in`,
  },
};

const CHART = { height: 160, bar: 14, gap: 4 };

/** Visitor statistics for admins (Supabase function admin_stats). Not linked for anyone else. */
@Component({
  selector: 'app-admin-page',
  imports: [RouterLink],
  template: `
    <div class="admin">
      <h1>{{ t().title }}</h1>

      @if (!cloud.isAdmin()) {
        @if (cloud.restoring()) {
          <p role="status">{{ t().loading }}</p>
        } @else {
          <p>{{ t().noAccess }}</p>
          <a class="button" [routerLink]="['/', lang(), 'account']">{{ t().toAccount }}</a>
        }
      } @else {
        <div class="filters">
          <label>
            {{ t().site }}
            <select [value]="app()" (change)="app.set($any($event.target).value)">
              @for (option of apps; track option.id) {
                <option [value]="option.id">{{ option.label }}</option>
              }
            </select>
          </label>
          <div class="range" role="group" [attr.aria-label]="t().range">
            @for (days of ranges; track days) {
              <button type="button" [attr.aria-pressed]="range() === days" (click)="range.set(days)">{{ t().days(days) }}</button>
            }
          </div>
        </div>

        @if (stats.error()) {
          <p role="alert">{{ t().failed }} {{ errorText() }}</p>
        } @else if (stats.value(); as s) {
          <div class="tiles">
            <section class="tile">
              <h2>{{ t().views }}</h2>
              <p class="number">{{ format(s.views.total) }}</p>
              <p>{{ format(s.views.today) }} {{ t().today }} · {{ t().share(share(s)) }}</p>
            </section>
            <section class="tile">
              <h2>{{ t().accounts }}</h2>
              <p class="number">{{ format(s.users.total) }}</p>
              <p>{{ t().newAccounts(s.users.new) }} · {{ t().providers(s.users.github, s.users.email) }}</p>
            </section>
            <section class="tile">
              <h2>{{ t().activeUsers }}</h2>
              <p class="number">{{ format(s.activeUsers) }}</p>
              <p>{{ t().activeHint }} · {{ t().activeWeek(s.users.activeWeek) }}</p>
            </section>
            <section class="tile">
              <h2>{{ t().learners }}</h2>
              <p class="number">{{ format(s.learners.withProgress) }}</p>
              <p>{{ t().completed(s.learners.completedLessons) }} · {{ t().certificates(s.learners.certificates) }}</p>
            </section>
          </div>

          <section class="card">
            <div class="card-head">
              <h2>{{ t().perDay }}</h2>
              <ul class="legend">
                <li><span class="swatch signed-in"></span>{{ t().signedIn }}</li>
                <li><span class="swatch anonymous"></span>{{ t().anonymous }}</li>
              </ul>
            </div>
            @if (chart(); as c) {
              <div class="chart" (mouseleave)="hovered.set(null)">
                <svg [attr.viewBox]="'0 0 ' + c.width + ' ' + (c.height + 22)" role="img" [attr.aria-label]="t().chartLabel(s.views.total, range())">
                  <line class="grid" x1="0" [attr.x2]="c.width" y1="0.5" y2="0.5" />
                  <line class="axis" x1="0" [attr.x2]="c.width" [attr.y1]="c.height + 0.5" [attr.y2]="c.height + 0.5" />
                  @for (bar of c.bars; track bar.day) {
                    <g [class.dim]="hovered() !== null && hovered() !== $index">
                      @if (bar.anonymous.h > 0) {
                        <path class="anonymous" [attr.d]="bar.anonymous.d" />
                      }
                      @if (bar.signedIn.h > 0) {
                        <path class="signed-in" [attr.d]="bar.signedIn.d" />
                      }
                      <rect class="hit" [attr.x]="bar.x - 2" y="0" [attr.width]="c.step" [attr.height]="c.height" (mouseenter)="hovered.set($index)" />
                    </g>
                  }
                  @for (tick of c.ticks; track tick.label) {
                    <text class="tick" [attr.x]="tick.x" [attr.y]="c.height + 16" [attr.text-anchor]="tick.anchor">{{ tick.label }}</text>
                  }
                </svg>
                <span class="max">{{ format(c.max) }}</span>
                @if (hovered() !== null && c.bars[hovered()!]; as bar) {
                  <div class="tooltip" [style.left.%]="((bar.x + 7) / c.width) * 100">
                    <strong>{{ bar.label }}</strong>
                    <span><i class="swatch signed-in"></i>{{ t().signedIn }}: {{ bar.values.signedIn }}</span>
                    <span><i class="swatch anonymous"></i>{{ t().anonymous }}: {{ bar.values.anonymous }}</span>
                    <span>{{ t().total }}: {{ bar.values.signedIn + bar.values.anonymous }}</span>
                  </div>
                }
              </div>
            }
            <details>
              <summary>{{ t().asTable }}</summary>
              <table>
                <thead>
                  <tr><th scope="col">{{ t().day }}</th><th scope="col">{{ t().signedIn }}</th><th scope="col">{{ t().anonymous }}</th><th scope="col">{{ t().total }}</th></tr>
                </thead>
                <tbody>
                  @for (row of s.daily; track row.day) {
                    <tr><td>{{ dayLabel(row.day) }}</td><td>{{ row.signedIn }}</td><td>{{ row.anonymous }}</td><td>{{ row.signedIn + row.anonymous }}</td></tr>
                  }
                </tbody>
              </table>
            </details>
          </section>

          <section class="card">
            <h2>{{ t().topPages }}</h2>
            @if (s.topPages.length) {
              <table class="pages">
                <thead>
                  <tr><th scope="col">{{ t().page }}</th><th scope="col">{{ t().views }}</th></tr>
                </thead>
                <tbody>
                  @for (page of s.topPages; track page.path) {
                    <tr>
                      <td>
                        @if (isOwnSite()) {
                          <a [href]="page.path">{{ page.path }}</a>
                        } @else {
                          {{ page.path }}
                        }
                      </td>
                      <td>
                        <span class="bar-cell"><span class="fill" [style.width.%]="(page.views / s.topPages[0].views) * 100"></span>{{ page.views }}</span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <p>{{ t().none }}</p>
            }
          </section>
          <p class="note">{{ t().note }}</p>
        } @else {
          <p role="status">{{ t().loading }}</p>
        }
      }
    </div>
  `,
  styles: `
    :host {
      --series-signed-in: #2a78d6;
      --series-anonymous: #eb6834;
      display: block;
      padding: 2rem clamp(1rem, 4vw, 3rem) 3rem;
    }
    :host-context(html[data-theme='dark']) {
      --series-signed-in: #3987e5;
      --series-anonymous: #d95926;
    }
    .admin {
      max-width: 64rem;
    }
    h1 {
      margin-top: 0;
    }
    h2 {
      margin: 0 0 0.5rem;
      font-size: 0.95rem;
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
      }
      select {
        padding: 0.35rem 0.5rem;
        border: 1px solid var(--border-strong);
        border-radius: 0.4rem;
        background: var(--surface);
        color: var(--text);
        font: inherit;
      }
    }
    .range {
      display: flex;
      border: 1px solid var(--border-strong);
      border-radius: 0.5rem;
      overflow: hidden;
      button {
        padding: 0.35rem 0.75rem;
        border: 0;
        background: var(--surface);
        color: var(--text);
        font: inherit;
        cursor: pointer;
        &[aria-pressed='true'] {
          background: var(--accent);
          color: #fff;
        }
      }
    }
    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .tile,
    .card {
      padding: 1rem 1.25rem;
      border: 1px solid var(--border);
      border-radius: 0.6rem;
      background: var(--surface);
      p {
        margin: 0;
        color: var(--text-muted);
        font-size: 0.85rem;
      }
    }
    .tile h2 {
      color: var(--text-muted);
      font-weight: 600;
    }
    .tile .number {
      margin: 0.1rem 0 0.25rem;
      color: var(--text);
      font-size: 2rem;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .card {
      margin-bottom: 1rem;
    }
    .card-head {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .legend {
      display: flex;
      gap: 1rem;
      margin: 0;
      padding: 0;
      list-style: none;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .swatch {
      display: inline-block;
      width: 0.7rem;
      height: 0.7rem;
      margin-right: 0.35rem;
      border-radius: 2px;
      vertical-align: -0.05rem;
      &.signed-in {
        background: var(--series-signed-in);
      }
      &.anonymous {
        background: var(--series-anonymous);
      }
    }
    .chart {
      position: relative;
      margin: 0.75rem 0 0.5rem;
      svg {
        display: block;
        width: 100%;
        height: auto;
        max-height: 14rem;
        overflow: visible;
      }
    }
    path.signed-in {
      fill: var(--series-signed-in);
    }
    path.anonymous {
      fill: var(--series-anonymous);
    }
    g.dim path {
      opacity: 0.35;
    }
    .hit {
      fill: transparent;
    }
    .grid {
      stroke: var(--border);
      stroke-dasharray: 2 3;
    }
    .axis {
      stroke: var(--border-strong);
    }
    .tick {
      fill: var(--text-muted);
      font-size: 9px;
    }
    .max {
      position: absolute;
      top: -0.6rem;
      left: 0;
      padding-right: 0.25rem;
      background: var(--surface);
      color: var(--text-muted);
      font-size: 0.75rem;
    }
    .tooltip {
      position: absolute;
      top: 0;
      transform: translate(-50%, -105%);
      display: grid;
      gap: 0.15rem;
      padding: 0.5rem 0.65rem;
      border: 1px solid var(--border);
      border-radius: 0.4rem;
      background: var(--surface);
      box-shadow: 0 4px 16px rgb(0 0 0 / 0.15);
      color: var(--text);
      font-size: 0.8rem;
      white-space: nowrap;
      pointer-events: none;
    }
    table {
      width: 100%;
      margin-top: 0.5rem;
      border-collapse: collapse;
      font-size: 0.9rem;
      font-variant-numeric: tabular-nums;
      th,
      td {
        padding: 0.35rem 0.5rem;
        border-bottom: 1px solid var(--border);
        text-align: left;
      }
    }
    .pages td:last-child {
      width: 40%;
    }
    .bar-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      .fill {
        height: 0.5rem;
        border-radius: 0 2px 2px 0;
        background: var(--series-signed-in);
      }
    }
    details summary {
      cursor: pointer;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .note {
      color: var(--text-muted);
      font-size: 0.85rem;
    }
  `,
})
export default class AdminPage {
  private readonly title = inject(Title);
  protected readonly cloud = inject(CloudService);

  readonly lang = input.required<Lang>();
  protected readonly t = computed(() => TEXT[this.lang()]);
  protected readonly apps = APPS;
  protected readonly ranges = RANGES;
  /** Starts with the Academy this page belongs to; both are in the same Supabase project. */
  protected readonly app = linkedSignal(() => SITE.storagePrefix);
  protected readonly range = signal(30);
  protected readonly hovered = signal<number | null>(null);
  protected readonly isOwnSite = computed(() => this.app() === SITE.storagePrefix);

  protected readonly stats = resource({
    params: () => (this.cloud.isAdmin() ? { app: this.app(), days: this.range() } : undefined),
    loader: ({ params }) => this.cloud.adminStats(params.app, params.days),
  });
  protected readonly errorText = computed(() => {
    const error = this.stats.error() as { message?: string } | undefined;
    return error?.message ?? String(error ?? '');
  });

  /** Stacked bars per day: anonymous at the base, signed-in on top, 2px gap between the segments. */
  protected readonly chart = computed(() => {
    const daily = this.stats.value()?.daily ?? [];
    if (!daily.length) return null;
    const { height, bar, gap } = CHART;
    const step = bar + gap;
    const max = Math.max(1, ...daily.map((d) => d.signedIn + d.anonymous));
    const scale = (value: number) => (value / max) * (height - 4);
    const bars = daily.map((d, i) => {
      const x = i * step + gap / 2;
      const anonymousH = scale(d.anonymous);
      const signedInH = scale(d.signedIn);
      const anonymousTop = height - anonymousH;
      const spacer = anonymousH > 0 && signedInH > 0 ? 2 : 0;
      return {
        day: d.day,
        x,
        label: this.dayLabel(d.day),
        values: d,
        anonymous: { h: anonymousH, d: barPath(x, anonymousTop, bar, anonymousH, signedInH === 0) },
        signedIn: { h: signedInH, d: barPath(x, anonymousTop - spacer - signedInH, bar, signedInH, true) },
      };
    });
    const width = daily.length * step;
    const last = daily.length - 1;
    const ticks = [0, Math.floor(last / 2), last]
      .filter((i, index, all) => all.indexOf(i) === index)
      .map((i) => ({
        x: i === 0 ? 0 : i === last ? width : bars[i].x + bar / 2,
        anchor: i === 0 ? 'start' : i === last ? 'end' : 'middle',
        label: this.dayLabel(daily[i].day),
      }));
    return { width, height, step, max, bars, ticks };
  });

  constructor() {
    effect(() => this.title.setTitle(`${this.t().title} – ${UI_TEXT[this.lang()].appName}`));
  }

  protected share(stats: AdminStats): number {
    return stats.views.total ? Math.round((stats.views.signedIn / stats.views.total) * 100) : 0;
  }

  protected format(value: number): string {
    return new Intl.NumberFormat(this.lang()).format(value);
  }

  protected dayLabel(day: string): string {
    return new Intl.DateTimeFormat(this.lang(), { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(Date.parse(day));
  }
}

/** A bar segment; only the topmost segment of a stack gets the 4px rounded data end. */
function barPath(x: number, y: number, width: number, height: number, roundTop: boolean): string {
  const r = roundTop ? Math.min(4, height, width / 2) : 0;
  return [
    `M${x},${y + height}`,
    `V${y + r}`,
    r ? `Q${x},${y} ${x + r},${y}` : '',
    `H${x + width - r}`,
    r ? `Q${x + width},${y} ${x + width},${y + r}` : '',
    `V${y + height}`,
    'Z',
  ].join(' ');
}
