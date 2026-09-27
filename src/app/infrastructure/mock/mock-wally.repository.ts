import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Wally } from '../../shared/models/wally.model';
import { WallyRepository } from '../../shared/repositories/wally.repository';
import { MOCK_WALLYS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockWallyRepository implements WallyRepository {
  private wallys: Wally[] = [...MOCK_WALLYS];

  findAll(): Observable<Wally[]> {
    return of([...this.wallys]).pipe(delay(200));
  }

  findActiveWallys(): Observable<Wally[]> {
    return of(this.wallys.filter(w => w.isActive)).pipe(delay(200));
  }

  findById(id: string): Observable<Wally | null> {
    const found = this.wallys.find(w => w.id === id) || null;
    return of(found).pipe(delay(200));
  }

  findBySlug(slug: string): Observable<Wally | null> {
    const found = this.wallys.find(w => w.slug.toLowerCase() === slug.toLowerCase()) || null;
    return of(found).pipe(delay(200));
  }

  create(item: Omit<Wally, 'id'>): Observable<Wally> {
    const newWally: Wally = {
      ...item,
      id: `wally-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.wallys.push(newWally);
    return of(newWally).pipe(delay(300));
  }

  update(id: string, item: Partial<Wally>): Observable<Wally> {
    const index = this.wallys.findIndex(w => w.id === id);
    if (index === -1) {
      throw new Error(`Wally not found: ${id}`);
    }
    const updated = {
      ...this.wallys[index],
      ...item,
      updatedAt: new Date().toISOString()
    };
    this.wallys[index] = updated;
    return of(updated).pipe(delay(300));
  }

  delete(id: string): Observable<boolean> {
    const initialLength = this.wallys.length;
    this.wallys = this.wallys.filter(w => w.id !== id);
    return of(this.wallys.length < initialLength).pipe(delay(300));
  }
}
