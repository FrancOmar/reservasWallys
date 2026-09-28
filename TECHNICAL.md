# 🏗️ DOCUMENTACIÓN TÉCNICA Y ARQUITECTURA DE SOFTWARE

## SISTEMA WALLY — Frontend Multi-Tenant en Angular 21 con Firebase Integration

Este documento detalla la arquitectura de software, principios de diseño, patrones de construcción, modelo multi-tenant e integración oficial con **Firebase** en el frontend de **Sistema Wally**.

---

## 1. Principios de Arquitectura (Clean & Layered Architecture)

La aplicación sigue los principios de **Clean Architecture** (Arquitectura Limpia) y **Separation of Concerns (SoC)**, organizada en 5 capas concéntricas:

```
+-----------------------------------------------------------------------+
| 1. Presentation Layer (Componentes Standalone, HTML Templates, CSS)   |
+-----------------------------------------------------------------------+
                                  │
                                  ▼
+-----------------------------------------------------------------------+
| 2. Store / Context Layer (Signals, CurrentWallyContextService)        |
+-----------------------------------------------------------------------+
                                  │
                                  ▼
+-----------------------------------------------------------------------+
| 3. Application Services & Guards Layer (AuthService, RoleGuard)       |
+-----------------------------------------------------------------------+
                                  │
                                  ▼
+-----------------------------------------------------------------------+
| 4. Domain Layer (Interfaces TypeScript & Contract Repositories)       |
+-----------------------------------------------------------------------+
                                  │
                                  ▼
+-----------------------------------------------------------------------+
| 5. Infrastructure Layer (Firebase SDK & Firestore Repositories)       |
+-----------------------------------------------------------------------+
```

---

## 2. Configuración e Integración con Firebase

El proyecto incluye la configuración oficial de Firebase JS SDK v10+ conectada a las credenciales del proyecto **`reservaswallys`**.

### 2.1 Archivos de Entorno ([`src/environments/environment.ts`](file:///d:/Proyectos/reservas-wallys/src/environments/environment.ts))
```typescript
export const environment = {
  production: false,
  useFirebase: true,
  firebase: {
    apiKey: "AIzaSyAB5h3geCeBTWrg1__4_iX9cFHRd8R1CeE",
    authDomain: "reservaswallys.firebaseapp.com",
    projectId: "reservaswallys",
    storageBucket: "reservaswallys.firebasestorage.app",
    messagingSenderId: "1078651487465",
    appId: "1:1078651487465:web:ffa5af7f070fe44ed25c78",
    measurementId: "G-87EYVZFV02"
  }
};
```

### 2.2 Módulo de Inicialización ([`src/app/core/config/firebase.config.ts`](file:///d:/Proyectos/reservas-wallys/src/app/core/config/firebase.config.ts))
Inicializa las instancias de Firebase App, Authentication, Firestore Database y Google Analytics.

### 2.3 Repositorios Concretos en Firestore ([`src/app/infrastructure/firebase/`](file:///d:/Proyectos/reservas-wallys/src/app/infrastructure/firebase/))
- `FirebaseWallyRepository` (Colección `wallys`)
- `FirebaseCourtRepository` (Colección `courts`)
- `FirebaseReservationRepository` (Colección `reservations`)
- `FirebaseClientRepository` (Colección `clients`)

---

## 3. Inyección de Dependencias en `app.config.ts`

Los componentes visuales consumen las abstracciones del repositorio inyectadas mediante `InjectionToken` en `app.config.ts`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),

    // Inyección de Repositorios de Firebase
    { provide: WALLY_REPOSITORY_TOKEN, useClass: FirebaseWallyRepository },
    { provide: COURT_REPOSITORY_TOKEN, useClass: FirebaseCourtRepository },
    { provide: RESERVATION_REPOSITORY_TOKEN, useClass: FirebaseReservationRepository },
    { provide: CLIENT_REPOSITORY_TOKEN, useClass: FirebaseClientRepository }
  ]
};
```

---

## 4. Modelo Multi-Tenant (Inquilinos Aislados en Firestore)

Toda consulta e inserción realizada a Firestore vincula la propiedad `wallyId`:

```typescript
// Ejemplo de query en Firestore aislada por Inquilino (Tenant)
const colRef = collection(firebaseDb, 'reservations');
const q = query(colRef, where('wallyId', '==', activeWallyId), where('date', '==', selectedDate));
```

---

## 5. Verificación de Compilación

Compilación oficial verificada con la CLI de Angular:
```bash
npx ng build
```
Bundle generado exitosamente en `dist/reservas-wallys`.
