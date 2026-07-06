import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { LocationService, City, Township } from '../../services/location.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-admin-master-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTabsModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzIconModule,
    NzCardModule,
    NzDividerModule,
    NzInputModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule
  ],
  templateUrl: './admin-master-setup.html',
  styleUrls: ['./admin-master-setup.css'],
})
export class AdminMasterSetup implements OnInit {
  private locationService = inject(LocationService);
  constructor(private msg: NzMessageService, private cdr: ChangeDetectorRef) { }

  cities: City[] = [];
  townships: Township[] = [];

  isCityModalVisible = false;
  newCity: Partial<City> = {};

  isTownshipModalVisible = false;
  newTownship: Partial<Township> = {};

  citySearchTerm: string = '';
  filteredCities: any[] = [];

  townshipSearchTerm: string = '';
  filteredTownships: any[] = [];

  ngOnInit(): void {
    this.loadCities();
    this.loadTownships();
  }

  // citysearch function
  onCitySearch(): void {
    console.log('Search term:', this.citySearchTerm);
    const term = this.citySearchTerm.toLowerCase();
    console.log(this.filteredCities);
    this.filteredCities = this.cities.filter(city =>
      city.name.toLowerCase().includes(term) ||
      city.code.toLowerCase().includes(term)
    );
  }

  // townshipsearch function
  onTownshipSearch(): void {
    console.log('Search term:', this.townshipSearchTerm);
    const term = this.townshipSearchTerm.toLowerCase();
    console.log(this.filteredTownships);
    this.filteredTownships = this.townships.filter(township =>
      township.name.toLowerCase().includes(term) ||
      township.code.toLowerCase().includes(term) ||
      township.cityName.toLowerCase().includes(term)
    );
  }

  loadCities(): void {
    this.locationService.getCities().subscribe({
      next: (res) => {
        if (res.result) {
          this.cities = res.data;
          this.filteredCities = [...this.cities];
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load cities:', err)
    });
  }

  loadTownships(): void {
    this.locationService.getTownships().subscribe({
      next: (res) => {
        if (res.result) {
          this.townships = res.data;
          this.filteredTownships = [...this.townships];
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load townships:', err)
    });
  }

  showCityModal(): void {
    this.isCityModalVisible = true;
  }

  handleCityModalOk(): void {
    if (this.newCity.name && this.newCity.code) {
      this.locationService.addCity({
        name: this.newCity.name,
        code: this.newCity.code
      }).subscribe({
        next: (res) => {
          if (res.result) {
            this.cities = [...this.cities, res.data];
          }
          this.isCityModalVisible = false;
          this.newCity = {};
        },
        error: (err) => {
          console.error('Failed to add city:', err);
          this.msg.error(err);
          this.isCityModalVisible = false;
          this.newCity = {};
        }
      });
    } else {
      this.isCityModalVisible = false;
      this.newCity = {};
    }
  }

  handleCityModalCancel(): void {
    this.isCityModalVisible = false;
    this.newCity = {};
  }

  showTownshipModal(): void {
    this.isTownshipModalVisible = true;
  }

  handleTownshipModalOk(): void {
    if (this.newTownship.name && this.newTownship.code && this.newTownship.cityId) {
      this.locationService.addTownship({
        name: this.newTownship.name,
        code: this.newTownship.code,
        cityId: this.newTownship.cityId
      }).subscribe({
        next: (res) => {
          if (res.result) {
            this.townships = [...this.townships, res.data];
          }
          this.isTownshipModalVisible = false;
          this.newTownship = {};
        },
        error: (err) => {
          console.error('Failed to add township:', err);
          this.msg.error(err);
          this.isTownshipModalVisible = false;
          this.newTownship = {};
        }
      });
    } else {
      this.isTownshipModalVisible = false;
      this.newTownship = {};
    }
  }

  handleTownshipModalCancel(): void {
    this.isTownshipModalVisible = false;
    this.newTownship = {};
  }

  toggleCityStatus(id: number): void {
    this.locationService.toggleCityStatus(id).subscribe({
      next: (res) => {
        if (res.result) {
          const city = this.cities.find(c => c.id === id);
          if (city) {
            city.status = res.status;
          }
          this.loadCities();
          this.loadTownships();
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to toggle city status:', err)
    });
  }

  toggleTownshipStatus(id: number): void {
    this.locationService.toggleTownshipStatus(id).subscribe({
      next: (res) => {
        if (res.result) {
          const township = this.townships.find(t => t.id === id);
          if (township) {
            township.status = res.status;
            this.cdr.detectChanges();
          }
        }
      },
      error: (err) =>{ console.error('Failed to toggle township status:', err)
      this.msg.error(err);
      }
    });
  }
}