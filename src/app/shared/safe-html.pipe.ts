import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Marks HTML as trusted. Only use it for content generated at build time from
 * our own Markdown files (see scripts/build-content.mjs) – never for user input.
 */
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
