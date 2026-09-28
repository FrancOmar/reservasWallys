import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { WALLY_REPOSITORY_TOKEN, COURT_REPOSITORY_TOKEN, RESERVATION_REPOSITORY_TOKEN, CLIENT_REPOSITORY_TOKEN } from './shared/repositories/tokens';
import { environment } from '../environments/environment';

import { initFirebase } from './core/config/firebase.config';
import { FirebaseWallyRepository } from './infrastructure/firebase/firebase-wally.repository';
import { FirebaseCourtRepository } from './infrastructure/firebase/firebase-court.repository';
import { FirebaseReservationRepository } from './infrastructure/firebase/firebase-reservation.repository';
import { FirebaseClientRepository } from './infrastructure/firebase/firebase-client.repository';

import { MockWallyRepository } from './infrastructure/mock/mock-wally.repository';
import { MockCourtRepository } from './infrastructure/mock/mock-court.repository';
import { MockReservationRepository } from './infrastructure/mock/mock-reservation.repository';
import { MockClientRepository } from './infrastructure/mock/mock-client.repository';

if (environment.useFirebase) {
  try {
    initFirebase();
  } catch (e) {
    console.warn('Firebase initialization skipped:', e);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),

    // Inyección de Dependencias dinámica según configuración de entorno:
    { 
      provide: WALLY_REPOSITORY_TOKEN, 
      useClass: environment.useFirebase ? FirebaseWallyRepository : MockWallyRepository 
    },
    { 
      provide: COURT_REPOSITORY_TOKEN, 
      useClass: environment.useFirebase ? FirebaseCourtRepository : MockCourtRepository 
    },
    { 
      provide: RESERVATION_REPOSITORY_TOKEN, 
      useClass: environment.useFirebase ? FirebaseReservationRepository : MockReservationRepository 
    },
    { 
      provide: CLIENT_REPOSITORY_TOKEN, 
      useClass: environment.useFirebase ? FirebaseClientRepository : MockClientRepository 
    }
  ]
};
