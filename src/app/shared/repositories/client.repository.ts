import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { BaseRepository } from './base.repository';

export interface ClientRepository extends BaseRepository<Client> {
  findByWallyId(wallyId: string): Observable<Client[]>;
}
