import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { WALLY_REPOSITORY_TOKEN, COURT_REPOSITORY_TOKEN, RESERVATION_REPOSITORY_TOKEN, CLIENT_REPOSITORY_TOKEN } from './shared/repositories/tokens';
import { initFirebase } from './core/config/firebase.config';
import { FirebaseWallyRepository } from './infrastructure/firebase/firebase-wally.repository';
import { FirebaseCourtRepository } from './infrastructure/firebase/firebase-court.repository';
import { FirebaseReservationRepository } from './infrastructure/firebase/firebase-reservation.repository';
import { FirebaseClientRepository } from './infrastructure/firebase/firebase-client.repository';

// Inicializar SDK de Firebase
initFirebase();

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),

    // Dependency Injection para Repositorios (Conexión Real Firebase / Firestore)
    { provide: WALLY_REPOSITORY_TOKEN, useClass: FirebaseWallyRepository },
    { provide: COURT_REPOSITORY_TOKEN, useClass: FirebaseCourtRepository },
    { provide: RESERVATION_REPOSITORY_TOKEN, useClass: FirebaseReservationRepository },
    { provide: CLIENT_REPOSITORY_TOKEN, useClass: FirebaseClientRepository }
  ]
};
