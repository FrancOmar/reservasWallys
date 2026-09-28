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
import { Court } from '../../shared/models/court.model';
import { CourtRepository } from '../../shared/repositories/court.repository';
import { firebaseDb } from '../../core/config/firebase.config';
import { MOCK_COURTS } from '../mock/mock-data';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCourtRepository implements CourtRepository {
  private collectionName = 'courts';

  findAll(): Observable<Court[]> {
    const colRef = collection(firebaseDb, this.collectionName);
    return from(getDocs(colRef)).pipe(
      map(snapshot => snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Court))),
      catchError(() => of(MOCK_COURTS))
    );
  }

  findByWallyId(wallyId: string): Observable<Court[]> {
    const colRef = collection(firebaseDb, this.collectionName);
    const q = query(colRef, where('wallyId', '==', wallyId));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        const courts = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Court));
        return courts.length > 0 ? courts : MOCK_COURTS.filter(c => c.wallyId === wallyId);
      }),
      catchError(() => of(MOCK_COURTS.filter(c => c.wallyId === wallyId)))
    );
  }

  findById(id: string): Observable<Court | null> {
    const docRef = doc(firebaseDb, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(docSnap => docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Court) : MOCK_COURTS.find(c => c.id === id) || null),
      catchError(() => of(MOCK_COURTS.find(c => c.id === id) || null))
    );
  }

  create(item: Omit<Court, 'id'>): Observable<Court> {
    const id = `court-${Date.now()}`;
    const docRef = doc(firebaseDb, this.collectionName, id);
    const newItem: Court = { ...item, id };
    return from(setDoc(docRef, newItem)).pipe(map(() => newItem));
  }

  update(id: string, item: Partial<Court>): Observable<Court> {
    const docRef = doc(firebaseDb, this.collectionName, id);
    return from(updateDoc(docRef, item)).pipe(map(() => ({ id, ...item } as Court)));
  }

  delete(id: string): Observable<boolean> {
    const docRef = doc(firebaseDb, this.collectionName, id);
    return from(deleteDoc(docRef)).pipe(map(() => true));
  }
}
