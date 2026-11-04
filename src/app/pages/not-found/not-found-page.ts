import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lang } from '../../content/content.model';
import { UI_TEXT } from '../../core/ui-text';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <div class="prose">
      <h1>{{ text().notFound }}</h1>
      <p>{{ text().notFoundText }}</p>
      <a class="button" [routerLink]="['/', lang()]">{{ text().backHome }}</a>
    </div>
  `,
})
export default class NotFoundPage {
  readonly lang = input.required<Lang>();
  protected readonly text = computed(() => UI_TEXT[this.lang()]);
}
