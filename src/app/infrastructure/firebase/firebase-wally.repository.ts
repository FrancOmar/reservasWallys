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
import { Wally } from '../../shared/models/wally.model';
import { WallyRepository } from '../../shared/repositories/wally.repository';
import { firebaseDb } from '../../core/config/firebase.config';
import { MOCK_WALLYS } from '../mock/mock-data';

@Injectable({
  providedIn: 'root'
})
export class FirebaseWallyRepository implements WallyRepository {
  private collectionName = 'wallys';
  private localWallys: Wally[] = [...MOCK_WALLYS];

  findAll(): Observable<Wally[]> {
    const colRef = collection(firebaseDb, this.collectionName);
    return from(getDocs(colRef)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Wally));
        }
        return [...this.localWallys];
      }),
      catchError(() => of([...this.localWallys]))
    );
  }

  findActiveWallys(): Observable<Wally[]> {
    const colRef = collection(firebaseDb, this.collectionName);
    const q = query(colRef, where('isActive', '==', true));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Wally));
        }
        return this.localWallys.filter(w => w.isActive);
      }),
      catchError(() => of(this.localWallys.filter(w => w.isActive)))
    );
  }

  findById(id: string): Observable<Wally | null> {
    const docRef = doc(firebaseDb, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(docSnap => docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Wally) : this.localWallys.find(w => w.id === id) || null),
      catchError(() => of(this.localWallys.find(w => w.id === id) || null))
    );
  }

  findBySlug(slug: string): Observable<Wally | null> {
    const colRef = collection(firebaseDb, this.collectionName);
    const q = query(colRef, where('slug', '==', slug));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          return { id: docSnap.id, ...docSnap.data() } as Wally;
        }
        return this.localWallys.find(w => w.slug.toLowerCase() === slug.toLowerCase()) || null;
      }),
      catchError(() => of(this.localWallys.find(w => w.slug.toLowerCase() === slug.toLowerCase()) || null))
    );
  }

  create(item: Omit<Wally, 'id'>): Observable<Wally> {
    const id = `wally-${Date.now()}`;
    const docRef = doc(firebaseDb, this.collectionName, id);
    const newItem: Wally = {
      ...item,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.localWallys.push(newItem);
    return from(setDoc(docRef, newItem)).pipe(
      map(() => newItem),
      catchError(() => of(newItem))
    );
  }

  update(id: string, item: Partial<Wally>): Observable<Wally> {
    const docRef = doc(firebaseDb, this.collectionName, id);
    const index = this.localWallys.findIndex(w => w.id === id);
    if (index !== -1) {
      this.localWallys[index] = { ...this.localWallys[index], ...item, updatedAt: new Date().toISOString() };
    }
    const updateData = { ...item, updatedAt: new Date().toISOString() };
    return from(updateDoc(docRef, updateData)).pipe(
      map(() => ({ id, ...item } as Wally)),
      catchError(() => of({ id, ...item } as Wally))
    );
  }

  delete(id: string): Observable<boolean> {
    const docRef = doc(firebaseDb, this.collectionName, id);
    this.localWallys = this.localWallys.filter(w => w.id !== id);
    return from(deleteDoc(docRef)).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }
}
