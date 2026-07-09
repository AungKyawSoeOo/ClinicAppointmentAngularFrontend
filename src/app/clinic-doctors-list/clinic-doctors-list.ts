import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';

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
  doctors: any[] = [];
  clinicId: string | null = null;
  selectedDoctor: any = null;
  dates: any[] = [];
  selectedDateIndex = 0;
  bookings: any[] = [];

  constructor(
    private datePipe: DatePipe, 
    private message: NzMessageService, 
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.clinicId = this.route.snapshot.paramMap.get('clinicId') || '4';
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    this.http.get(`http://localhost:3000/api/clinics/${this.clinicId}/doctors`).subscribe({
      next: (res: any) => {
        if (res.result && res.data.length > 0) {
          this.doctors = res.data.map((d: any) => ({
             ...d,
             id: d.doctor_id,
             name: d.doctor_name,
             specialty: d.specialization,
             workingDays: d.working_days,
             imageUrl: `https://api.dicebear.com/7.x/miniavs/svg?seed=${encodeURIComponent(d.doctor_name)}`
          }));
          this.selectedDoctor = this.doctors[0];
          this.generateNext14Days();
          this.generateBookingsForSelected();
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error(err)
    });
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
      return;
    }

    const formatTime = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 === 0 ? 12 : h % 12;
        const displayMin = m.toString().padStart(2, '0');
        return `${displayHour}:${displayMin} ${period}`;
    };

    const targetDate = this.datePipe.transform(selectedDateObj.date, 'yyyy-MM-dd');

    // if (this.selectedDoctor.time_slots) {
    //     const targetDate = this.datePipe.transform(selectedDateObj.date, 'yyyy-MM-dd');
        
    //     const slotsForDate = this.selectedDoctor.time_slots.filter((ts: any) => {
    //         const tsDate = ts.slot_date.split('T')[0];
    //         return tsDate === targetDate;
    //     });

    //     this.bookings = slotsForDate.map((slot: any, idx: number) => {
    //         return {
    //             slotIndex: idx,
    //             time: `${formatTime(slot.slot_start)} - ${formatTime(slot.slot_end)}`,
    //             isBooked: slot.is_booked,
    //             status: slot.is_booked ? 'Confirmed' : 'Available',
    //             // Keep patient mock data if booked for UI demo purposes
    //             patientName: slot.is_booked ? 'John Doe' : '',
    //         };
    //     });
    // }

    this.http.get<any>(`http://localhost:3000/api/clinics/doctors/${this.selectedDoctor.id}/bookings?date=${targetDate}`)
    .subscribe({
      next: (res) => {
        if (res.success) {
          // ရလာတဲ့ ဒေတာအစစ်တွေကို UI က မျှော်လင့်ထားတဲ့ Object ပုံစံအတိုင်း Map လုပ်ပေးခြင်း
          this.bookings = res.data.map((slot: any, idx: number) => {
            
            // Database ထဲက အသေးစာသား status များကို HTML Tag အတွက် အကြီးစာသား ပြန်ပြောင်းပေးခြင်း
            let displayStatus = 'Available';
            if (slot.is_booked) {
              if (slot.appointment_status === 'booked') displayStatus = 'Confirmed';
              else if (slot.appointment_status === 'completed') displayStatus = 'Completed';
              else if (slot.appointment_status === 'cancelled') displayStatus = 'Cancelled';
              else displayStatus = 'Confirmed'; // default fallback
            }

            return {
              slotIndex: idx,
              time: `${formatTime(slot.slot_start)} - ${formatTime(slot.slot_end)}`,
              isBooked: slot.is_booked,
              status: displayStatus,
              patientName: slot.patientName || '',
              patientPhone: slot.patientPhone || '-',
              patientEmail: slot.patientEmail || '-'
            };
          });
          
          this.cdr.detectChanges(); // UI ကို ချက်ချင်း Update လုပ်ရန်
        }
      },
      error: (err) => {
        console.error('Error fetching dynamic bookings:', err);
        this.message.error('Failed to load real-time patient bookings.');
      }
    });
  }
}
