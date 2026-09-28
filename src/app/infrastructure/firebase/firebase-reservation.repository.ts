import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { Reservation, TimeSlot } from '../../shared/models/reservation.model';
import { ReservationRepository } from '../../shared/repositories/reservation.repository';
import { firebaseDb } from '../../core/config/firebase.config';
import { MOCK_RESERVATIONS, MOCK_COURTS } from '../mock/mock-data';

@Injectable({
  providedIn: 'root'
})
export class FirebaseReservationRepository implements ReservationRepository {
  private collectionName = 'reservations';

  findAll(): Observable<Reservation[]> {
    const colRef = collection(firebaseDb, this.collectionName);
    return from(getDocs(colRef)).pipe(
      map(snapshot => snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Reservation))),
      catchError(() => of(MOCK_RESERVATIONS))
    );
  }

  findByWallyId(wallyId: string): Observable<Reservation[]> {
    const colRef = collection(firebaseDb, this.collectionName);
    const q = query(colRef, where('wallyId', '==', wallyId));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        const res = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Reservation));
        return res.length > 0 ? res : MOCK_RESERVATIONS.filter(r => r.wallyId === wallyId);
      }),
      catchError(() => of(MOCK_RESERVATIONS.filter(r => r.wallyId === wallyId)))
    );
  }

  findByWallyAndDate(wallyId: string, date: string): Observable<Reservation[]> {
    const colRef = collection(firebaseDb, this.collectionName);
    const q = query(colRef, where('wallyId', '==', wallyId), where('date', '==', date));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        const res = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Reservation));
        return res.length > 0 ? res : MOCK_RESERVATIONS.filter(r => r.wallyId === wallyId && r.date === date);
      }),
      catchError(() => of(MOCK_RESERVATIONS.filter(r => r.wallyId === wallyId && r.date === date)))
    );
  }

  findById(id: string): Observable<Reservation | null> {
    const docRef = doc(firebaseDb, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(docSnap => docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Reservation) : MOCK_RESERVATIONS.find(r => r.id === id) || null),
      catchError(() => of(MOCK_RESERVATIONS.find(r => r.id === id) || null))
    );
  }

  getAvailability(courtId: string, date: string): Observable<TimeSlot[]> {
    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    const court = MOCK_COURTS.find(c => c.id === courtId);
    const hourlyRate = court ? court.hourlyRate : 150;

    const colRef = collection(firebaseDb, this.collectionName);
    const q = query(colRef, where('courtId', '==', courtId), where('date', '==', date));

    return from(getDocs(q)).pipe(
      map(snapshot => {
        const existingRes = snapshot.docs.map(docSnap => docSnap.data() as Reservation);
        const activeRes = existingRes.length > 0 ? existingRes : MOCK_RESERVATIONS.filter(r => r.courtId === courtId && r.date === date);

        return hours.map((startTime, idx) => {
          const nextHour = idx < hours.length - 1 ? hours[idx + 1] : '23:00';
          const match = activeRes.find(r => r.startTime === startTime && r.status !== 'CANCELLED');
          return {
            startTime,
            endTime: nextHour,
            isAvailable: !match,
            courtId,
            reservationId: match ? match.id : undefined,
            price: hourlyRate
          };
        });
      }),
      catchError(() => {
        const activeRes = MOCK_RESERVATIONS.filter(r => r.courtId === courtId && r.date === date);
        const slots: TimeSlot[] = hours.map((startTime, idx) => {
          const nextHour = idx < hours.length - 1 ? hours[idx + 1] : '23:00';
          const match = activeRes.find(r => r.startTime === startTime && r.status !== 'CANCELLED');
          return {
            startTime,
            endTime: nextHour,
            isAvailable: !match,
            courtId,
            reservationId: match ? match.id : undefined,
            price: hourlyRate
          };
        });
        return of(slots);
      })
    );
  }

  create(item: Omit<Reservation, 'id'>): Observable<Reservation> {
    const id = `res-${Date.now()}`;
    const docRef = doc(firebaseDb, this.collectionName, id);
    const newItem: Reservation = {
      ...item,
      id,
      createdAt: new Date().toISOString()
    };
    return from(setDoc(docRef, newItem)).pipe(map(() => newItem));
  }

  update(id: string, item: Partial<Reservation>): Observable<Reservation> {
    const docRef = doc(firebaseDb, this.collectionName, id);
    return from(updateDoc(docRef, item)).pipe(map(() => ({ id, ...item } as Reservation)));
  }

  delete(id: string): Observable<boolean> {
    const docRef = doc(firebaseDb, this.collectionName, id);
    return from(deleteDoc(docRef)).pipe(map(() => true));
  }
}
