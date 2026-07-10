import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface User {
  userId: number;
  clinicId?: number;
  role: string;
  email?: string;
  userName?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  // Private signal for current user
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());

  // Public read-only signals
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  private getUserFromStorage(): User | null {
    if (typeof window !== 'undefined') {
      let userJson = null;
      if (window.localStorage) {
        userJson = localStorage.getItem('currentUser');
      }
      if (!userJson && window.sessionStorage) {
        userJson = sessionStorage.getItem('currentUser');
      }
      if (userJson) {
        try {
          return JSON.parse(userJson);
        } catch (e) {
          if (window.localStorage) {
            localStorage.removeItem('currentUser');
          }
          if (window.sessionStorage) {
            sessionStorage.removeItem('currentUser');
          }
        }
      }
    }
    return null;
  }

  registerUser(userData: any) {
    return this.http.post(`${this.baseUrl}/register`, userData).pipe(
      catchError((error) => {
        console.log("Raw error from server:", error);
        const errMsg = error.error?.message || 'An unexpected error occurred';
        return throwError(() => errMsg);
      })
    );
  }

  registerClinic(clinicData: any) {
    return this.http.post(`${this.baseUrl}/register-clinic`, clinicData).pipe(
      catchError((error) => {
        console.log("Raw error from server:", error);
        const errMsg = error.error?.message || 'An unexpected error occurred';
        return throwError(() => errMsg);
      })
    );
  }

  loginUser(userData: any) {
    return this.http.post<any>(`${this.baseUrl}/login`, userData).pipe(
      tap((res) => {
        if (res && res.result) {
          const user: User = {
            userId: res.userId,
            clinicId: res.clinicId || undefined,
            role: res.role,
            email: userData.email,
            userName: res.userName || 'Patient',
            status: res.status
          };
          if (typeof window !== 'undefined') {
            if (userData.remember) {
              if (window.localStorage) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('rememberedEmail', userData.email);
              }
            } else {
              if (window.sessionStorage) {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
              }
              if (window.localStorage) {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('rememberedEmail');
              }
            }
          }
          this.currentUserSignal.set(user);
        }
      }),
      catchError((error) => {
        console.log("Raw error from server:", error);
        const errMsg = error.error?.message || 'An unexpected error occurred';
        return throwError(() => errMsg);
      })
    );
  }

  logout() {
    if (typeof window !== 'undefined') {
      if (window.localStorage) {
        localStorage.removeItem('currentUser');
      }
      if (window.sessionStorage) {
        sessionStorage.removeItem('currentUser');
      }
    }
    this.currentUserSignal.set(null);
  }

  getProfile(userId: number) {
    return this.http.get<any>(`${this.baseUrl}/profile/${userId}`).pipe(
      catchError((error) => {
        console.error("Error fetching profile:", error);
        const errMsg = error.error?.message || 'Failed to fetch profile details';
        return throwError(() => errMsg);
      })
    );
  }

  updateProfile(userId: number, profileData: any) {
    return this.http.put<any>(`${this.baseUrl}/profile/${userId}`, profileData).pipe(
      catchError((error) => {
        console.error("Error updating profile:", error);
        const errMsg = error.error?.message || 'Failed to update profile';
        return throwError(() => errMsg);
      })
    );
  }

  updateCurrentUserName(newName: string) {
    const current = this.currentUserSignal();
    if (current) {
      const updatedUser = { ...current, userName: newName };
      if (typeof window !== 'undefined') {
        if (window.localStorage && localStorage.getItem('currentUser')) {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        if (window.sessionStorage && sessionStorage.getItem('currentUser')) {
          sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
      }
      this.currentUserSignal.set(updatedUser);
    }
  }

  getAuthorizedClinicId(): number | undefined {
    const user = this.currentUser();
    return user?.clinicId;
  }
}