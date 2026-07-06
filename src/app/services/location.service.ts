import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface City {
  id: number;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}

export interface Township {
  id: number;
  cityId: number;
  cityName: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  getCities() {
    return this.http.get<{ result: boolean, data: City[] }>(`${this.baseUrl}/cities`).pipe(
      catchError((error) => {
        console.error("Error fetching cities:", error);
        return throwError(() => error.error?.message || 'Failed to fetch cities');
      })
    );
  }

  addCity(cityData: { name: string, code: string }) {
    return this.http.post<{ result: boolean, message: string, data: City }>(`${this.baseUrl}/cities`, cityData).pipe(
      catchError((error) => {
        console.error("Error adding city:", error);
        return throwError(() => error.error?.message || 'Failed to add city');
      })
    );
  }

  toggleCityStatus(id: number) {
    return this.http.put<{ result: boolean, message: string, status: 'Active' | 'Inactive' }>(`${this.baseUrl}/cities/${id}/status`, {}).pipe(
      catchError((error) => {
        console.error("Error toggling city status:", error);
        return throwError(() => error.error?.message || 'Failed to update city status');
      })
    );
  }

  getTownships() {
    return this.http.get<{ result: boolean, data: Township[] }>(`${this.baseUrl}/townships`).pipe(
      catchError((error) => {
        console.error("Error fetching townships:", error);
        return throwError(() => error.error?.message || 'Failed to fetch townships');
      })
    );
  }

  addTownship(townshipData: { name: string, code: string, cityId: number }) {
    return this.http.post<{ result: boolean, message: string, data: Township }>(`${this.baseUrl}/townships`, townshipData).pipe(
      catchError((error) => {
        console.error("Error adding township:", error);
        return throwError(() => error.error?.message || 'Failed to add township');
      })
    );
  }

  toggleTownshipStatus(id: number) {
    return this.http.put<{ result: boolean, message: string, status: 'Active' | 'Inactive' }>(`${this.baseUrl}/townships/${id}/status`, {}).pipe(
      catchError((error) => {
        console.error("Error toggling township status:", error);
        return throwError(() => error.error?.message || 'Failed to update township status');
      })
    );
  }
}
