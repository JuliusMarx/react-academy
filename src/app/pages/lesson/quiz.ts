import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { Lang, QuizQuestion } from '../../content/content.model';
import { ProgressService } from '../../core/progress.service';
import { UI_TEXT } from '../../core/ui-text';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';

@Component({
  selector: 'app-quiz',
  imports: [SafeHtmlPipe],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  private readonly progress = inject(ProgressService);

  readonly questions = input.required<QuizQuestion[]>();
  readonly lessonId = input.required<string>();
  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  /** Selected option index per question; reset whenever the questions change. */
  protected readonly answers = linkedSignal<QuizQuestion[], (number | null)[]>({
    source: this.questions,
    computation: (questions) => questions.map(() => null),
  });
  protected readonly submitted = linkedSignal({ source: this.questions, computation: () => false });

  protected readonly complete = computed(() => this.answers().every((a) => a !== null));
  protected readonly score = computed(
    () => this.questions().filter((q, i) => this.answers()[i] === q.answer).length,
  );
  protected readonly perfect = computed(() => this.score() === this.questions().length);
  protected readonly idPrefix = computed(() => `quiz-${this.lessonId().replace(/\W/g, '-')}`);

  protected select(question: number, option: number): void {
    if (this.submitted()) return;
    this.answers.update((a) => a.map((v, i) => (i === question ? option : v)));
  }

  protected submit(): void {
    this.submitted.set(true);
    this.progress.saveQuizResult(this.lessonId(), this.score(), this.questions().length);
    if (this.perfect()) this.progress.markCompleted(this.lessonId());
  }

  protected retry(): void {
    this.submitted.set(false);
    this.answers.set(this.questions().map(() => null));
  }
}
