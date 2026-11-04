import { DOCUMENT } from '@angular/common';
import { Component, computed, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import type { Project } from '@stackblitz/sdk';
import { Example, Lang } from '../../content/content.model';
import { exampleLoaders } from '../../content/generated/examples';
import { UI_TEXT } from '../../core/ui-text';

type State = 'idle' | 'loading' | 'ready' | 'error';

/** Embeds a runnable React project (StackBlitz WebContainer) on demand. */
@Component({
  selector: 'app-try-it',
  template: `
    @if (state() === 'idle' || state() === 'error') {
      <div class="teaser">
        <button type="button" class="button" (click)="open()">{{ label() ?? text().tryIt }}</button>
        <p>{{ state() === 'error' ? text().tryItError : (hint() ?? text().tryItHint) }}</p>
      </div>
    }
    @if (state() === 'loading') {
      <p class="status" aria-live="polite">{{ text().tryItLoading }}</p>
    }
    <div #frame class="frame" [class.visible]="state() === 'loading' || state() === 'ready'"></div>
    <button type="button" class="new-tab" (click)="openInNewTab()">
      {{ text().openInStackblitz }} <span aria-hidden="true">↗</span>
    </button>
  `,
  styles: `
    :host {
      display: block;
      margin: 1.5rem 0;
    }
    .teaser {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      padding: 1rem 1.25rem;
      border: 1px dashed var(--accent);
      border-radius: 0.6rem;
      background: var(--accent-soft);
      p {
        flex: 1 1 16rem;
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-muted);
      }
    }
    .status {
      color: var(--text-muted);
    }
    .frame {
      display: none;
      border: 1px solid var(--border);
      border-radius: 0.6rem;
      overflow: hidden;
      &.visible {
        display: block;
      }
    }
    .new-tab {
      margin-top: 0.4rem;
      padding: 0.2rem 0;
      border: 0;
      background: none;
      color: var(--accent-text);
      font: inherit;
      font-size: 0.85rem;
      text-decoration: underline;
      cursor: pointer;
    }
    .frame ::ng-deep iframe {
      display: block;
      width: 100%;
      height: 32rem;
      border: 0;
    }
  `,
})
export class TryIt {
  private readonly document = inject(DOCUMENT);

  readonly example = input.required<string>();
  readonly lang = input.required<Lang>();
  /** Overrides for the button text and hint, e.g. for exercises. */
  readonly label = input<string>();
  readonly hint = input<string>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly state = signal<State>('idle');
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');

  protected async open(): Promise<void> {
    this.state.set('loading');
    try {
      const { sdk, example } = await this.load();
      // The SDK replaces the target element with its iframe, so hand it a fresh one each time.
      const target = this.document.createElement('div');
      this.frame().nativeElement.replaceChildren(target);
      await sdk.embedProject(target, this.toProject(example), {
        openFile: example.openFile,
        view: 'default',
        height: 512,
        hideNavigation: true,
        // WebContainers need SharedArrayBuffer; requires the COOP/COEP headers in netlify.toml / angular.json.
        crossOriginIsolated: true,
      });
      this.state.set('ready');
    } catch (error) {
      console.error(error);
      this.state.set('error');
    }
  }

  /**
   * Runs the project on stackblitz.com in a new tab. The tab is opened synchronously in the click
   * handler – opening it only after the example has loaded gets it blocked as a pop-up, and a
   * re-opened (GET) /run request lands on the StackBlitz home page.
   */
  protected async openInNewTab(): Promise<void> {
    const windowName = `stackblitz-${this.example()}`;
    const tab = this.document.defaultView?.open('about:blank', windowName);
    const { example } = await this.load();
    const project = this.toProject(example);

    const form = this.document.createElement('form');
    form.method = 'POST';
    form.action = `https://stackblitz.com/run?file=${encodeURIComponent(example.openFile)}`;
    form.target = tab ? windowName : '_self';
    form.hidden = true;
    const fields: Record<string, string> = {
      'project[title]': project.title,
      'project[template]': project.template,
      ...Object.fromEntries(Object.entries(project.files).map(([path, code]) => [`project[files][${path}]`, code])),
    };
    for (const [name, value] of Object.entries(fields)) {
      const input = this.document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.append(input);
    }
    this.document.body.append(form);
    form.submit();
    form.remove();
  }

  private async load() {
    const [{ default: sdk }, example] = await Promise.all([
      import('@stackblitz/sdk'),
      exampleLoaders[this.example()](),
    ]);
    return { sdk, example };
  }

  private toProject(example: Example): Project {
    return {
      title: `React Academy – ${example.id}`,
      template: 'node',
      files: example.files,
    };
  }
}
