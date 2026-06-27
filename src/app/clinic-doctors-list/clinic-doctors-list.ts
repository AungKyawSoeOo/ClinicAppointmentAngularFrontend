import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clinic-doctors-list',
  imports: [
    CommonModule,
    NzCardModule,
    NzAvatarModule,
    NzTypographyModule,
    NzGridModule,
    NzIconModule,
    NzButtonModule,
    NzTagModule,
    NzDividerModule,
    NzTabsModule,
    NzAlertModule,
    RouterLink
  ],
  providers: [DatePipe],
  templateUrl: './clinic-doctors-list.html',
  styleUrl: './clinic-doctors-list.css'
})
export class ClinicDoctorsList implements OnInit {
  doctors = [
    {
      id: 1,
      name: 'Dr. Kyaw Pyae Sone',
      specialty: 'Dermatologist',
      experience: '10 Years',
      license: 'LIC-10294-MD',
      phone: '0912345678',
      consultationDuration: 15,
      maxCapacity: 1,
      startTime: '09:00',
      endTime: '13:00',
      workingDays: [1, 2, 3, 5], // Mon, Tue, Wed, Fri
      imageUrl: 'https://api.dicebear.com/7.x/miniavs/svg?seed=john'
    },
    {
      id: 2,
      name: 'Dr. Kaung Pyae Kyaw',
      specialty: 'Cardiologist',
      experience: '12 Years',
      license: 'LIC-48201-MD',
      phone: '0998765432',
      consultationDuration: 20,
      maxCapacity: 1,
      startTime: '10:00',
      endTime: '15:00',
      workingDays: [1, 3, 4, 5], // Mon, Wed, Thu, Fri
      imageUrl: 'https://api.dicebear.com/7.x/miniavs/svg?seed=jane'
    },
    {
      id: 3,
      name: 'Dr. Aye Chan Zaw',
      specialty: 'Pediatrician',
      experience: '15 Years',
      license: 'LIC-22839-MD',
      phone: '0945678912',
      consultationDuration: 15,
      maxCapacity: 2,
      startTime: '08:30',
      endTime: '12:30',
      workingDays: [2, 4, 6], // Tue, Thu, Sat
      imageUrl: 'https://api.dicebear.com/7.x/miniavs/svg?seed=robert'
    },
    {
      id: 4,
      name: 'Dr. Wana',
      specialty: 'Neurologist',
      experience: '8 Years',
      license: 'LIC-77492-MD',
      phone: '09789123456',
      consultationDuration: 30,
      maxCapacity: 1,
      startTime: '13:00',
      endTime: '17:00',
      workingDays: [1, 3, 5], // Mon, Wed, Fri
      imageUrl: 'https://api.dicebear.com/7.x/miniavs/svg?seed=emily'
    }
  ];

  clinicId: string | null = null;
  selectedDoctor: any = null;
  dates: any[] = [];
  selectedDateIndex = 0;
  bookings: any[] = [];

  // Stable patient mock pool
  private mockPatients = [
    { name: 'Min Min', phone: '09420123456', email: 'kyaw@example.com'},
    { name: 'Hla Hla', phone: '09250987654', email: 'hla@example.com'},
    { name: 'Aung Aung', phone: '09782112233', email: 'aung.j@example.com'},
    { name: 'Tony Stark', phone: '09900111222', email: 'tony@stark.com'},
    { name: 'David Banner', phone: '09312345678', email: 'hulk@avengers.com'},
    { name: 'Bruce Wayne', phone: '09400700700', email: 'bruce@wayne.org'},
    { name: 'Diana Prince', phone: '09777888999', email: 'diana@themyscira.gov'},
    { name: 'Clark Kent', phone: '09222444666', email: 'clark@dailyplanet.com'}
  ];

  constructor(private datePipe: DatePipe, private message: NzMessageService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.clinicId = this.route.snapshot.paramMap.get('clinicId');
    this.selectedDoctor = this.doctors[0];
    this.generateNext14Days();
    this.generateBookingsForSelected();
  }

  selectDoctor(doctor: any): void {
    this.selectedDoctor = doctor;
    this.generateNext14Days();
    this.generateBookingsForSelected();
  }

  selectDate(index: number): void {
    this.selectedDateIndex = index;
    this.generateBookingsForSelected();
  }

  generateNext14Days(): void {
    this.dates = [];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayNum = date.getDay();
      const isoDayNum = dayNum === 0 ? 7 : dayNum;

      const isWorkingDay = this.selectedDoctor.workingDays.includes(isoDayNum);
      const dayName = daysOfWeek[dayNum];
      const formattedDate = this.datePipe.transform(date, 'MMM d') || '';

      this.dates.push({
        date,
        dayName,
        formattedDate,
        isWorkingDay,
        isoDayNum
      });
    }

    // Default to the first working day, or index 0 if none
    const firstWorkingDayIndex = this.dates.findIndex(d => d.isWorkingDay);
    this.selectedDateIndex = firstWorkingDayIndex !== -1 ? firstWorkingDayIndex : 0;
  }

  generateBookingsForSelected(): void {
    this.bookings = [];
    const selectedDateObj = this.dates[this.selectedDateIndex];
    if (!selectedDateObj) return;

    if (!selectedDateObj.isWorkingDay) {
      // Not a working day for this doctor, don't generate slots
      return;
    }

    // Parse start and end times
    const [startHour, startMin] = this.selectedDoctor.startTime.split(':').map(Number);
    const [endHour, endMin] = this.selectedDoctor.endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const duration = this.selectedDoctor.consultationDuration;

    let currentMin = startMinutes;
    let slotIdx = 0;

    while (currentMin + duration <= endMinutes) {
      const slotStartHour = Math.floor(currentMin / 60);
      const slotStartMin = currentMin % 60;
      const slotEndHour = Math.floor((currentMin + duration) / 60);
      const slotEndMin = (currentMin + duration) % 60;

      const formatTime = (h: number, m: number) => {
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 === 0 ? 12 : h % 12;
        const displayMin = m.toString().padStart(2, '0');
        return `${displayHour}:${displayMin} ${period}`;
      };

      const timeString = `${formatTime(slotStartHour, slotStartMin)} - ${formatTime(slotEndHour, slotEndMin)}`;

      // Generate consistent bookings using selectedDoctor.id, selectedDateIndex, and slotIdx
      const hash = (this.selectedDoctor.id * 10 + this.selectedDateIndex * 3 + slotIdx) % 10;
      const isBooked = hash < 4; // 40% chance of being booked

      if (isBooked) {
        // Pick a patient from the mock pool
        const patientIdx = (this.selectedDoctor.id * 5 + this.selectedDateIndex + slotIdx) % this.mockPatients.length;
        const patient = this.mockPatients[patientIdx];

        // Statuses: Available,Confirmed
        const statusHash = (slotIdx + this.selectedDoctor.id) % 3;
        const status = statusHash === 0 ? 'Confirmed' : 'Available';

        this.bookings.push({
          slotIndex: slotIdx,
          time: timeString,
          isBooked: true,
          status,
          patientName: patient.name,
          patientPhone: patient.phone,
          patientEmail: patient.email
        });
      } else {
        this.bookings.push({
          slotIndex: slotIdx,
          time: timeString,
          isBooked: false,
          status: 'Available'
        });
      }

      currentMin += duration;
      slotIdx++;
    }
  }
}
