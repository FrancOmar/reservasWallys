import { InjectionToken } from '@angular/core';
import { WallyRepository } from './wally.repository';
import { CourtRepository } from './court.repository';
import { ReservationRepository } from './reservation.repository';
import { ClientRepository } from './client.repository';

export const WALLY_REPOSITORY_TOKEN = new InjectionToken<WallyRepository>('WallyRepository');
export const COURT_REPOSITORY_TOKEN = new InjectionToken<CourtRepository>('CourtRepository');
export const RESERVATION_REPOSITORY_TOKEN = new InjectionToken<ReservationRepository>('ReservationRepository');
export const CLIENT_REPOSITORY_TOKEN = new InjectionToken<ClientRepository>('ClientRepository');
