import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'site/new',
    loadComponent: () =>
      import('./components/site-form/site-form.component').then((m) => m.SiteFormComponent),
  },
  {
    path: 'site/:id',
    loadComponent: () =>
      import('./components/site-detail/site-detail.component').then((m) => m.SiteDetailComponent),
  },
  { path: '**', redirectTo: '' },
];
