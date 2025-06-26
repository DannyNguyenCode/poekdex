import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
        return import('./home/home').then((m) => m.Home)
    },
},
{
    path: 'login',
    pathMatch: 'full',
    loadComponent: () => {
        return import('./login/login').then((m) => m.Login)
    }
},
{
    path: 'collection',
    pathMatch: 'full',
    loadComponent: () => {
        return import('./collection/collection').then((m) => m.Collection)
    }
},
{
    path: 'register',
    pathMatch: 'full',
    loadComponent: () => {
        return import('./register/register').then((m) => m.Register)
    }
}
];
