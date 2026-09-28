# 🏗️ DOCUMENTACIÓN TÉCNICA Y ARQUITECTURA DE SOFTWARE

## SISTEMA WALLY — Frontend Multi-Tenant en Angular 21

Este documento detalla la arquitectura de software, principios de diseño, patrones de construcción, modelo multi-tenant y la estrategia de persistencia desacoplada implementados en el frontend de **Sistema Wally**.

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
| 5. Infrastructure Layer (Mock Repositories → Supabase / Firebase)     |
+-----------------------------------------------------------------------+
```

### Características Clave:
- **Zero-Direct Backend Coupling:** Ningún componente de interfaz de usuario (`Component`) importa ni conoce APIs directas de bases de datos o servicios externos.
- **Inversión de Dependencias (DIP):** Los componentes dependen únicamente de abstracciones (`Interfaces` e `InjectionTokens`).

---

## 2. Estructura de Directorios (Feature-Based Architecture)

```
src/
├── app/
│   ├── core/                        # Singleton Services, Guards, Interceptors & Layouts
│   │   ├── auth/                    # AuthService (Signal-based auth state)
│   │   ├── guards/                  # AuthGuard, RoleGuard
│   │   ├── layout/                  # AdminLayoutComponent, PublicLayoutComponent
│   │   └── tenant/                  # CurrentWallyContextService (Tenant context manager)
│   │
│   ├── shared/                      # Elementos globales reutilizables
│   │   ├── components/              # Design System UI (StatusBadge, WallyCard, CourtCard)
│   │   ├── models/                  # Domain Interfaces (Wally, Court, Reservation, Client)
│   │   └── repositories/            # Contratos de Repositorios (BaseRepository, Tokens)
│   │
│   ├── infrastructure/              # Implementaciones de Infraestructura
│   │   └── mock/                    # Mock Repositories con latencia asíncrona simulada (RxJS)
│   │       ├── mock-data.ts         # Dataset inicial estructurado
│   │       ├── mock-wally.repository.ts
│   │       ├── mock-court.repository.ts
│   │       ├── mock-reservation.repository.ts
│   │       └── mock-client.repository.ts
│   │
│   ├── features/                    # Módulos Lazy-Loaded por funcionalidad
│   │   ├── auth/                    # Página de Login / Selector de rol
│   │   ├── public-portal/           # Directorio público (/wallys) y Portal (/wally/:slug)
│   │   ├── super-admin/             # Dashboard SaaS Global
│   │   ├── admin-cms/               # Dashboard CMS del Complejo y Personalizador
│   │   ├── calendar-agenda/         # Agenda visual interactiva por horarios
│   │   ├── courts/                  # Gestión CRUD de canchas
│   │   ├── reservations/            # Listado e historial de reservas
│   │   └── clients/                 # Directorio de clientes
│   │
│   ├── app.config.ts                # Proveedores globales DI y Rutas
│   ├── app.routes.ts                # Definición de Enrutamiento
│   └── app.ts                       # Componente Raíz (<router-outlet>)
│
└── styles.css                       # Design Tokens, Tailwind CSS v4 e Importaciones
```

---

## 3. Modelo Multi-Tenant (Inquilinos Aislados)

### 🔑 Aislamiento por `wallyId`
Toda entidad perteneciente a un establecimiento deportivo (canchas, reservas, clientes, fotografías, tarifas) contiene obligatoriamente la propiedad de aislamiento:

```typescript
export interface Court {
  id: string;
  wallyId: string; // Key de aislamiento Multi-Tenant
  name: string;
  // ...
}
```

### 🔄 Contexto de Inquilino Activo (`CurrentWallyContextService`)
En el panel administrativo, `CurrentWallyContextService` gestiona el estado reactivo del complejo seleccionado mediante Angular Signals:

```typescript
@Injectable({ providedIn: 'root' })
export class CurrentWallyContextService {
  readonly currentWallyId = signal<string | null>('wally-arena-sport');
  readonly currentWally = signal<Wally | null>(null);

  setWally(wallyId: string): void {
    this.currentWallyId.set(wallyId);
    this.loadWally(wallyId);
  }
}
```
Si un `ADMIN` tiene asignados múltiples complejos, un dropdown en el Topbar le permite cambiar de contexto en tiempo real sin recargar la página.

---

## 4. Matriz de Roles y Permisos (RBAC)

El sistema soporta tres roles principales con la siguiente matriz de accesos:

| Funcionalidad / Módulo | `SUPER_ADMIN` | `ADMIN` (Wally Owner) | `CLIENT` (Público) |
| --- | :---: | :---: | :---: |
| **Acceso a Métricas Globales SaaS** | ✅ | ❌ | ❌ |
| **Alta / Baja de Wallys en la Plataforma** | ✅ | ❌ | ❌ |
| **Gestión de Administradores** | ✅ | ❌ | ❌ |
| **Gestión de Canchas del Wally** | ✅ | ✅ (Sus complejos) | ❌ (Solo lectura) |
| **Agenda y Registro de Reservas** | ✅ | ✅ (Sus complejos) | ❌ (Consulta disponibilidad) |
| **Gestión de Clientes** | ✅ | ✅ | ❌ |
| **Edición CMS (Logo, Portada, Horarios)** | ✅ | ✅ (Su complejo) | ❌ (Solo lectura) |
| **Consulta Pública de Disponibilidad** | ✅ | ✅ | ✅ (`/wally/:slug`) |

---

## 5. Patrón Repositorio e Inyección de Dependencias (DI)

### 5.1 Interfaces de Contrato
Los contratos definen las operaciones asíncronas utilizando `Observable` de RxJS:

```typescript
export interface WallyRepository extends BaseRepository<Wally> {
  findBySlug(slug: string): Observable<Wally | null>;
  findActiveWallys(): Observable<Wally[]>;
}
```

### 5.2 Dependency Injection Tokens
Los tokens desacoplan la interfaz visual de la clase concreta:

```typescript
export const WALLY_REPOSITORY_TOKEN = new InjectionToken<WallyRepository>('WallyRepository');
export const COURT_REPOSITORY_TOKEN = new InjectionToken<CourtRepository>('CourtRepository');
export const RESERVATION_REPOSITORY_TOKEN = new InjectionToken<ReservationRepository>('ReservationRepository');
export const CLIENT_REPOSITORY_TOKEN = new InjectionToken<ClientRepository>('ClientRepository');
```

---

## 6. Estrategia de Migración Mock → Supabase / Firebase

Actualmente la aplicación utiliza implementaciones **Mock** (`MockWallyRepository`, `MockCourtRepository`, etc.) que simulan latencia de red (`delay(200)`).

### 🚀 Cómo migrar a Supabase o Firebase en el futuro

Cuando se desarrolle el backend o la persistencia real:

1. **Crear las clases de infraestructura real:**
   ```typescript
   // src/app/infrastructure/supabase/supabase-wally.repository.ts
   @Injectable()
   export class SupabaseWallyRepository implements WallyRepository {
     // Implementación usando @supabase/supabase-js
   }
   ```

2. **Sustituir el proveedor en `app.config.ts`:**
   ```typescript
   // src/app/app.config.ts
   export const appConfig: ApplicationConfig = {
     providers: [
       // ANTES (Fase Prototipo / Frontend pure):
       // { provide: WALLY_REPOSITORY_TOKEN, useClass: MockWallyRepository },

       // DESPUÉS (Fase Producción Backend):
       { provide: WALLY_REPOSITORY_TOKEN, useClass: SupabaseWallyRepository },
       { provide: COURT_REPOSITORY_TOKEN, useClass: SupabaseCourtRepository },
       { provide: RESERVATION_REPOSITORY_TOKEN, useClass: SupabaseReservationRepository }
     ]
   };
   ```

**¡Resultado!** No será necesario modificar una sola línea de código en los componentes visuales, páginas o guardias de la aplicación.

---

## 7. Manejo de Estado Reactivo (Angular Signals)

Se utiliza el sistema nativo de **Signals** de Angular para un rendimiento óptimo y libre de sobrecarga de zona:

- `signal()`: Estado mutable local y global.
- `computed()`: Valores derivados computados automáticamente.
- `@if` / `@for`: Nuevo flujo de control reactivo nativo de Angular 21.

Ejemplo en `AuthService`:
```typescript
readonly currentUser = signal<User | null>(MOCK_USERS[1]);
readonly isAuthenticated = computed(() => !!this.currentUser());
readonly currentRole = computed(() => this.currentUser()?.role || null);
```

---

## 8. Sistema de Diseño e Identidad Visual

- **Paleta de Colores (Design Tokens en `src/styles.css`):**
  - Azul Noche Profundo: `--color-brand-dark: #0F172A`
  - Verde Energético Césped: `--color-brand-accent: #10B981`
  - Fondo Estándar: `--color-bg-app: #F8FAFC`
- **Tipografía:** *Outfit* (Encabezados deportivos) + *Inter* (Cuerpo de texto legible).
- **Componentes UI:** PrimeNG (Iconos `PrimeIcons`, estructura base) + Tailwind CSS v4 (`@import 'tailwindcss';`).

---

## 9. Verificación de Compilación

La compilación se verifica mediante la CLI de Angular:

```bash
npx ng build
```

Bundle generado en `dist/reservas-wallys` libre de errores de TypeScript y plantillas HTML.
