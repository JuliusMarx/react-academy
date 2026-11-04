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
      { path: ':chapter/:lesson', loadComponent: () => import('./pages/lesson/lesson-page') },
      { path: '**', loadComponent: () => import('./pages/not-found/not-found-page') },
    ],
  },
  { path: '**', redirectTo: 'de' },
];
