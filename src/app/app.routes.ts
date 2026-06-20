import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { Home } from './home/home';
import { Clinics } from './clinics/clinics';
import { ClinicRegister } from './clinic-register/clinic-register';
import { Allspecialites } from './allspecialites/allspecialites';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'register', component: Register },
    { path: 'clinic-register', component: ClinicRegister },
    { path: 'login', component: Login },
    { path: 'clinics', component: Clinics },
    { path: 'all-specialities', component: Allspecialites},
    { path: '**', redirectTo: '' }
];
