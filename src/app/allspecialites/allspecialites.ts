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
  selector: 'app-allspecialites',
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
  templateUrl: './allspecialites.html',
  styleUrl: './allspecialites.css',
})
export class Allspecialites {
  specialties = [
    { name: 'Dentistry', icon: 'medicine-box', color: '#1890ff', description: 'Find top dentists for your oral health.' },
    { name: 'Cardiology', icon: 'medicine-box', color: '#1890ff', description: 'Expert heart specialists at your service.' },
    { name: 'Pediatrics', icon: 'medicine-box', color: '#1890ff', description: 'Compassionate care for your children.' },
    { name: 'Optometry', icon: 'medicine-box', color: '#1890ff', description: 'Vision care and comprehensive eye exams.' },
    { name: 'Neurology', icon: 'medicine-box', color: '#1890ff', description: 'Specialized care for brain and nerves.' },
    { name: 'Orthopedics', icon: 'medicine-box', color: '#1890ff', description: 'Bone and joint specialists.' },
    { name: 'Gastroenterology', icon: 'medicine-box', color: '#1890ff', description: 'Bone and joint specialists.' },
    { name: 'Oncology', icon: 'medicine-box', color: '#1890ff', description: 'Bone and joint specialists.' },
  ];
}
