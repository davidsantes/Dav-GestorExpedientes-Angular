import { Routes } from '@angular/router';
import { rolGuard } from '../../core/guards/rol-guard';
import { ExpedientesPage } from './pages/expedientes-page/expedientes-page';
import { ExpedienteDetallePage } from './pages/expediente-detalle-page/expediente-detalle-page';

export const routes: Routes = [
    {
        path: '',
        component: ExpedientesPage
    },
    {
        path: ':numero',
        component: ExpedienteDetallePage,
        canActivate: [rolGuard]
    },
    {
        path: ':numero/editar',
        component: ExpedienteDetallePage,
        canActivate: [rolGuard],
        data: { modo: 'editar' }
    }
];