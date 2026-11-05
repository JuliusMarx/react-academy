import { TestBed } from '@angular/core/testing';
import { ProgressService, reviewKey } from './progress.service';

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

  it('keeps the certificate date when the name changes', () => {
    service.setCertificateName('Erika', Date.UTC(2026, 10, 5));
    service.setCertificateName('Erika Mustermann', Date.UTC(2026, 11, 24));
    expect(service.progress().certificate).toEqual({ name: 'Erika Mustermann', date: '2026-11-05T00:00:00.000Z' });
  });

  describe('review queue', () => {
    const day = 24 * 60 * 60 * 1000;
    const now = new Date(2026, 10, 5, 18, 0).getTime();
    const key = reviewKey('a/one', 1);

    it('adds wrong answers for tomorrow and moves them up a box per correct review', () => {
      service.addToReview([key], now);
      expect(service.dueReviews(now)).toEqual([]);
      // Due from midnight on, not only 24 hours later.
      expect(service.dueReviews(new Date(2026, 10, 6, 0, 1).getTime())).toEqual([key]);

      service.recordReview(key, true, now + day);
      expect(service.progress().review[key].box).toBe(1);
      expect(service.dueReviews(now + 3 * day)).toEqual([]);
      expect(service.dueReviews(now + 4 * day)).toEqual([key]);
    });

    it('starts a question over after a wrong review and drops it after the last box', () => {
      service.addToReview([key], now);
      service.recordReview(key, true, now);
      service.recordReview(key, false, now);
      expect(service.progress().review[key].box).toBe(0);

      service.recordReview(key, true, now);
      service.recordReview(key, true, now);
      service.recordReview(key, true, now);
      expect(service.progress().review[key]).toBeUndefined();
    });

    it('accepts older exports without a review queue', () => {
      expect(service.importJson('{"version":1,"completedLessons":[],"quizResults":{}}')).toBe(true);
      expect(service.dueReviews()).toEqual([]);
    });
  });
});
