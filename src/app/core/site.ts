/** Public facts about this site that differ between the Academy forks. */
export const SITE = {
  repoUrl: 'https://github.com/JuliusMarx/react-academy',
  url: 'https://react-academy-de.netlify.app',
};

/** Link to a new GitHub issue about a lesson, with title and body filled in. */
export function reportIssueUrl(lesson: { id: string; title: string }, lang: string): string {
  const page = `${SITE.url}/${lang}/${lesson.id}`;
  const params = new URLSearchParams({
    title: `[${lang}/${lesson.id}] `,
    body: `Lektion / Lesson: ${lesson.title}\n${page}\n\nWas stimmt nicht? / What is wrong?\n\n`,
  });
  return `${SITE.repoUrl}/issues/new?${params}`;
}
