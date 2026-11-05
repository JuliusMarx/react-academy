import { afterNextRender, computed, inject, Service, signal } from '@angular/core';
import { BrowserStorage } from './browser-storage';

export interface QuizResult {
  score: number;
  total: number;
  date: string;
}

/** A quiz question in the review queue (Leitner system). */
export interface ReviewItem {
  /** 0 after a wrong answer; each correct review moves it up one box. */
  box: number;
  /** ISO date from which the question is due again. */
  due: string;
}

/** Days until the next review per box. Answering correctly in the last box removes the question. */
export const REVIEW_INTERVALS = [1, 3, 7];

const DAY = 24 * 60 * 60 * 1000;

/** Key of a quiz question in the review queue: "<lesson id>#<question index>", the same in every language. */
export const reviewKey = (lessonId: string, question: number) => `${lessonId}#${question}`;

export interface Progress {
  version: 1;
  completedLessons: string[];
  quizResults: Record<string, QuizResult>;
  /** Lesson ids whose exercise passed all checks. Added later – older exports don't have it. */
  solvedExercises: string[];
  /** Quiz questions to review, by reviewKey(). Added later – older exports don't have it. */
  review: Record<string, ReviewItem>;
  /** Name and date on the certificate of completion, once it was created. */
  certificate?: { name: string; date: string };
  lastLesson?: string;
}

const STORAGE_KEY = 'react-academy.progress';
const emptyProgress = (): Progress => ({ version: 1, completedLessons: [], quizResults: {}, solvedExercises: [], review: {} });

@Service()
export class ProgressService {
  private readonly storage = inject(BrowserStorage);
  private readonly state = signal<Progress>(emptyProgress());
  /** Stored progress, kept aside until it is safe to show (see constructor). */
  private pending: Progress | undefined = this.readStored();

  constructor() {
    // Publish after hydration so the prerendered HTML (which knows no progress) matches the first client render.
    afterNextRender(() => {
      if (this.pending) this.state.set(this.pending);
      this.pending = undefined;
      this.loaded.set(true);
    });
  }

  readonly progress = this.state.asReadonly();
  /** False during prerendering and hydration, while the stored progress isn't published yet. */
  readonly loaded = signal(false);
  readonly completed = computed(() => new Set(this.state().completedLessons));
  readonly solvedExercises = computed(() => new Set(this.state().solvedExercises));

  isCompleted(lessonId: string): boolean {
    return this.completed().has(lessonId);
  }

  /** Share of the given lessons that are completed, 0–100. */
  percent(lessonIds: string[]): number {
    if (lessonIds.length === 0) return 0;
    const done = lessonIds.filter((id) => this.completed().has(id)).length;
    return Math.round((done / lessonIds.length) * 100);
  }

  markCompleted(lessonId: string): void {
    if (this.isCompleted(lessonId)) return;
    this.update((p) => ({ ...p, completedLessons: [...p.completedLessons, lessonId] }));
  }

  markIncomplete(lessonId: string): void {
    this.update((p) => ({ ...p, completedLessons: p.completedLessons.filter((id) => id !== lessonId) }));
  }

  saveQuizResult(lessonId: string, score: number, total: number): void {
    const result = { score, total, date: new Date().toISOString() };
    this.update((p) => ({ ...p, quizResults: { ...p.quizResults, [lessonId]: result } }));
  }

  markExerciseSolved(lessonId: string): void {
    if (this.solvedExercises().has(lessonId)) return;
    this.update((p) => ({ ...p, solvedExercises: [...p.solvedExercises, lessonId] }));
  }

  /** Adds questions answered wrongly to the review queue, due tomorrow. */
  addToReview(keys: string[], now = Date.now()): void {
    if (keys.length === 0) return;
    const item = { box: 0, due: dueDate(0, now) };
    this.update((p) => ({ ...p, review: { ...p.review, ...Object.fromEntries(keys.map((key) => [key, item])) } }));
  }

  /** Records a review answer: correct moves the question up a box (or out of the queue), wrong starts it over. */
  recordReview(key: string, correct: boolean, now = Date.now()): void {
    this.update((p) => {
      const review = { ...p.review };
      const box = correct ? (review[key]?.box ?? 0) + 1 : 0;
      if (box >= REVIEW_INTERVALS.length) delete review[key];
      else review[key] = { box, due: dueDate(box, now) };
      return { ...p, review };
    });
  }

  /** Removes questions from the queue, e.g. ones that no longer exist in the content. */
  removeFromReview(keys: string[]): void {
    this.update((p) => ({ ...p, review: Object.fromEntries(Object.entries(p.review).filter(([key]) => !keys.includes(key))) }));
  }

  /** Review keys that are due at `now`, the longest overdue first. */
  dueReviews(now = Date.now()): string[] {
    return Object.entries(this.state().review)
      .filter(([, item]) => Date.parse(item.due) <= now)
      .sort(([, a], [, b]) => a.due.localeCompare(b.due))
      .map(([key]) => key);
  }

  /** Creates the certificate, or changes its name (the date stays the day it was first created). */
  setCertificateName(name: string, now = Date.now()): void {
    this.update((p) => ({ ...p, certificate: { name, date: p.certificate?.date ?? new Date(now).toISOString() } }));
  }

  visit(lessonId: string): void {
    if (this.state().lastLesson !== lessonId) this.update((p) => ({ ...p, lastLesson: lessonId }));
  }

  exportJson(): string {
    return JSON.stringify(this.state(), null, 2);
  }

  /** Returns false if the JSON is not a valid progress export. */
  importJson(json: string): boolean {
    try {
      const data = JSON.parse(json) as Partial<Progress>;
      if (data.version !== 1 || !Array.isArray(data.completedLessons)) return false;
      this.update(() => ({ ...emptyProgress(), ...data }) as Progress);
      return true;
    } catch {
      return false;
    }
  }

  reset(): void {
    this.update(emptyProgress);
  }

  private update(fn: (p: Progress) => Progress): void {
    if (this.pending) {
      // Changes before hydration (e.g. visit()) must build on the stored progress, not overwrite it.
      this.pending = fn(this.pending);
      this.storage.write(STORAGE_KEY, this.pending);
      return;
    }
    this.state.update(fn);
    this.storage.write(STORAGE_KEY, this.state());
  }

  private readStored(): Progress | undefined {
    const stored = this.storage.read<Progress>(STORAGE_KEY);
    return stored?.version === 1 ? { ...emptyProgress(), ...stored } : undefined;
  }
}

/** Start of the local day `REVIEW_INTERVALS[box]` days after `now`, so "tomorrow" means from midnight. */
function dueDate(box: number, now: number): string {
  const day = new Date(now + REVIEW_INTERVALS[box] * DAY);
  day.setHours(0, 0, 0, 0);
  return day.toISOString();
}
