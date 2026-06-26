import { Component } from '@angular/core';
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

interface City {
  id: number;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}

interface Township {
  id: number;
  cityId: number;
  cityName: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}

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
export class AdminMasterSetup {
  cities: City[] = [
    { id: 1, name: 'Yangon', code: 'YGN', status: 'Active' },
    { id: 2, name: 'Mandalay', code: 'MDY', status: 'Active' },
    { id: 3, name: 'Naypyidaw', code: 'NPT', status: 'Active' },
    { id: 4, name: 'Taunggyi', code: 'TGI', status: 'Inactive' },
  ];

  townships: Township[] = [
    { id: 1, cityId: 1, cityName: 'Yangon', name: 'Bahan', code: 'BHN', status: 'Active' },
    { id: 2, cityId: 1, cityName: 'Yangon', name: 'Dagon', code: 'DGN', status: 'Active' },
    { id: 3, cityId: 2, cityName: 'Mandalay', name: 'Tamwe', code: 'CZT', status: 'Active' },
    { id: 4, cityId: 3, cityName: 'Naypyidaw', name: 'Tarkayta', code: 'ZBT', status: 'Inactive' },
  ];


  isCityModalVisible = false;
  newCity: Partial<City> = {};

  isTownshipModalVisible = false;
  newTownship: Partial<Township> = {};

  showCityModal(): void {
    this.isCityModalVisible = true;
  }

  handleCityModalOk(): void {
    if (this.newCity.name && this.newCity.code) {
      this.cities = [...this.cities, {
        id: this.cities.length + 1,
        name: this.newCity.name,
        code: this.newCity.code.toUpperCase(),
        status: 'Active'
      }];
    }
    this.isCityModalVisible = false;
    this.newCity = {};
  }

  handleCityModalCancel(): void {
    this.isCityModalVisible = false;
    this.newCity = {};
  }

  showTownshipModal(): void {
    this.isTownshipModalVisible = true;
  }

  handleTownshipModalOk(): void {
    const selectedCity = this.cities.find(c => c.id === this.newTownship.cityId);
    if (this.newTownship.name && this.newTownship.code && selectedCity) {
      this.townships = [...this.townships, {
        id: this.townships.length + 1,
        cityId: selectedCity.id,
        cityName: selectedCity.name,
        name: this.newTownship.name,
        code: this.newTownship.code.toUpperCase(),
        status: 'Active'
      }];
    }
    this.isTownshipModalVisible = false;
    this.newTownship = {};
  }

  handleTownshipModalCancel(): void {
    this.isTownshipModalVisible = false;
    this.newTownship = {};
  }


  toggleCityStatus(id: number): void {
    const city = this.cities.find(c => c.id === id);
    if (city) {
      city.status = city.status === 'Active' ? 'Inactive' : 'Active';
    }
  }

  toggleTownshipStatus(id: number): void {
    const township = this.townships.find(t => t.id === id);
    if (township) {
      township.status = township.status === 'Active' ? 'Inactive' : 'Active';
    }
  }
}