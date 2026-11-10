import type { Progress } from './progress.service';

/**
 * Combines two progress states that both changed independently (e.g. on two devices before they
 * synced). Nothing learned is lost: lists are united, and per entry the more recent or more advanced
 * value wins. Removals on one side (unmarking a lesson, removing a bookmark) can come back this way –
 * which is why sync only merges when both sides really changed and otherwise takes the newer state.
 */
export function mergeProgress(local: Progress, remote: Progress): Progress {
  const notes = { ...remote.notes };
  for (const [id, note] of Object.entries(local.notes)) notes[id] = mergeNote(note, notes[id]);

  const quizResults = { ...remote.quizResults };
  for (const [id, result] of Object.entries(local.quizResults)) {
    const other = quizResults[id];
    if (!other || result.date > other.date) quizResults[id] = result;
  }

  // A question still in the review queue on one side wasn't mastered there – keep it, with the lower box.
  const review = { ...remote.review };
  for (const [key, item] of Object.entries(local.review)) {
    const other = review[key];
    if (!other || item.box < other.box || (item.box === other.box && item.due < other.due)) review[key] = item;
  }

  const certificate =
    local.certificate && remote.certificate
      ? { name: local.certificate.name, date: local.certificate.date < remote.certificate.date ? local.certificate.date : remote.certificate.date }
      : (local.certificate ?? remote.certificate);

  return {
    ...remote,
    ...local,
    version: 1,
    completedLessons: union(remote.completedLessons, local.completedLessons),
    solvedExercises: union(remote.solvedExercises, local.solvedExercises),
    bookmarks: union(remote.bookmarks, local.bookmarks),
    quizResults,
    review,
    notes,
    ...(certificate ? { certificate } : {}),
    lastLesson: local.lastLesson ?? remote.lastLesson,
  };
}

/** Keeps the longer note if one contains the other (typical: written on, then synced) – otherwise both. */
function mergeNote(local: string, remote: string | undefined): string {
  if (!remote || local.includes(remote)) return local;
  if (remote.includes(local)) return remote;
  return `${local}\n\n${remote}`;
}

function union(a: string[], b: string[]): string[] {
  return [...new Set([...a, ...b])];
}
