export const LANGS = ['de', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang);

export interface LessonSummary {
  /** "<chapter>/<lesson>", identical across languages. */
  id: string;
  slug: string;
  title: string;
  minutes: number;
  /** Reading time of the quick-course summary. */
  summaryMinutes: number;
}

export interface Chapter {
  slug: string;
  title: string;
  description: string;
  lessons: LessonSummary[];
}

export type LessonSegment = { type: 'html'; html: string } | { type: 'tryit'; example: string };

export interface QuizQuestion {
  /** Question and options: HTML-escaped text with `code` spans, rendered at build time. */
  question: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  /** Inline HTML rendered from Markdown at build time. */
  explanation?: string;
}

export interface TocEntry {
  /** Anchor id of the h2 heading. */
  id: string;
  text: string;
}

export interface ExerciseCheck {
  /** Matches the id in the exercise project's checks.ts. */
  id: string;
  /** Inline HTML rendered from Markdown at build time. */
  label: string;
}

export interface Exercise {
  /** Id of the exercise project in examples/. */
  example: string;
  title: string;
  /** HTML rendered from Markdown at build time. */
  task: string;
  checks: ExerciseCheck[];
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  toc: TocEntry[];
  segments: LessonSegment[];
  /** Short version for the quick course: HTML rendered from Markdown at build time. */
  summary: string;
  /** Reading time of the summary. */
  summaryMinutes: number;
  quiz: QuizQuestion[];
  exercise?: Exercise;
}

export interface SolutionFile {
  path: string;
  /** Highlighted HTML rendered at build time. */
  html: string;
}

export interface Example {
  id: string;
  openFile: string;
  files: Record<string, string>;
  /** Only for exercises. */
  solution?: SolutionFile[];
}

/** One searchable lesson section, generated at build time. */
export interface SearchDoc {
  /** "<lesson id>#<anchor>" – unique. */
  id: string;
  lesson: string;
  lessonTitle: string;
  chapter: string;
  /** h2 id to jump to; empty for the lesson intro. */
  anchor: string;
  heading: string;
  text: string;
  exercise?: true;
}

/** Message the exercise check kit (examples/_exercise-kit) posts to the course page. */
export interface ExerciseResultsMessage {
  type: 'react-academy:exercise-results';
  exercise: string;
  results: { id: string; passed: boolean; message?: string }[];
}
