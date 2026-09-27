import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './core/layout/public-layout/public-layout.component';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // PORTAL PÚBLICO
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'wallys', pathMatch: 'full' },
      {
        path: 'wallys',
        loadComponent: () => import('./features/public-portal/pages/directory/directory.component').then(m => m.DirectoryComponent)
      },
      {
        path: 'wally/:slug',
        loadComponent: () => import('./features/public-portal/pages/wally-detail/wally-detail.component').then(m => m.WallyDetailComponent)
      }
    ]
  },

  // AUTENTICACIÓN
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },

  // PANEL SUPER ADMIN
  {
    path: 'super-admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'SUPER_ADMIN' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/super-admin/pages/dashboard/dashboard.component').then(m => m.SuperAdminDashboardComponent)
      },
      {
        path: 'wallys',
        loadComponent: () => import('./features/super-admin/pages/dashboard/dashboard.component').then(m => m.SuperAdminDashboardComponent)
      },
      {
        path: 'administradores',
        loadComponent: () => import('./features/super-admin/pages/dashboard/dashboard.component').then(m => m.SuperAdminDashboardComponent)
      }
    ]
  },

  // PANEL ADMIN DE WALLY (CMS DEPORTIVO)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin-cms/pages/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'agenda',
        loadComponent: () => import('./features/calendar-agenda/pages/agenda-view/agenda-view.component').then(m => m.AgendaViewComponent)
      },
      {
        path: 'canchas',
        loadComponent: () => import('./features/courts/pages/court-list/court-list.component').then(m => m.CourtListComponent)
      },
      {
        path: 'reservas',
        loadComponent: () => import('./features/reservations/pages/reservation-list/reservation-list.component').then(m => m.ReservationListComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/clients/pages/client-list/client-list.component').then(m => m.ClientListComponent)
      },
      {
        path: 'contenido',
        loadComponent: () => import('./features/admin-cms/pages/cms-editor/cms-editor.component').then(m => m.CmsEditorComponent)
      }
    ]
  },

  { path: '**', redirectTo: 'wallys' }
];
