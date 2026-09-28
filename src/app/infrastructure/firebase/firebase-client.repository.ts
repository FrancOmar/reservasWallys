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
import { Client } from '../../shared/models/client.model';
import { ClientRepository } from '../../shared/repositories/client.repository';
import { firebaseDb } from '../../core/config/firebase.config';
import { MOCK_CLIENTS } from '../mock/mock-data';

@Injectable({
  providedIn: 'root'
})
export class FirebaseClientRepository implements ClientRepository {
  private collectionName = 'clients';

  findAll(): Observable<Client[]> {
    const colRef = collection(firebaseDb, this.collectionName);
    return from(getDocs(colRef)).pipe(
      map(snapshot => snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Client))),
      catchError(() => of(MOCK_CLIENTS))
    );
  }

  findByWallyId(wallyId: string): Observable<Client[]> {
    const colRef = collection(firebaseDb, this.collectionName);
    const q = query(colRef, where('wallyId', '==', wallyId));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        const clients = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Client));
        return clients.length > 0 ? clients : MOCK_CLIENTS.filter(c => c.wallyId === wallyId);
      }),
      catchError(() => of(MOCK_CLIENTS.filter(c => c.wallyId === wallyId)))
    );
  }

  findById(id: string): Observable<Client | null> {
    const docRef = doc(firebaseDb, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(docSnap => docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Client) : MOCK_CLIENTS.find(c => c.id === id) || null),
      catchError(() => of(MOCK_CLIENTS.find(c => c.id === id) || null))
    );
  }

  create(item: Omit<Client, 'id'>): Observable<Client> {
    const id = `client-${Date.now()}`;
    const docRef = doc(firebaseDb, this.collectionName, id);
    const newItem: Client = {
      ...item,
      id,
      totalReservations: 0,
      isBlocked: false,
      createdAt: new Date().toISOString()
    };
    return from(setDoc(docRef, newItem)).pipe(map(() => newItem));
  }

  update(id: string, item: Partial<Client>): Observable<Client> {
    const docRef = doc(firebaseDb, this.collectionName, id);
    return from(updateDoc(docRef, item)).pipe(map(() => ({ id, ...item } as Client)));
  }

  delete(id: string): Observable<boolean> {
    const docRef = doc(firebaseDb, this.collectionName, id);
    return from(deleteDoc(docRef)).pipe(map(() => true));
  }
}
