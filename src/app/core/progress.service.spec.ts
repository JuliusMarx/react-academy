import { TestBed } from '@angular/core/testing';
import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let service: ProgressService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(ProgressService);
  });

  it('marks lessons as completed and computes percentages', () => {
    service.markCompleted('a/one');
    expect(service.isCompleted('a/one')).toBe(true);
    expect(service.percent(['a/one', 'a/two'])).toBe(50);

    service.markIncomplete('a/one');
    expect(service.percent(['a/one', 'a/two'])).toBe(0);
  });

  it('persists progress to localStorage', () => {
    service.markCompleted('a/one');
    const stored = JSON.parse(localStorage.getItem('react-academy.progress')!);
    expect(stored.completedLessons).toEqual(['a/one']);
  });

  it('round-trips through export and import', () => {
    service.markCompleted('a/one');
    service.saveQuizResult('a/one', 2, 3);
    const json = service.exportJson();

    service.reset();
    expect(service.isCompleted('a/one')).toBe(false);

    expect(service.importJson(json)).toBe(true);
    expect(service.isCompleted('a/one')).toBe(true);
    expect(service.progress().quizResults['a/one'].score).toBe(2);
  });

  it('tracks solved exercises and accepts older exports without them', () => {
    service.markExerciseSolved('a/one');
    expect(service.solvedExercises().has('a/one')).toBe(true);

    expect(service.importJson('{"version":1,"completedLessons":["a/two"],"quizResults":{}}')).toBe(true);
    expect(service.solvedExercises().size).toBe(0);
    expect(service.isCompleted('a/two')).toBe(true);
  });

  it('rejects invalid imports', () => {
    expect(service.importJson('not json')).toBe(false);
    expect(service.importJson('{"version":2}')).toBe(false);
  });
});
