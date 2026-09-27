import { Observable } from 'rxjs';
import { Court } from '../models/court.model';
import { BaseRepository } from './base.repository';

export interface CourtRepository extends BaseRepository<Court> {
  findByWallyId(wallyId: string): Observable<Court[]>;
}
