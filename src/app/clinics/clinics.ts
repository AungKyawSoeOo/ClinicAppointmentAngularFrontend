import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';


@Component({
  selector: 'app-clinics',
  imports: [
    CommonModule,
    RouterLink,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzCardModule,
    NzGridModule,
    NzTypographyModule,
    NzDividerModule,
    NzDropdownModule,
    NzSelectModule
  ],
  templateUrl: './clinics.html',
  styleUrl: './clinics.css',
})
export class Clinics {
    clinics = [
    {
      id: 1,
      name: 'City Care Clinic',
      address: 'No. 12, Main Road',
      city: 'Yangon'
    },
    {
      id: 2,
      name: 'ABC Medical Center',
      address: 'Street 5, Downtown',
      city: 'Yangon'
    },
    {
      id: 3,
      name: 'Sunshine Health Clinic',
      address: 'West District',
      city: 'Mandalay'
    },
    {
      id: 4,
      name: 'Heaven Health Clinic',
      address: 'Yankin District',
      city: 'Mandalay'
    }
  ];
}
