import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doctors-appointment',
  imports: [
    CommonModule,
    NzTabsModule,
    NzButtonModule,
    NzTypographyModule,
    NzCardModule,
    NzIconModule,
    NzSpinModule
  ],
  providers: [DatePipe],
  templateUrl: './doctors-appointment.html',
  styleUrl: './doctors-appointment.css',
})
export class DoctorsAppointment implements OnInit {
  clinicId: string | null = null;
  doctorId: string | null = null;
  doctorName: string = '';

  schedule: any[] = [];
  currentWeekOffset: number = 0;
  loading = false;

  private allTimeSlots: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.clinicId = this.route.snapshot.paramMap.get('clinicId');
    this.doctorId = this.route.snapshot.paramMap.get('doctorId');
    this.fetchDoctorTimeslots();
  }

  fetchDoctorTimeslots(): void {
    this.loading = true;
    this.http.get(`http://localhost:3000/api/doctors/${this.doctorId}/timeslots`).subscribe({
      next: (res: any) => {
        console.log('Fetched timeslots:', res);
        this.loading = false;
        if (res.result && res.data) {
          this.doctorName = res.data.doctor_name;
          this.allTimeSlots = res.data.time_slots || [];
          this.buildSchedule();
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching timeslots:', err);
        this.message.error('Failed to load doctor timeslots');
      }
    });
  }

  buildSchedule(): void {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let startDate = new Date();
    startDate.setDate(startDate.getDate() + (this.currentWeekOffset * 7));

    this.schedule = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayName = daysOfWeek[date.getDay()];
      const formattedDate = this.datePipe.transform(date, 'MMM d, yyyy');
      const dateStr = this.datePipe.transform(date, 'yyyy-MM-dd');

      // Filter timeslots for this specific date
      const slotsForDay = this.allTimeSlots.filter(ts => {
        const tsDate = ts.slot_date.split('T')[0];
        return tsDate === dateStr;
      });

      const slots = slotsForDay.map(ts => ({
        slotId: ts.slot_id,
        time: `${this.formatTime(ts.slot_start)} - ${this.formatTime(ts.slot_end)}`,
        isBooked: ts.is_booked
      }));

      this.schedule.push({
        date,
        formattedDate,
        dayName,
        slots
      });
    }
  }

  private formatTime(timeStr: string): string {
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const displayMin = m.toString().padStart(2, '0');
    return `${displayHour}:${displayMin} ${period}`;
  }

  nextWeek(): void {
    if (this.currentWeekOffset < 1) {
      this.currentWeekOffset++;
      this.buildSchedule();
    }
  }

  previousWeek(): void {
    if (this.currentWeekOffset > 0) {
      this.currentWeekOffset--;
      this.buildSchedule();
    }
  }

  bookSlot(dayIndex: number, slotIndex: number, time: string): void {
    const slot = this.schedule[dayIndex].slots[slotIndex];
    if (!slot.isBooked) {
      // TODO: Call backend to actually book
      slot.isBooked = true;
      this.message.success(`Successfully booked appointment on ${this.schedule[dayIndex].dayName} at ${time}`);
    }
  }
}
