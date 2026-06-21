import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-doctors-appointment',
  imports: [
    CommonModule,
    NzTabsModule,
    NzButtonModule,
    NzTypographyModule,
    NzCardModule,
    NzIconModule
  ],
  providers: [DatePipe],
  templateUrl: './doctors-appointment.html',
  styleUrl: './doctors-appointment.css',
})
export class DoctorsAppointment implements OnInit {
  clinicId: string | null = null;
  doctorId: string | null = null;

  schedule: any[] = [];
  currentWeekOffset: number = 0;

  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.clinicId = this.route.snapshot.paramMap.get('clinicId');
    this.doctorId = this.route.snapshot.paramMap.get('doctorId');
    this.generateSchedule();
  }

  generateSchedule() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
      '09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00',
      '11:00 - 11:30', '11:30 - 12:00', '13:00 - 13:30', '13:30 - 14:00',
      '14:00 - 14:30', '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00'
    ];

    let currentDate = new Date();
    // Apply week offset
    currentDate.setDate(currentDate.getDate() + (this.currentWeekOffset * 7));

    this.schedule = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      let dayName = daysOfWeek[date.getDay()];
      let formattedDate = this.datePipe.transform(date, 'MMM d, yyyy');

      const slots = timeSlots.map(time => {
        // Randomly disable some slots for mock data (about 30% booked)
        const isBooked = Math.random() < 0.3;
        return {
          time,
          isBooked
        };
      });

      this.schedule.push({
        date: date,
        formattedDate: formattedDate,
        dayName: dayName,
        slots: slots
      });
    }
  }

  nextWeek() {
    if (this.currentWeekOffset < 1) {
      this.currentWeekOffset++;
      this.generateSchedule();
    }
  }

  previousWeek() {
    this.currentWeekOffset--;
    this.generateSchedule();
  }

  bookSlot(dayIndex: number, slotIndex: number, time: string) {
    if (!this.schedule[dayIndex].slots[slotIndex].isBooked) {
      this.schedule[dayIndex].slots[slotIndex].isBooked = true;
      this.message.success(`Successfully booked appointment on ${this.schedule[dayIndex].dayName} at ${time}`);
    }
  }
}
