import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';
  registerUser(userData: any) {
  return this.http.post(`${this.baseUrl}/register`, userData).pipe(
    catchError((error) => {
      console.log("Raw error from server:", error);
      const errMsg = error.error?.message || 'An unexpected error occurred';
      return throwError(() => errMsg);
    })
  );
}
}