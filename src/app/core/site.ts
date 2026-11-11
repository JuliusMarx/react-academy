/** Public facts about this site that differ between the Academy forks. */
export const SITE = {
  repoUrl: 'https://github.com/JuliusMarx/react-academy',
  url: 'https://react-academy-de.netlify.app',
  /** Storage keys in the visitor's browser, listed in the privacy policy. */
  storagePrefix: 'react-academy',
  /** Operator for the imprint and privacy policy. */
  operator: {
    name: 'Julius Marx',
    street: 'Mühlenstr. 19a',
    city: '53947 Nettersheim',
    country: 'Deutschland',
    email: 'julius.marx.1@gmx.de',
  },
  /**
   * Supabase project for the optional account (GitHub login, progress in the cloud) – one project for
   * both Academies, see docs/cloud-setup.md. Both values are public by design (the database is
   * protected by row level security). Empty: no account feature, the site stays fully static.
   */
  cloud: {
    url: 'https://vqvamsbueximthbbgdeo.supabase.co',
    key: 'sb_publishable_4D7Ts0zWUDRNgIlHPdn-3g_36tAHGEU',
    /**
     * Whether Supabase can send emails to anyone (custom SMTP set up). Without it, "Confirm email" is off
     * in Supabase, new email accounts work right away and "Forgot your password?" is hidden.
     */
    emails: false,
  },
  /** Date of the privacy policy, shown at its end. */
  privacyDate: '2026-11-11',
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
