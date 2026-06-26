import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';

interface Clinic {
  id: number;
  name: string;
  liscense_number: string;
  location: string;
  registeredDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-admin-clinics',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzIconModule,
    NzCardModule,
    NzDividerModule,
  ],
  templateUrl: './admin-clinics.html',
  styleUrls: ['./admin-clinics.css'],
})
export class AdminClinics {
  clinics: Clinic[] = [
    {
      id: 1,
      name: 'City Health Clinic',
      liscense_number: 'YGN/GPC-045/2025',
      location: 'Yangon, Tamwe',
      registeredDate: '2023-10-15',
      status: 'Pending',
    },
    {
      id: 2,
      name: 'Sunshine Medical Center',
      liscense_number: 'YGN/GPC-045/2025',
      location: 'Yangon, Tamwe',
      registeredDate: '2023-10-14',
      status: 'Approved',
    },
    {
      id: 3,
      name: 'Evergreen Family Practice',
      liscense_number: 'YGN/GPC-045/2025',
      location: 'Yangon, Tamwe',
      registeredDate: '2023-10-12',
      status: 'Rejected',
    },
    {
      id: 4,
      name: 'Riverfront Healthcare',
      liscense_number: 'YGN/GPC-045/2025',
      location: 'Yangon, Tamwe',
      registeredDate: '2023-10-18',
      status: 'Pending',
    },
    {
      id: 5,
      name: 'Peak Performance Ortho',
      liscense_number: 'YGN/GPC-045/2025',
      location: 'Yangon, Tamwe',
      registeredDate: '2023-10-20',
      status: 'Approved',
    },
  ];

  approveClinic(id: number): void {
    const clinic = this.clinics.find(c => c.id === id);
    if (clinic) {
      clinic.status = 'Approved';
    }
  }

  rejectClinic(id: number): void {
    const clinic = this.clinics.find(c => c.id === id);
    if (clinic) {
      clinic.status = 'Rejected';
    }
  }
}
