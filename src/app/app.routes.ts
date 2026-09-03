import { Routes } from '@angular/router';
import { Login } from './features/auth/components/login';
import { NotFoundPage } from './core/layout/not-found-page/not-found-page';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'expedientes',
    loadChildren: () => import('./features/expedientes/expedientes.routes').then(m => m.routes),
    canActivate: [authGuard]
  },
  { path: '**', component: NotFoundPage },
];
