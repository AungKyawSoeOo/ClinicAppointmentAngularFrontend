import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';

interface Booking {
  id: string;
  clinicName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

@Component({
  selector: 'app-my-bookings',
  imports: [
    CommonModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzTypographyModule,
    NzPopconfirmModule,
    NzCardModule,
    NzSpinModule
  ],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings implements OnInit {
  bookings: Booking[] = [];
  loading = false;

  constructor(private message: NzMessageService, private http: HttpClient, private authService: AuthService, private cdr: ChangeDetectorRef) {}

ngOnInit(): void {
    this.loadPatientBookings();
  }

  loadPatientBookings(): void {

    const currentUser = this.authService.currentUser();
    const userId = currentUser ? currentUser.userId : null;

    if (!userId) {
      this.message.error('User session not found. Please login again.');
      return;
    }

    this.loading = true;

    this.http.get<{success: boolean, data: Booking[]}>(`http://localhost:3000/api/patients/${userId}/bookings`)
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.bookings = res.data;
            this.cdr.detectChanges();
          } else {
            this.message.error('Failed to load bookings');
          }
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          this.message.error('Server error while fetching bookings');
        }
      });
  }



cancelBooking(id: string): void {
  this.loading = true;


  this.http.put<{success: boolean, message: string}>(`http://localhost:3000/api/patients/cancel/${id}`, {})
    .subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {

          const bookingIndex = this.bookings.findIndex(b => b.id === id);
          if (bookingIndex !== -1) {
            const updatedBookings = [...this.bookings];
            updatedBookings[bookingIndex].status = 'Cancelled';
            this.bookings = updatedBookings;

            this.bookings = updatedBookings.sort((a, b) => {
              if (a.status === 'Upcoming' && b.status !== 'Upcoming') return -1;
              if (a.status !== 'Upcoming' && b.status === 'Upcoming') return 1;
              return 0;
            });
          }
          this.message.success('Booking cancelled successfully.');
        } else {
          this.message.error(res.message || 'Failed to cancel booking');
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Cancel booking error:', err);
        this.message.error(err.error?.message || 'Server error occurred while cancelling');
        this.cdr.detectChanges();
      }
    });
}

  getStatusColor(status: string): string {
    switch (status) {
      case 'Upcoming':
        return 'blue';
      case 'Completed':
        return 'green';
      case 'Cancelled':
        return 'red';
      default:
        return 'default';
    }
  }

  formatTimeRange(timeRange: string): string {
    // Split the string into start and end times
    const [start, end] = timeRange.split(' - ');

    const convertTo12Hour = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes);

      // Returns format like "2:55 PM"
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    return `${convertTo12Hour(start)} - ${convertTo12Hour(end)}`;
  }
}
