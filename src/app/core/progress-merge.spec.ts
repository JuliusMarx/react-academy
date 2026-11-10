import { mergeProgress } from './progress-merge';
import { normalizeProgress, Progress } from './progress.service';

const progress = (data: Partial<Progress>): Progress => normalizeProgress({ version: 1, completedLessons: [], ...data })!;

describe('mergeProgress', () => {
  it('keeps everything learned on either side', () => {
    const local = progress({
      completedLessons: ['a/one', 'a/two'],
      bookmarks: ['a/two'],
      quizResults: { 'a/one': { score: 3, total: 3, date: '2026-11-09T10:00:00Z' } },
      lastLesson: 'a/two',
    });
    const remote = progress({
      completedLessons: ['a/one', 'b/one'],
      solvedExercises: ['b/one'],
      bookmarks: ['b/one'],
      quizResults: {
        'a/one': { score: 1, total: 3, date: '2026-11-08T10:00:00Z' },
        'b/one': { score: 2, total: 2, date: '2026-11-08T10:00:00Z' },
      },
      lastLesson: 'b/one',
    });

    const merged = mergeProgress(local, remote);
    expect(merged.completedLessons).toEqual(['a/one', 'b/one', 'a/two']);
    expect(merged.solvedExercises).toEqual(['b/one']);
    expect(merged.bookmarks).toEqual(['b/one', 'a/two']);
    expect(merged.quizResults['a/one'].score).toBe(3);
    expect(merged.quizResults['b/one'].score).toBe(2);
    expect(merged.lastLesson).toBe('a/two');
  });

  it('combines notes without duplicating text', () => {
    const merged = mergeProgress(
      progress({ notes: { same: 'A', longer: 'Start and more', different: 'Here' } }),
      progress({ notes: { same: 'A', longer: 'Start', different: 'There', remoteOnly: 'R' } }),
    );
    expect(merged.notes).toEqual({ same: 'A', longer: 'Start and more', different: 'Here\n\nThere', remoteOnly: 'R' });
  });

  it('keeps a review question in the lower box and the earliest certificate date', () => {
    const merged = mergeProgress(
      progress({ review: { q: { box: 2, due: '2026-11-20' } }, certificate: { name: 'Neu', date: '2026-11-09' } }),
      progress({ review: { q: { box: 0, due: '2026-11-10' } }, certificate: { name: 'Alt', date: '2026-11-01' } }),
    );
    expect(merged.review['q'].box).toBe(0);
    expect(merged.certificate).toEqual({ name: 'Neu', date: '2026-11-01' });
  });
});
