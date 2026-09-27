import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CurrentWallyContextService } from '../../tenant/current-wally-context.service';
import { MOCK_WALLYS } from '../../../infrastructure/mock/mock-data';
import { RoleType } from '../../../shared/models/user.model';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <!-- Sidebar Desktop -->
      <aside [ngClass]="isSidebarCollapsed() ? 'w-20' : 'w-64'" class="bg-slate-900 text-slate-200 transition-all duration-300 flex flex-col z-30 hidden md:flex shrink-0 border-r border-slate-800">
        <!-- Sidebar Header / Brand -->
        <div class="h-16 px-4 flex items-center justify-between border-b border-slate-800">
          <div class="flex items-center gap-3 overflow-hidden" *ngIf="!isSidebarCollapsed()">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              W
            </div>
            <div>
              <h1 class="font-extrabold text-white text-base leading-none tracking-tight">WALLY</h1>
              <span class="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">SaaS Sports</span>
            </div>
          </div>
          <div *ngIf="isSidebarCollapsed()" class="mx-auto">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-300 flex items-center justify-center text-slate-950 font-black text-xl">
              W
            </div>
          </div>
          <button (click)="toggleSidebar()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <i class="pi" [ngClass]="isSidebarCollapsed() ? 'pi-chevron-right' : 'pi-chevron-left'"></i>
          </button>
        </div>

        <!-- Tenant Selector / Switcher -->
        <div class="p-3 border-b border-slate-800/80" *ngIf="!isSidebarCollapsed() && authService.isAdmin()">
          <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Complejo Activo</label>
          <div class="relative">
            <select [value]="tenantContext.currentWallyId()" (change)="onSelectWally($event)" class="w-full bg-slate-800 text-white text-xs font-semibold rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none">
              @for (wally of allWallys; track wally.id) {
                <option [value]="wally.id">{{ wally.name }}</option>
              }
            </select>
            <i class="pi pi-chevron-down absolute right-3 top-2.5 text-slate-400 pointer-events-none text-xs"></i>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
          <!-- SUPER ADMIN SECTION -->
          <ng-container *ngIf="authService.isSuperAdmin()">
            <div *ngIf="!isSidebarCollapsed()" class="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Super Administración</div>
            <a routerLink="/super-admin/dashboard" routerLinkActive="bg-emerald-600/10 text-emerald-400 font-semibold border-l-4 border-emerald-500" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm">
              <i class="pi pi-chart-bar text-emerald-400 text-base"></i>
              <span *ngIf="!isSidebarCollapsed()">Dashboard Global</span>
            </a>
            <a routerLink="/super-admin/wallys" routerLinkActive="bg-emerald-600/10 text-emerald-400 font-semibold border-l-4 border-emerald-500" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm">
              <i class="pi pi-building text-emerald-400 text-base"></i>
              <span *ngIf="!isSidebarCollapsed()">Wallys Complejos</span>
            </a>
            <a routerLink="/super-admin/administradores" routerLinkActive="bg-emerald-600/10 text-emerald-400 font-semibold border-l-4 border-emerald-500" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm">
              <i class="pi pi-users text-emerald-400 text-base"></i>
              <span *ngIf="!isSidebarCollapsed()">Administradores</span>
            </a>
          </ng-container>

          <!-- ADMIN SECTION -->
          <ng-container *ngIf="authService.isAdmin() || authService.isSuperAdmin()">
            <div *ngIf="!isSidebarCollapsed()" class="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Gestión del Wally</div>
            <a routerLink="/admin/dashboard" routerLinkActive="bg-emerald-600/10 text-emerald-400 font-semibold border-l-4 border-emerald-500" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm">
              <i class="pi pi-home text-base"></i>
              <span *ngIf="!isSidebarCollapsed()">Dashboard Wally</span>
            </a>
            <a routerLink="/admin/agenda" routerLinkActive="bg-emerald-600/10 text-emerald-400 font-semibold border-l-4 border-emerald-500" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm">
              <i class="pi pi-calendar text-base text-emerald-400"></i>
              <span *ngIf="!isSidebarCollapsed()">Agenda & Horarios</span>
            </a>
            <a routerLink="/admin/reservas" routerLinkActive="bg-emerald-600/10 text-emerald-400 font-semibold border-l-4 border-emerald-500" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm">
              <i class="pi pi-bookmark text-base"></i>
              <span *ngIf="!isSidebarCollapsed()">Reservas</span>
            </a>
            <a routerLink="/admin/canchas" routerLinkActive="bg-emerald-600/10 text-emerald-400 font-semibold border-l-4 border-emerald-500" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm">
              <i class="pi pi-table text-base"></i>
              <span *ngIf="!isSidebarCollapsed()">Canchas</span>
            </a>
            <a routerLink="/admin/clientes" routerLinkActive="bg-emerald-600/10 text-emerald-400 font-semibold border-l-4 border-emerald-500" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm">
              <i class="pi pi-id-card text-base"></i>
              <span *ngIf="!isSidebarCollapsed()">Clientes</span>
            </a>
            <a routerLink="/admin/contenido" routerLinkActive="bg-emerald-600/10 text-emerald-400 font-semibold border-l-4 border-emerald-500" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm">
              <i class="pi pi-desktop text-base"></i>
              <span *ngIf="!isSidebarCollapsed()">CMS Deportivo</span>
            </a>
          </ng-container>

          <div class="pt-4 mt-4 border-t border-slate-800">
            <a routerLink="/wallys" target="_blank" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-all text-xs">
              <i class="pi pi-external-link"></i>
              <span *ngIf="!isSidebarCollapsed()">Ver Portal Público</span>
            </a>
          </div>
        </nav>

        <!-- User Profile Footer -->
        <div class="p-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div class="flex items-center gap-2.5 overflow-hidden" *ngIf="!isSidebarCollapsed()">
            <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0">
              {{ authService.currentUser()?.fullName?.charAt(0) }}
            </div>
            <div class="overflow-hidden">
              <p class="text-xs font-semibold text-white truncate">{{ authService.currentUser()?.fullName }}</p>
              <p class="text-[10px] text-emerald-400 font-mono uppercase">{{ authService.currentRole() }}</p>
            </div>
          </div>
          <button (click)="logout()" class="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors" title="Cerrar Sesión">
            <i class="pi pi-power-off text-sm"></i>
          </button>
        </div>
      </aside>

      <!-- Main Layout Right Column -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Topbar Navbar -->
        <header class="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <!-- Left: Mobile Menu Toggle & Title -->
          <div class="flex items-center gap-3">
            <button (click)="isMobileDrawerOpen.set(true)" class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
              <i class="pi pi-bars text-lg"></i>
            </button>
            <div>
              <h2 class="text-base font-bold text-slate-900 leading-tight">
                {{ tenantContext.currentWally()?.name || 'Administración Wally' }}
              </h2>
              <p class="text-xs text-slate-500 flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Panel de Gestión
              </p>
            </div>
          </div>

          <!-- Right: Role Switcher Tool & Actions -->
          <div class="flex items-center gap-3">
            <!-- Selector Rápido de Rol para testing -->
            <div class="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span class="text-[10px] font-bold text-slate-400 uppercase px-1">Simular:</span>
              <button (click)="switchRole('SUPER_ADMIN')" [ngClass]="authService.isSuperAdmin() ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'" class="px-2 py-1 rounded transition-colors text-xs">
                SuperAdmin
              </button>
              <button (click)="switchRole('ADMIN')" [ngClass]="authService.isAdmin() ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'" class="px-2 py-1 rounded transition-colors text-xs">
                Admin Wally
              </button>
            </div>

            <button class="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <i class="pi pi-bell text-lg"></i>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
          </div>
        </header>

        <!-- Main Workspace Router Outlet -->
        <main class="flex-1 p-4 md:p-6 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Mobile Sidebar Drawer -->
      <div *ngIf="isMobileDrawerOpen()" class="fixed inset-0 z-50 flex md:hidden">
        <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" (click)="isMobileDrawerOpen.set(false)"></div>
        <div class="relative w-72 bg-slate-900 text-white flex flex-col h-full z-10 p-4">
          <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h3 class="font-bold text-white text-lg">SISTEMA WALLY</h3>
            <button (click)="isMobileDrawerOpen.set(false)" class="p-2 text-slate-400 hover:text-white">
              <i class="pi pi-times"></i>
            </button>
          </div>
          <!-- Mobile Links -->
          <nav class="flex-1 space-y-2">
            <a routerLink="/admin/dashboard" (click)="isMobileDrawerOpen.set(false)" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-800">
              <i class="pi pi-home text-emerald-400"></i> Dashboard
            </a>
            <a routerLink="/admin/agenda" (click)="isMobileDrawerOpen.set(false)" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-800">
              <i class="pi pi-calendar text-emerald-400"></i> Agenda & Horarios
            </a>
            <a routerLink="/admin/canchas" (click)="isMobileDrawerOpen.set(false)" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-800">
              <i class="pi pi-table text-emerald-400"></i> Canchas
            </a>
            <a routerLink="/admin/reservas" (click)="isMobileDrawerOpen.set(false)" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-800">
              <i class="pi pi-bookmark text-emerald-400"></i> Reservas
            </a>
            <a routerLink="/super-admin/dashboard" (click)="isMobileDrawerOpen.set(false)" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-800">
              <i class="pi pi-chart-bar text-emerald-400"></i> Panel SuperAdmin
            </a>
          </nav>
        </div>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  tenantContext = inject(CurrentWallyContextService);
  private router = inject(Router);

  isSidebarCollapsed = signal<boolean>(false);
  isMobileDrawerOpen = signal<boolean>(false);
  allWallys = MOCK_WALLYS;

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(val => !val);
  }

  onSelectWally(event: Event): void {
    const wallyId = (event.target as HTMLSelectElement).value;
    this.tenantContext.setWally(wallyId);
  }

  switchRole(role: RoleType): void {
    this.authService.switchUserRole(role);
    if (role === 'SUPER_ADMIN') {
      this.router.navigate(['/super-admin/dashboard']);
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
