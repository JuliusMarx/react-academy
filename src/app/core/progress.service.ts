import { afterNextRender, computed, inject, Service, signal } from '@angular/core';
import { BrowserStorage } from './browser-storage';

export interface QuizResult {
  score: number;
  total: number;
  date: string;
}

export interface Progress {
  version: 1;
  completedLessons: string[];
  quizResults: Record<string, QuizResult>;
  /** Lesson ids whose exercise passed all checks. Added later – older exports don't have it. */
  solvedExercises: string[];
  lastLesson?: string;
}

const STORAGE_KEY = 'react-academy.progress';
const emptyProgress = (): Progress => ({ version: 1, completedLessons: [], quizResults: {}, solvedExercises: [] });

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
    });
  }

  readonly progress = this.state.asReadonly();
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
