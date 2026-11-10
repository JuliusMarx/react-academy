import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang } from '../../content/content.model';
import { CloudService } from '../../core/cloud.service';
import { SITE } from '../../core/site';
import { UI_TEXT } from '../../core/ui-text';

/** Sign in with GitHub or email so the progress is saved in the cloud and shows up on every device. */
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
        @if (cloud.recovery()) {
          <form class="email-form" (submit)="setPassword($event, newPassword.value)">
            <h2>{{ text().newPasswordTitle }}</h2>
            <label for="new-password">{{ text().newPassword }}</label>
            <input #newPassword id="new-password" type="password" autocomplete="new-password" minlength="8" required />
            <button type="submit" class="button">{{ text().savePassword }}</button>
          </form>
        }
        <p class="signed-in">{{ text().signedInAs(user.name) }}</p>
        @if (cloud.isAdmin()) {
          <p><a [routerLink]="['/', lang(), 'admin']">{{ text().adminDashboard }}</a></p>
        }
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
        <button type="button" class="button" (click)="cloud.signIn(returnPath())">
          {{ text().signInGithub }}
        </button>

        <form class="email-form" (submit)="submitEmail($event, email.value, password.value)">
          <h2>{{ mode() === 'sign-in' ? text().emailSignIn : text().emailSignUp }}</h2>
          <label for="account-email">{{ text().email }}</label>
          <input #email id="account-email" type="email" autocomplete="email" required />
          <label for="account-password">{{ text().password }}</label>
          <input
            #password
            id="account-password"
            type="password"
            [attr.autocomplete]="mode() === 'sign-in' ? 'current-password' : 'new-password'"
            minlength="8"
            required
            aria-describedby="password-hint"
          />
          <p id="password-hint" class="hint">{{ text().passwordHint }}</p>
          <div class="actions">
            <button type="submit" class="button" [disabled]="busy()">
              {{ mode() === 'sign-in' ? text().signInAction : text().signUpAction }}
            </button>
            <button type="button" class="link" (click)="mode.set(mode() === 'sign-in' ? 'sign-up' : 'sign-in')">
              {{ mode() === 'sign-in' ? text().switchToSignUp : text().switchToSignIn }}
            </button>
            @if (mode() === 'sign-in' && emails) {
              <button type="button" class="link" (click)="forgot(email)">{{ text().forgotPassword }}</button>
            }
          </div>
        </form>
        <p class="hint">
          {{ text().accountPrivacy }}
          <a [routerLink]="['/', lang(), 'privacy']">{{ text().privacy }}</a>
        </p>
      }

      @if (noticeText(); as notice) {
        <p class="message" role="status">{{ notice }}</p>
      }
      @if (cloud.error() || message()) {
        <p class="message" role="alert">{{ message() || errorText() }}</p>
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
    .email-form {
      display: grid;
      gap: 0.4rem;
      max-width: 24rem;
      margin: 2rem 0 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      h2 {
        margin: 0 0 0.5rem;
        font-size: 1.1rem;
      }
      label {
        font-weight: 600;
      }
      input {
        padding: 0.55rem 0.8rem;
        border: 1px solid var(--border-strong);
        border-radius: 0.5rem;
        background: var(--bg);
        color: var(--text);
        font: inherit;
      }
      .actions {
        align-items: center;
      }
    }
    .link {
      padding: 0;
      border: 0;
      background: none;
      color: var(--accent-text);
      font: inherit;
      text-decoration: underline;
      cursor: pointer;
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
  protected readonly mode = signal<'sign-in' | 'sign-up'>('sign-in');
  protected readonly busy = signal(false);
  /** Password reset needs email delivery (see SITE.cloud.emails). */
  protected readonly emails = SITE.cloud.emails;
  protected readonly returnPath = computed(() => `/${this.lang()}/account`);
  protected readonly noticeText = computed(() => {
    const notice = this.cloud.notice();
    return notice ? this.text().cloudNotice[notice] : '';
  });
  /** Known Supabase errors in the visitor's language, anything else as Supabase phrased it. */
  protected readonly errorText = computed(() => {
    const known = this.text().authErrors as Record<string, string>;
    return known[this.cloud.errorCode()] ?? this.text().signInError(this.cloud.error());
  });
  protected readonly syncedTime = computed(() => {
    const time = this.cloud.lastSync();
    return time ? new Intl.DateTimeFormat(this.lang(), { timeStyle: 'short' }).format(time) : '';
  });

  constructor() {
    effect(() => this.title.setTitle(`${this.text().account} – ${this.text().appName}`));
  }

  protected async submitEmail(event: Event, email: string, password: string): Promise<void> {
    event.preventDefault();
    this.message.set('');
    this.busy.set(true);
    try {
      if (this.mode() === 'sign-in') await this.cloud.signInWithEmail(email.trim(), password);
      else await this.cloud.signUpWithEmail(email.trim(), password, this.returnPath());
    } finally {
      this.busy.set(false);
    }
  }

  protected async forgot(email: HTMLInputElement): Promise<void> {
    this.message.set('');
    if (!email.value.trim() || !email.checkValidity()) {
      this.message.set(this.text().forgotNeedsEmail);
      email.focus();
      return;
    }
    await this.cloud.resetPassword(email.value.trim(), this.returnPath());
  }

  protected async setPassword(event: Event, password: string): Promise<void> {
    event.preventDefault();
    await this.cloud.updatePassword(password);
  }

  protected async deleteAccount(): Promise<void> {
    if (!confirm(this.text().deleteAccountConfirm)) return;
    if (await this.cloud.deleteAccount()) this.message.set(this.text().accountDeleted);
  }
}
