# 🏆 SISTEMA WALLY

> **Plataforma Web Multi-Tenant SaaS para la Administración, Publicación y Reserva de Canchas Deportivas**

[![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?style=for-the-badge&logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-21-06B6D4?style=for-the-badge&logo=primeng)](https://primeng.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## 📌 Visión General del Proyecto

**Sistema Wally** es una solución web integral diseñada bajo el modelo **SaaS (Software as a Service) Multi-Tenant**. Permite a dueños y administradores de complejos deportivos (*Wallys*) gestionar canchas, agendas, tarifas, clientes y contenido de su propio sitio web público, mientras brinda a los deportistas una experiencia fluida e intuitiva para consultar la disponibilidad de horarios en tiempo real y realizar reservas desde cualquier dispositivo.

---

## 🌟 Características Principales

### 🏟️ Portal Público de Reservas (Clientes)
- **Directorio General de Complejos (`/wallys`):** Búsqueda interactiva por nombre, ciudad o deporte con tarjetas de complejos (*cards*).
- **Sitio Web Público por Complejo (`/wally/:slug`):** Portal personalizado para cada establecimiento con banner institucional, fotos, información de contacto, mapa y horarios.
- **Grilla de Disponibilidad en Tiempo Real:** Filtro interactivo Cancha → Fecha → Horarios disponibles con tarifas transparentes.
- **Mobile First:** Diseño pensado prioritariamente para smartphones (ideal para compartir enlaces directos por WhatsApp).

### ⚙️ Panel de Administración (CMS Deportivo)
- **Dashboard del Complejo (`/admin/dashboard`):** Resumen de ocupación diaria, ingresos proyectados y métricas clave.
- **Agenda Visual Interactiva (`/admin/agenda`):** Vista de franjas horarias por cancha con estados (*Disponible*, *Reservado*, *Cancelado*) y registro de reservas directas.
- **Gestión de Canchas (`/admin/canchas`):** Alta, baja y modificación de canchas, tipo de superficie (césped sintético, madera, cristal panorámico), iluminación y precios por hora.
- **Historial de Reservas (`/admin/reservas`):** Tabla detallada de reservas con acciones de cancelación y filtro de estados.
- **Directorio de Clientes (`/admin/clientes`):** Control de clientes frecuentes, teléfonos de contacto e historial de reservas.
- **Personalizador CMS (`/admin/contenido`):** Edición de información pública, logo, portadas, WhatsApp de contacto y horarios de atención.

### 👑 Panel SuperAdministrador (SaaS Global)
- **Dashboard Global (`/super-admin/dashboard`):** Supervisión del ecosistema completo de Wallys, administradores registrados, volumen transaccionado y métricas del SaaS.
- **Gestión Multi-Tenant:** Activación/desactivación de complejos y asignación de administradores a uno o varios Wallys.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Angular 21](https://angular.dev/) (Standalone Components, Signals reactivos, Control Flow `@if` / `@for`, Lazy Loading).
- **Lenguaje:** [TypeScript 5.9](https://www.typescriptlang.org/) (Strict Type Checking).
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) + [PrimeIcons](https://primeng.org/icons).
- **Componentes UI:** [PrimeNG 21](https://primeng.org/).
- **Manejo de Estado:** Angular Signals + Services Facade.
- **Control de Acceso:** Router Guards (`AuthGuard`, `RoleGuard`) con sistema de Permisos RBAC.
- **Capa de Datos:** Clean Architecture con Patrón Repositorio e Inyección de Dependencias (`InjectionToken`).

---

## 🚀 Guía de Instalación y Ejecución Local

### Prerrequisitos
Asegúrate de tener instalado:
- **Node.js**: v18.0.0 o superior
- **npm**: v10.0.0 o superior

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/FrancOmar/reservasWallys.git
   cd reservas-wallys
   ```

2. **Instalar dependencias:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm start
   ```
   *(O alternativamente: `npx ng serve`)*

4. **Acceder en el navegador:**
   Navega a [http://localhost:4200/](http://localhost:4200/)

---

## 🗺️ Mapa de Rutas de la Aplicación

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/wallys` | Público | Directorio general de complejos deportivos registrados. |
| `/wally/:slug` | Público | Sitio web público del complejo deportivo (ej: `/wally/arena-sport`). |
| `/auth/login` | Público | Pantalla de inicio de sesión y simulador de roles de usuario. |
| `/admin/dashboard` | Admin | Dashboard principal del complejo activo. |
| `/admin/agenda` | Admin | Agenda gráfica y control de disponibilidad de canchas. |
| `/admin/canchas` | Admin | Catálogo y configuración de canchas. |
| `/admin/reservas` | Admin | Control y cancelación de reservas registradas. |
| `/admin/clientes` | Admin | Directorio de clientes del complejo. |
| `/admin/contenido` | Admin | Editor CMS (logo, portada, contacto, horarios). |
| `/super-admin/dashboard` | SuperAdmin | Panel de supervisión SaaS global y métricas transversales. |

---

## 📚 Documentación Técnica

Para información detallada sobre la arquitectura del software, patrón repositorio, aislamiento multi-tenant y estrategia de migración a Supabase/Firebase, consulta el documento técnico:

👉 **[TECHNICAL.md — Especificación de Arquitectura de Software](./TECHNICAL.md)**

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
