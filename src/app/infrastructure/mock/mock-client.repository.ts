import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Client } from '../../shared/models/client.model';
import { ClientRepository } from '../../shared/repositories/client.repository';
import { MOCK_CLIENTS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockClientRepository implements ClientRepository {
  private clients: Client[] = [...MOCK_CLIENTS];

  findAll(): Observable<Client[]> {
    return of([...this.clients]).pipe(delay(200));
  }

  findByWallyId(wallyId: string): Observable<Client[]> {
    return of(this.clients.filter(c => c.wallyId === wallyId)).pipe(delay(200));
  }

  findById(id: string): Observable<Client | null> {
    const found = this.clients.find(c => c.id === id) || null;
    return of(found).pipe(delay(200));
  }

  create(item: Omit<Client, 'id'>): Observable<Client> {
    const newClient: Client = {
      ...item,
      id: `client-${Date.now()}`,
      totalReservations: 0,
      isBlocked: false,
      createdAt: new Date().toISOString()
    };
    this.clients.push(newClient);
    return of(newClient).pipe(delay(300));
  }

  update(id: string, item: Partial<Client>): Observable<Client> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Client not found: ${id}`);
    }
    const updated = { ...this.clients[index], ...item };
    this.clients[index] = updated;
    return of(updated).pipe(delay(300));
  }

  delete(id: string): Observable<boolean> {
    const initialLength = this.clients.length;
    this.clients = this.clients.filter(c => c.id !== id);
    return of(this.clients.length < initialLength).pipe(delay(300));
  }
}
