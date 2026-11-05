import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  linkedSignal,
  resource,
  signal,
  viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Lang, LessonSummary, QuizQuestion } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { quizLoaders } from '../../content/generated/quizzes';
import { ProgressService } from '../../core/progress.service';
import { UI_TEXT } from '../../core/ui-text';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';

const DAY = 24 * 60 * 60 * 1000;

interface ReviewCard {
  key: string;
  lesson: LessonSummary & { chapter: string };
  question: QuizQuestion;
}

/** Spaced repetition: asks the due quiz questions one by one, with feedback after each. */
@Component({
  selector: 'app-review-page',
  imports: [RouterLink, SafeHtmlPipe],
  templateUrl: './review-page.html',
  styleUrl: './review-page.scss',
})
export default class ReviewPage {
  private readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);
  private readonly title = inject(Title);
  private readonly injector = inject(Injector);
  private readonly heading = viewChild<ElementRef<HTMLElement>>('heading');
  /** "Now" for this visit, so questions don't become due while you answer. */
  private readonly now = Date.now();

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);

  private readonly quizzes = resource({
    params: () => this.lang(),
    loader: ({ params }) => quizLoaders[params](),
  });
  protected readonly ready = computed(() => this.progress.loaded() && this.quizzes.hasValue());

  protected readonly due = computed(() => this.progress.dueReviews(this.now));
  protected readonly allKeys = computed(() => Object.keys(this.progress.progress().review));
  /** Days until the next question that is not due yet. */
  protected readonly nextInDays = computed(() => {
    const upcoming = Object.values(this.progress.progress().review).map((item) => Date.parse(item.due) - this.now);
    return Math.max(1, Math.ceil(Math.min(...upcoming) / DAY));
  });

  /** Questions of the running session; null before it starts. Resets when the language changes. */
  protected readonly cards = linkedSignal<Lang, ReviewCard[] | null>({ source: this.lang, computation: () => null });
  protected readonly index = signal(0);
  protected readonly selected = signal<number | null>(null);
  protected readonly checked = signal(false);
  protected readonly correctCount = signal(0);

  protected readonly current = computed(() => this.cards()?.[this.index()]);
  protected readonly isCorrect = computed(() => this.selected() === this.current()?.question.answer);
  protected readonly isLast = computed(() => this.index() >= (this.cards()?.length ?? 0) - 1);

  constructor() {
    effect(() => this.title.setTitle(`${this.text().review} – ${this.text().appName}`));
  }

  protected start(keys: string[]): void {
    const lessons = new Map(this.content.allLessons(this.lang()).map((l) => [l.id, l]));
    const quizzes = this.quizzes.value() ?? {};
    const cards: ReviewCard[] = [];
    const missing: string[] = [];
    for (const key of keys) {
      const split = key.lastIndexOf('#');
      const lesson = lessons.get(key.slice(0, split));
      const question = quizzes[key.slice(0, split)]?.[Number(key.slice(split + 1))];
      if (lesson && question) cards.push({ key, lesson, question });
      else missing.push(key);
    }
    // Lessons or questions that were removed from the course can't be reviewed any more.
    if (missing.length) this.progress.removeFromReview(missing);
    this.cards.set(cards);
    this.index.set(0);
    this.correctCount.set(0);
    this.reset();
    this.focusHeading();
  }

  protected check(): void {
    const card = this.current();
    if (!card || this.selected() === null) return;
    this.checked.set(true);
    this.progress.recordReview(card.key, this.isCorrect());
    if (this.isCorrect()) this.correctCount.update((n) => n + 1);
  }

  protected next(): void {
    this.index.update((i) => i + 1);
    this.reset();
    this.focusHeading();
  }

  private reset(): void {
    this.selected.set(null);
    this.checked.set(false);
  }

  /** Moves focus to the new question (or result), for keyboard and screen reader users. */
  private focusHeading(): void {
    afterNextRender(() => this.heading()?.nativeElement.focus(), { injector: this.injector });
  }
}
