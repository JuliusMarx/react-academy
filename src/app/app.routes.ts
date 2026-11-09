import { Routes } from '@angular/router';
import { isLang } from './content/content.model';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'de' },
  {
    path: ':lang',
    canMatch: [(_route: unknown, segments: { path: string }[]) => isLang(segments[0]?.path)],
    loadComponent: () => import('./layout/shell'),
    children: [
      { path: '', loadComponent: () => import('./pages/home/home-page') },
      { path: 'placement', loadComponent: () => import('./pages/placement/placement-page') },
      { path: 'review', loadComponent: () => import('./pages/review/review-page') },
      { path: 'imprint', loadComponent: () => import('./pages/legal/imprint-page') },
      { path: 'privacy', loadComponent: () => import('./pages/legal/privacy-page') },
      { path: 'cheatsheet', loadComponent: () => import('./pages/cheatsheet/cheatsheet-page') },
      { path: 'certificate', loadComponent: () => import('./pages/certificate/certificate-page') },
      { path: 'notes', loadComponent: () => import('./pages/notes/notes-page') },
      { path: 'glossary', loadComponent: () => import('./pages/glossary/glossary-page') },
      { path: ':chapter/:lesson', loadComponent: () => import('./pages/lesson/lesson-page') },
      { path: '**', loadComponent: () => import('./pages/not-found/not-found-page') },
    ],
  },
  { path: '**', redirectTo: 'de' },
];
