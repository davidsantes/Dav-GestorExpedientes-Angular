import { Routes } from '@angular/router';
import { Login } from './features/login/components/login/login';
import { NotFoundPage } from './core/not-found-page/not-found-page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
      path: 'expedientes',
      //Lazy loading de las rutas de expedientes
      loadChildren: () => import('./features/expedientes/expedientes.routes').then(m => m.routes) 
  },  
  { path: '**', component: NotFoundPage },
];
