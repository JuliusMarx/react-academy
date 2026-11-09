import { RenderMode, ServerRoute } from '@angular/ssr';
import { LANGS } from './content/content.model';
import { curriculum } from './content/generated/curriculum';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS.map((lang) => ({ lang })),
  },
  {
    path: ':lang/imprint',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS.map((lang) => ({ lang })),
  },
  {
    path: ':lang/privacy',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS.map((lang) => ({ lang })),
  },
  {
    path: ':lang/cheatsheet',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS.map((lang) => ({ lang })),
  },
  {
    path: ':lang/certificate',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS.map((lang) => ({ lang })),
  },
  {
    path: ':lang/notes',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS.map((lang) => ({ lang })),
  },
  {
    path: ':lang/glossary',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS.map((lang) => ({ lang })),
  },
  {
    path: ':lang/review',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS.map((lang) => ({ lang })),
  },
  {
    path: ':lang/placement',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS.map((lang) => ({ lang })),
  },
  {
    path: ':lang/:chapter/:lesson',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      LANGS.flatMap((lang) =>
        curriculum[lang].flatMap((chapter) =>
          chapter.lessons.map((lesson) => ({ lang, chapter: chapter.slug, lesson: lesson.slug })),
        ),
      ),
  },
  { path: '**', renderMode: RenderMode.Client },
];
