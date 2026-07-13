import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzImageModule } from 'ng-zorro-antd/image';

interface Clinic {
  id: number;
  name: string;
  liscense_number: string;
  license_photo: string;
  location: string;
  city: string,
  township: string,
  registeredDate: string;
  status: string; // 'pending' | 'active' | 'inactive'
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
    NzImageModule
  ],
  templateUrl: './admin-clinics.html',
  styleUrls: ['./admin-clinics.css'],
})
export class AdminClinics implements OnInit {
  clinics: Clinic[] = [];
  apiUrl = 'http://localhost:3000/api/admin/clinics';

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

  approveClinic(id: number): void {
    this.http.put<{result: boolean, message: string}>(`${this.apiUrl}/${id}/status`, { status: 'active' }).subscribe({
      next: (res) => {
        if (res.result) {
          this.message.success('Clinic approved successfully');
          const clinic = this.clinics.find(c => c.id === id);
          if (clinic) {
            clinic.status = 'active';
            this.clinics = [...this.clinics];
            this.cdr.detectChanges();
          }
        } else {
          this.message.error('Failed to approve clinic');
        }
      },
      error: (err) => {
        console.error(err);
        this.message.error('Error approving clinic');
      }
    });
  }

  rejectClinic(id: number): void {
    this.http.put<{result: boolean, message: string}>(`${this.apiUrl}/${id}/status`, { status: 'inactive' }).subscribe({
      next: (res) => {
        if (res.result) {
          this.message.success('Clinic rejected successfully');
          const clinic = this.clinics.find(c => c.id === id);
          if (clinic) {
            clinic.status = 'inactive';
            this.clinics = [...this.clinics];
            this.cdr.detectChanges();
          }
        } else {
          this.message.error('Failed to reject clinic');
        }
      },
      error: (err) => {
        console.error(err);
        this.message.error('Error rejecting clinic');
      }
    });
  }
}
