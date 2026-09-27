import { Observable } from 'rxjs';
import { Reservation, TimeSlot } from '../models/reservation.model';
import { BaseRepository } from './base.repository';

export interface ReservationRepository extends BaseRepository<Reservation> {
  findByWallyAndDate(wallyId: string, date: string): Observable<Reservation[]>;
  findByWallyId(wallyId: string): Observable<Reservation[]>;
  getAvailability(courtId: string, date: string): Observable<TimeSlot[]>;
}
