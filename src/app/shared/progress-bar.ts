import { Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  template: `
    <div
      class="track"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-valuenow]="value()"
      [attr.aria-label]="label()"
    >
      <div class="fill" [style.width.%]="value()"></div>
    </div>
    <span class="value">{{ value() }}%</span>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .track {
      flex: 1;
      height: 0.5rem;
      border-radius: 999px;
      background: var(--surface-hover);
      overflow: hidden;
    }
    .fill {
      height: 100%;
      border-radius: inherit;
      background: var(--success);
      transition: width 0.3s ease;
    }
    .value {
      min-width: 2.5rem;
      text-align: right;
      font-size: 0.8rem;
      font-variant-numeric: tabular-nums;
      color: var(--text-muted);
    }
  `,
})
export class ProgressBar {
  readonly value = input.required<number>();
  readonly label = input.required<string>();
}
