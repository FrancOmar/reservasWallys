import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Reservation, TimeSlot } from '../../shared/models/reservation.model';
import { ReservationRepository } from '../../shared/repositories/reservation.repository';
import { MOCK_RESERVATIONS, MOCK_COURTS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockReservationRepository implements ReservationRepository {
  private reservations: Reservation[] = [...MOCK_RESERVATIONS];

  findAll(): Observable<Reservation[]> {
    return of([...this.reservations]).pipe(delay(200));
  }

  findByWallyId(wallyId: string): Observable<Reservation[]> {
    return of(this.reservations.filter(r => r.wallyId === wallyId)).pipe(delay(200));
  }

  findByWallyAndDate(wallyId: string, date: string): Observable<Reservation[]> {
    return of(this.reservations.filter(r => r.wallyId === wallyId && r.date === date)).pipe(delay(200));
  }

  findById(id: string): Observable<Reservation | null> {
    const found = this.reservations.find(r => r.id === id) || null;
    return of(found).pipe(delay(200));
  }

  getAvailability(courtId: string, date: string): Observable<TimeSlot[]> {
    const court = MOCK_COURTS.find(c => c.id === courtId);
    const hourlyRate = court ? court.hourlyRate : 150;
    
    // Generar franjas horarias de 08:00 a 23:00
    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    const courtReservations = this.reservations.filter(r => r.courtId === courtId && r.date === date && r.status !== 'CANCELLED');

    const slots: TimeSlot[] = hours.map((startTime, idx) => {
      const nextHour = idx < hours.length - 1 ? hours[idx + 1] : '23:00';
      const existingRes = courtReservations.find(r => r.startTime === startTime);
      return {
        startTime,
        endTime: nextHour,
        isAvailable: !existingRes,
        courtId,
        reservationId: existingRes ? existingRes.id : undefined,
        price: hourlyRate
      };
    });

    return of(slots).pipe(delay(200));
  }

  create(item: Omit<Reservation, 'id'>): Observable<Reservation> {
    const newReservation: Reservation = {
      ...item,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.reservations.push(newReservation);
    return of(newReservation).pipe(delay(300));
  }

  update(id: string, item: Partial<Reservation>): Observable<Reservation> {
    const index = this.reservations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Reservation not found: ${id}`);
    }
    const updated = { ...this.reservations[index], ...item };
    this.reservations[index] = updated;
    return of(updated).pipe(delay(300));
  }

  delete(id: string): Observable<boolean> {
    const initialLength = this.reservations.length;
    this.reservations = this.reservations.filter(r => r.id !== id);
    return of(this.reservations.length < initialLength).pipe(delay(300));
  }
}
