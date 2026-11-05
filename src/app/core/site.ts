/** Public facts about this site that differ between the Academy forks. */
export const SITE = {
  repoUrl: 'https://github.com/JuliusMarx/react-academy',
  url: 'https://react-academy-de.netlify.app',
  /** Storage keys in the visitor's browser, listed in the privacy policy. */
  storagePrefix: 'react-academy',
  /**
   * Operator for the imprint and privacy policy.
   * TODO: fill in before publishing – the pages show these placeholders until then.
   */
  operator: {
    name: '[Vor- und Nachname]',
    street: '[Straße und Hausnummer]',
    city: '[PLZ und Ort]',
    country: 'Deutschland',
    email: '[E-Mail-Adresse]',
  },
  /** Date of the privacy policy, shown at its end. */
  privacyDate: '2026-11-05',
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
