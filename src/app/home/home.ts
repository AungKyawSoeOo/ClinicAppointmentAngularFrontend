import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterLink,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzCardModule,
    NzGridModule,
    NzTypographyModule,
    NzDividerModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  clinics = [
    {
      name: 'City Care Clinic',
      address: 'No. 12, Main Road',
      city: 'Yangon'
    },
    {
      name: 'ABC Medical Center',
      address: 'Street 5, Downtown',
      city: 'Yangon'
    },
    {
      name: 'Sunshine Health Clinic',
      address: 'West District',
      city: 'Mandalay'
    }
  ];

  steps = [
    { title: 'Search', icon: 'search', description: 'Find clinics by location near you.' },
    { title: 'Choose', icon: 'calendar', description: 'Pick an available time slot that fits your schedule.' },
    { title: 'Book', icon: 'check-circle', description: 'Confirm your appointment instantly online.' },
  ];
}
