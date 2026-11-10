import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang } from '../../content/content.model';
import { CloudService } from '../../core/cloud.service';
import { UI_TEXT } from '../../core/ui-text';

/** Sign in with GitHub so the progress is saved in the cloud and shows up on every device. */
@Component({
  selector: 'app-account-page',
  imports: [RouterLink],
  template: `
    <div class="prose account">
      <h1>{{ text().account }}</h1>

      @if (!cloud.enabled) {
        <p>{{ text().accountUnavailable }}</p>
      } @else if (cloud.restoring()) {
        <p role="status">{{ text().signingIn }}</p>
      } @else if (cloud.user(); as user) {
        <p class="signed-in">{{ text().signedInAs(user.name) }}</p>
        <p class="sync" role="status">
          @switch (cloud.status()) {
            @case ('syncing') {
              {{ text().syncing }}
            }
            @case ('error') {
              {{ text().syncError }}
            }
            @default {
              @if (syncedTime(); as time) {
                {{ text().syncedAt(time) }}
              }
            }
          }
        </p>
        <p class="hint">{{ text().syncHint }}</p>
        <div class="actions">
          <button type="button" class="button" (click)="cloud.sync()" [disabled]="cloud.status() === 'syncing'">
            {{ text().syncNow }}
          </button>
          <button type="button" class="button secondary" (click)="cloud.signOut()">{{ text().signOut }}</button>
        </div>
        <p class="hint">{{ text().signOutHint }}</p>

        <details class="danger">
          <summary>{{ text().deleteAccount }}</summary>
          <p>{{ text().deleteAccountText }}</p>
          <button type="button" class="button secondary" (click)="deleteAccount()">{{ text().deleteAccount }}</button>
        </details>
      } @else {
        <p>{{ text().accountIntro }}</p>
        <button type="button" class="button" (click)="cloud.signIn('/' + lang() + '/account')">
          {{ text().signInGithub }}
        </button>
        <p class="hint">
          {{ text().accountPrivacy }}
          <a [routerLink]="['/', lang(), 'privacy']">{{ text().privacy }}</a>
        </p>
      }

      @if (cloud.error() || message()) {
        <p class="message" role="alert">{{ message() || text().signInError(cloud.error()) }}</p>
      }
    </div>
  `,
  styles: `
    .account {
      max-width: 40rem;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin: 1rem 0 0.5rem;
    }
    .signed-in {
      font-weight: 600;
    }
    .hint,
    .sync {
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .danger {
      margin-top: 2.5rem;
      summary {
        cursor: pointer;
        color: var(--text-muted);
      }
    }
    .message {
      margin-top: 1.5rem;
      padding: 0.75rem 1rem;
      border-left: 3px solid var(--accent);
      background: var(--accent-soft);
    }
  `,
})
export default class AccountPage {
  private readonly title = inject(Title);
  protected readonly cloud = inject(CloudService);

  readonly lang = input.required<Lang>();
  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly message = signal('');
  protected readonly syncedTime = computed(() => {
    const time = this.cloud.lastSync();
    return time ? new Intl.DateTimeFormat(this.lang(), { timeStyle: 'short' }).format(time) : '';
  });

  constructor() {
    effect(() => this.title.setTitle(`${this.text().account} – ${this.text().appName}`));
  }

  protected async deleteAccount(): Promise<void> {
    if (!confirm(this.text().deleteAccountConfirm)) return;
    if (await this.cloud.deleteAccount()) this.message.set(this.text().accountDeleted);
  }
}
