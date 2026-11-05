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
  viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Chapter, Lang, QuizQuestion } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { placementLoaders } from '../../content/generated/placement';
import { ProgressService } from '../../core/progress.service';
import { UI_TEXT } from '../../core/ui-text';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';

/** Answer value for "I don't know". */
const DONT_KNOW = -1;

interface PlacementChapter extends Chapter {
  question: QuizQuestion;
}

/**
 * Placement test: one quiz question per chapter (picked in _chapter.md). Chapters answered
 * correctly can be marked as done, so learners skip what they already know.
 */
@Component({
  selector: 'app-placement-page',
  imports: [RouterLink, SafeHtmlPipe],
  templateUrl: './placement-page.html',
  styleUrl: './placement-page.scss',
})
export default class PlacementPage {
  private readonly content = inject(ContentService);
  private readonly progress = inject(ProgressService);
  private readonly title = inject(Title);
  private readonly injector = inject(Injector);
  private readonly heading = viewChild<ElementRef<HTMLElement>>('heading');

  readonly lang = input.required<Lang>();

  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly dontKnow = DONT_KNOW;

  private readonly questions = resource({
    params: () => this.lang(),
    loader: ({ params }) => placementLoaders[params](),
  });

  protected readonly chapters = computed<PlacementChapter[]>(() => {
    const questions = new Map((this.questions.value() ?? []).map((q) => [q.chapter, q.question]));
    return this.content.chapters(this.lang()).flatMap((chapter) => {
      const question = questions.get(chapter.slug);
      return question ? [{ ...chapter, question }] : [];
    });
  });

  /** Selected option per chapter slug (DONT_KNOW for "I don't know"); everything resets when the language changes. */
  protected readonly answers = linkedSignal<Lang, Record<string, number>>({ source: this.lang, computation: () => ({}) });
  protected readonly finished = linkedSignal({ source: this.lang, computation: () => false });
  /** Number of lessons marked as done, once the result was applied. */
  protected readonly applied = linkedSignal<Lang, number | null>({ source: this.lang, computation: () => null });

  protected readonly results = computed(() =>
    this.chapters().map((chapter) => ({ ...chapter, known: this.answers()[chapter.slug] === chapter.question.answer })),
  );
  protected readonly knownChapters = computed(() => this.results().filter((c) => c.known));
  protected readonly knownLessons = computed(() => this.knownChapters().flatMap((c) => c.lessons));
  /** First lesson of the first chapter that is left to learn. */
  protected readonly firstToLearn = computed(() => {
    const chapter = this.results().find((c) => !c.known);
    const lesson = chapter?.lessons[0];
    return chapter && lesson ? { ...lesson, chapter: chapter.slug } : undefined;
  });

  constructor() {
    effect(() => this.title.setTitle(`${this.text().placement} – ${this.text().appName}`));
  }

  protected select(chapter: string, option: number): void {
    this.answers.update((answers) => ({ ...answers, [chapter]: option }));
  }

  protected finish(): void {
    this.finished.set(true);
    this.focusHeading();
  }

  protected apply(): void {
    const lessons = this.knownLessons();
    for (const lesson of lessons) this.progress.markCompleted(lesson.id);
    // "Continue learning" on the home page then leads to the first lesson that is left.
    const next = this.firstToLearn();
    if (next) this.progress.visit(next.id);
    this.applied.set(lessons.length);
  }

  protected restart(): void {
    this.answers.set({});
    this.finished.set(false);
    this.applied.set(null);
    this.focusHeading();
  }

  /** Moves focus (and the scroll position) to the new heading, for keyboard and screen reader users. */
  private focusHeading(): void {
    afterNextRender(() => this.heading()?.nativeElement.focus(), { injector: this.injector });
  }
}
