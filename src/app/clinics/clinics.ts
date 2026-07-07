import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LocationService, City, Township } from '../services/location.service';
import { FormsModule } from '@angular/forms';

interface Clinic {
  id: number;
  clinic_id: number;
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
    NzSelectModule,
    FormsModule
  ],
  templateUrl: './clinics.html',
  styleUrl: './clinics.css',
})
export class Clinics implements OnInit {
  allClinics: Clinic[] = [];
  clinics: Clinic[] = [];
  cities: City[] = [];
  townships: Township[] = [];
  filteredTownships: Township[] = [];
  selectedCityId: number | null = null;
  selectedTownshipId: number | null = null;
  apiUrl = 'http://localhost:3000/api/clinics';

   constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  private locationService = inject(LocationService);
  ngOnInit(): void {
    this.fetchClinics();
    this.locationService.getCities().subscribe({
      next: (res) => {
        if (res.result) {
          this.cities = res.data.filter(c => c.status === 'Active');
           this.cdr.detectChanges();
        }
      },
      error: (err) => console.error(err)
    });

    this.locationService.getTownships().subscribe({
      next: (res) => {
        if (res.result) {
          this.townships = res.data.filter(t => t.status === 'Active');
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error(err)
    });
  }

  onCityChange(cityId: number): void {
    this.selectedTownshipId = null; // Clear township when city changes
    if (cityId) {
      this.filteredTownships = this.townships.filter(t => t.cityId === cityId);
    } else {
      this.filteredTownships = [];
    }
    this.filterClinics();
  }

  onTownshipChange(): void {
    this.filterClinics();
  }

  filterClinics(): void {
    let filtered = this.allClinics;

    if (this.selectedCityId) {
      const selectedCity = this.cities.find(c => c.id === this.selectedCityId);
      if (selectedCity) {
        filtered = filtered.filter(clinic => clinic.city === selectedCity.name);
      }
    }

    if (this.selectedTownshipId) {
      const selectedTownship = this.townships.find(t => t.id === this.selectedTownshipId);
      if (selectedTownship) {
        filtered = filtered.filter(clinic => clinic.township === selectedTownship.name);
      }
    }

    this.clinics = filtered;
  }
   fetchClinics(): void {
    this.http.get<{result: boolean, data: Clinic[]}>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.result) {
          this.allClinics = [...res.data];
          this.filterClinics();
          console.log('Fetched clinics:', this.allClinics);
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
}
