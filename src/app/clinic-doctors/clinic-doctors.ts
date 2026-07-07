import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { HttpClient } from '@angular/common/http';

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
  doctors: any[] = [];
  clinicName: string = '';


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.clinicId = this.route.snapshot.paramMap.get('id');
      this.fetchClinic();
      this.fetchDoctors();
      this.cdr.detectChanges();
  }

  dayMap: { [key: number]: string } = {
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
    7: 'Sun'
  };

  fetchDoctors(): void {
    this.http.get(`http://localhost:3000/api/clinics/${this.clinicId}/doctors`).subscribe({
      next: (res: any) => {
        if (res.result && res.data.length > 0) {
          this.doctors = res.data.map((d: any) => ({
            ...d,
            id: d.doctor_id,
            name: d.doctor_name,
            specialty: d.specialization,
            workingDays: [...d.working_days]
              .map((day: number | string) => Number(day))
              .sort((a, b) => a - b)
              .map(day => this.dayMap[day]),
            imageUrl: `https://api.dicebear.com/7.x/miniavs/svg?seed=${encodeURIComponent(d.doctor_name)}`
          }));
          console.log('Fetched Doctors:', this.doctors);
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error(err)
    });
  }

  fetchClinic(): void {
  this.http.get(`http://localhost:3000/api/clinics/${this.clinicId}`)
    .subscribe({
      next: (res:any) => {
        if(res.result){
          this.clinicName = res.data.name;
           this.cdr.detectChanges();
          console.log('Fetched Clinic:', this.clinicName);
        }
      },
      error: (err) => console.error(err)
    });
}
}
