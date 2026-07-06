import { Component, ChangeDetectorRef, OnInit  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

interface Clinic {
  id: number;
  name: string;
  liscense_number: string;
  license_photo: string;
  location: string;
  city: string;
  township: string;
  registeredDate: string;
  status: string; // 'pending' | 'active' | 'inactive'
}

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
export class Home implements OnInit {
  allClinics: Clinic[] = [];
  clinics: Clinic[] = [];
  apiUrl = 'http://localhost:3000/api/clinics';
  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchClinics();
  }

   fetchClinics(): void {
    this.http.get<{result: boolean, data: Clinic[]}>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.result) {
          this.clinics = [...res.data];
          this.cdr.detectChanges();
        } else {
          this.message.error('Failed to load clinics');
        }
      },
      error: (err) => {
        console.error(err);
        this.message.error('Error fetching clinics');
      }
    });
  }

  get homeClinics(): Clinic[] {
    return this.clinics.slice(0, 3);
  }

  steps = [
    { title: 'Search', icon: 'search', description: 'Find clinics by location near you.' },
    { title: 'Choose', icon: 'calendar', description: 'Pick an available time slot that fits your schedule.' },
    { title: 'Book', icon: 'check-circle', description: 'Confirm your appointment instantly online.' },
  ];
}
