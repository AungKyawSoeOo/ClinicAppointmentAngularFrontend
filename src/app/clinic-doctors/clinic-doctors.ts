import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-clinic-doctors',
  imports: [
    CommonModule,
    RouterLink,
    NzCardModule,
    NzAvatarModule,
    NzTypographyModule,
    NzGridModule,
    NzIconModule,
    NzButtonModule,
    NzTagModule
  ],
  templateUrl: './clinic-doctors.html',
  styleUrl: './clinic-doctors.css',
})
export class ClinicDoctors implements OnInit {
  clinicId: string | null = null;

  doctors = [
    {
      id: 1,
      name: 'Dr. John Doe',
      specialty: 'Cardiologist',
      experience: '10 Years',
      availableDays: ['Mon', 'Wed', 'Fri'],
      imageUrl: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1'
    },
    {
      id: 2,
      name: 'Dr. Jane Smith',
      specialty: 'Dermatologist',
      experience: '8 Years',
      availableDays: ['Tue', 'Thu'],
      imageUrl: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2'
    },
    {
      id: 3,
      name: 'Dr. Robert Brown',
      specialty: 'Pediatrician',
      experience: '15 Years',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      imageUrl: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3'
    },
    {
      id: 4,
      name: 'Dr. Emily White',
      specialty: 'Neurologist',
      experience: '12 Years',
      availableDays: ['Wed', 'Sat'],
      imageUrl: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.clinicId = this.route.snapshot.paramMap.get('id');
    // fetch doctors for this specific clinicId
  }
}
