import { Observable } from 'rxjs';
import { Wally } from '../models/wally.model';
import { BaseRepository } from './base.repository';

export interface WallyRepository extends BaseRepository<Wally> {
  findBySlug(slug: string): Observable<Wally | null>;
  findActiveWallys(): Observable<Wally[]>;
}
