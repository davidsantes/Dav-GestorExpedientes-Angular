import { Routes } from '@angular/router';
import { ExpedientesPage } from './pages/expedientes-page/expedientes-page';
import { ExpedienteDetallePage } from './pages/expediente-detalle-page/expediente-detalle-page';

export const routes: Routes = [
    {
        path: '',
        component: ExpedientesPage
    },
    {
        path: ':numero',
        component: ExpedienteDetallePage
    }
];