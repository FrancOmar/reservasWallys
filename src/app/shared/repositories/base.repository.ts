import { Observable } from 'rxjs';

export interface BaseRepository<T, ID = string> {
  findAll(): Observable<T[]>;
  findById(id: ID): Observable<T | null>;
  create(item: Omit<T, 'id'>): Observable<T>;
  update(id: ID, item: Partial<T>): Observable<T>;
  delete(id: ID): Observable<boolean>;
}
