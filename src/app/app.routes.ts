import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { Home } from './home/home';
import { Clinics } from './clinics/clinics';
import { ClinicRegister } from './clinic-register/clinic-register';
import { ClinicDoctors } from './clinic-doctors/clinic-doctors';
import { DoctorsAppointment } from './doctors-appointment/doctors-appointment';
import { MyBookings } from './my-bookings/my-bookings';
import { Myprofile } from './myprofile/myprofile';
import { AdminClinics } from './admin/admin-clinics/admin-clinics';
import { AdminMasterSetup } from './admin/admin-master-setup/admin-master-setup';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'register', component: Register },
    { path: 'clinic-register', component: ClinicRegister },
    { path: 'login', component: Login },
    { path: 'clinics', component: Clinics },
    { path: 'clinics/:id/doctors', component: ClinicDoctors },
    { path: 'clinics/:clinicId/doctors/:doctorId/appointment', component: DoctorsAppointment },
    { path: 'my-bookings', component: MyBookings },
    { path: 'profile', component: Myprofile },
    { path: 'admin/clinics', component: AdminClinics },
    { path: 'admin/location-setup', component: AdminMasterSetup },
    { path: '**', redirectTo: '' }
];
