import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, inject, input, linkedSignal, signal } from '@angular/core';
import { Exercise as ExerciseDef, ExerciseResultsMessage, Lang, SolutionFile } from '../../content/content.model';
import { exampleLoaders } from '../../content/generated/examples';
import { ProgressService } from '../../core/progress.service';
import { UI_TEXT } from '../../core/ui-text';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { TryIt } from './try-it';

type CheckState = 'pending' | 'passed' | 'failed';

/**
 * The checks run inside the preview, which StackBlitz serves from a WebContainer domain
 * (e.g. https://…--4200--….local-credentialless.webcontainer.io) – only accept results from there.
 */
const TRUSTED_ORIGIN = /^https:\/\/([\w-]+\.)+(webcontainer\.io|webcontainer-api\.io)$/;

/**
 * An exercise: task, embedded starter project and a checklist that fills in automatically.
 * The checks run inside the preview (examples/_exercise-kit) and post their results here.
 */
@Component({
  selector: 'app-exercise',
  imports: [SafeHtmlPipe, TryIt],
  templateUrl: './exercise.html',
  styleUrl: './exercise.scss',
})
export class Exercise {
  private readonly progress = inject(ProgressService);
  private readonly document = inject(DOCUMENT);

  readonly exercise = input.required<ExerciseDef>();
  readonly lessonId = input.required<string>();
  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly solved = computed(() => this.progress.solvedExercises().has(this.lessonId()));

  /** Latest result per check; reset when the exercise changes (navigating between lessons). */
  protected readonly results = linkedSignal<ExerciseDef, Record<string, { passed: boolean; message?: string }>>({
    source: this.exercise,
    computation: () => ({}),
  });
  protected readonly hasResults = computed(() => Object.keys(this.results()).length > 0);
  protected readonly passedCount = computed(() => Object.values(this.results()).filter((r) => r.passed).length);
  protected readonly allPassed = computed(
    () => this.hasResults() && this.passedCount() === this.exercise().checks.length,
  );

  protected readonly solution = signal<SolutionFile[] | null>(null);
  protected readonly showSolution = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) return;
      const onMessage = (event: MessageEvent) => this.onMessage(event);
      view.addEventListener('message', onMessage);
      destroyRef.onDestroy(() => view.removeEventListener('message', onMessage));
    });
  }

  protected stateOf(checkId: string): CheckState {
    const result = this.results()[checkId];
    return !result ? 'pending' : result.passed ? 'passed' : 'failed';
  }

  protected messageOf(checkId: string): string | undefined {
    return this.results()[checkId]?.message;
  }

  protected async toggleSolution(): Promise<void> {
    if (!this.solution()) {
      const example = await exampleLoaders[this.exercise().example]();
      this.solution.set(example.solution ?? []);
    }
    this.showSolution.update((v) => !v);
  }

  private onMessage(event: MessageEvent): void {
    const data = event.data as Partial<ExerciseResultsMessage> | null;
    if (data?.type !== 'react-academy:exercise-results' || data.exercise !== this.exercise().example) return;
    if (!TRUSTED_ORIGIN.test(event.origin) || !Array.isArray(data.results)) return;

    const known = new Set(this.exercise().checks.map((c) => c.id));
    const results: Record<string, { passed: boolean; message?: string }> = {};
    for (const r of data.results) {
      if (known.has(r.id)) results[r.id] = { passed: r.passed === true, message: r.message };
    }
    this.results.set(results);
    if (this.allPassed()) this.progress.markExerciseSolved(this.lessonId());
  }
}
