import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
        title: 'Rallyne Silva Fotografia'
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import('./features/portfolio/portfolio-list/portfolio-list.component').then(
            (m) => m.PortfolioListComponent
          ),
        title: 'Portfólio — Rallyne Silva Fotografia'
      },
      {
        path: 'portfolio/:id',
        loadComponent: () =>
          import('./features/portfolio/portfolio-detail/portfolio-detail.component').then(
            (m) => m.PortfolioDetailComponent
          ),
        title: 'Evento — Rallyne Silva Fotografia'
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Entrar — Rallyne Silva Fotografia'
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'eventos', pathMatch: 'full' },
      {
        path: 'eventos',
        loadComponent: () =>
          import('./features/admin/event-list/event-list.component').then(
            (m) => m.EventListComponent
          ),
        title: 'Meus eventos — Painel'
      },
      {
        path: 'eventos/novo',
        loadComponent: () =>
          import('./features/admin/event-form/event-form.component').then(
            (m) => m.EventFormComponent
          ),
        title: 'Novo evento — Painel'
      },
      {
        path: 'eventos/:id/editar',
        loadComponent: () =>
          import('./features/admin/event-form/event-form.component').then(
            (m) => m.EventFormComponent
          ),
        title: 'Editar evento — Painel'
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
