import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Court } from '../../shared/models/court.model';
import { CourtRepository } from '../../shared/repositories/court.repository';
import { MOCK_COURTS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockCourtRepository implements CourtRepository {
  private courts: Court[] = [...MOCK_COURTS];

  findAll(): Observable<Court[]> {
    return of([...this.courts]).pipe(delay(200));
  }

  findByWallyId(wallyId: string): Observable<Court[]> {
    return of(this.courts.filter(c => c.wallyId === wallyId)).pipe(delay(200));
  }

  findById(id: string): Observable<Court | null> {
    const found = this.courts.find(c => c.id === id) || null;
    return of(found).pipe(delay(200));
  }

  create(item: Omit<Court, 'id'>): Observable<Court> {
    const newCourt: Court = {
      ...item,
      id: `court-${Date.now()}`
    };
    this.courts.push(newCourt);
    return of(newCourt).pipe(delay(300));
  }

  update(id: string, item: Partial<Court>): Observable<Court> {
    const index = this.courts.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Court not found: ${id}`);
    }
    const updated = { ...this.courts[index], ...item };
    this.courts[index] = updated;
    return of(updated).pipe(delay(300));
  }

  delete(id: string): Observable<boolean> {
    const initialLength = this.courts.length;
    this.courts = this.courts.filter(c => c.id !== id);
    return of(this.courts.length < initialLength).pipe(delay(300));
  }
}
