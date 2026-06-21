import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';

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
    NzCardModule
  ],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings implements OnInit {
  bookings: Booking[] = [];

  constructor(private message: NzMessageService) {}

  ngOnInit(): void {
    // Mock data for patient bookings
    this.bookings = [
      {
        id: 'BKG-001',
        clinicName: 'City Care Clinic',
        doctorName: 'Dr. John Doe',
        date: 'Jul 15, 2026',
        time: '10:00 - 10:30',
        status: 'Upcoming'
      },
      {
        id: 'BKG-002',
        clinicName: 'ABC Medical Center',
        doctorName: 'Dr. Jane Smith',
        date: 'Jul 18, 2026',
        time: '14:30 - 15:00',
        status: 'Upcoming'
      },
      {
        id: 'BKG-003',
        clinicName: 'Sunshine Health Clinic',
        doctorName: 'Dr. Robert Brown',
        date: 'Jun 20, 2026',
        time: '09:00 - 09:30',
        status: 'Completed'
      },
      {
        id: 'BKG-004',
        clinicName: 'Heaven Health Clinic',
        doctorName: 'Dr. Emily White',
        date: 'Jun 10, 2026',
        time: '11:00 - 11:30',
        status: 'Cancelled'
      }
    ];
  }

  cancelBooking(id: string): void {
    const bookingIndex = this.bookings.findIndex(b => b.id === id);
    if (bookingIndex !== -1) {
      // In a real app, this would be an API call.
      const updatedBookings = [...this.bookings];
      updatedBookings[bookingIndex].status = 'Cancelled';
      this.bookings = updatedBookings;
      this.message.success('Booking cancelled successfully.');
    }
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
}
