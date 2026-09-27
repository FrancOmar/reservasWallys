import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { WALLY_REPOSITORY_TOKEN, COURT_REPOSITORY_TOKEN, RESERVATION_REPOSITORY_TOKEN, CLIENT_REPOSITORY_TOKEN } from './shared/repositories/tokens';
import { MockWallyRepository } from './infrastructure/mock/mock-wally.repository';
import { MockCourtRepository } from './infrastructure/mock/mock-court.repository';
import { MockReservationRepository } from './infrastructure/mock/mock-reservation.repository';
import { MockClientRepository } from './infrastructure/mock/mock-client.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),

    // Dependency Injection for Repositories (Mock Implementations)
    { provide: WALLY_REPOSITORY_TOKEN, useClass: MockWallyRepository },
    { provide: COURT_REPOSITORY_TOKEN, useClass: MockCourtRepository },
    { provide: RESERVATION_REPOSITORY_TOKEN, useClass: MockReservationRepository },
    { provide: CLIENT_REPOSITORY_TOKEN, useClass: MockClientRepository }
  ]
};
