import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CurrentWallyContextService } from '../../../../core/tenant/current-wally-context.service';
import { COURT_REPOSITORY_TOKEN, RESERVATION_REPOSITORY_TOKEN } from '../../../../shared/repositories/tokens';
import { Court } from '../../../../shared/models/court.model';
import { Reservation } from '../../../../shared/models/reservation.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <!-- Welcome Header -->
      <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-400">CMS Deportivo</span>
          <h1 class="text-2xl sm:text-3xl font-black text-white leading-tight">
            {{ tenantContext.currentWally()?.name || 'Administración de Complejo' }}
          </h1>
          <p class="text-xs text-slate-300 mt-1">
            Gestión de canchas, horarios, reservas y contenido público
          </p>
        </div>
        <div class="flex items-center gap-3">
          <a [routerLink]="['/wally', tenantContext.currentWally()?.slug]" target="_blank" class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2">
            <i class="pi pi-external-link"></i> Ver Mi Sitio Web Público
          </a>
        </div>
      </div>

      <!-- Quick Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-slate-500 font-medium">Canchas Habilitadas</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <i class="pi pi-table"></i>
            </div>
          </div>
          <h3 class="text-2xl font-black text-slate-900">{{ courts().length }}</h3>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-slate-500 font-medium">Reservas de Hoy</span>
            <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <i class="pi pi-bookmark"></i>
            </div>
          </div>
          <h3 class="text-2xl font-black text-slate-900">{{ reservations().length }}</h3>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-slate-500 font-medium">Ingresos Proyectados</span>
            <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <i class="pi pi-dollar"></i>
            </div>
          </div>
          <h3 class="text-2xl font-black text-slate-900">Bs. {{ totalRevenue() }}</h3>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-slate-500 font-medium">Tasa de Ocupación</span>
            <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <i class="pi pi-chart-line"></i>
            </div>
          </div>
          <h3 class="text-2xl font-black text-slate-900">78%</h3>
        </div>
      </div>

      <!-- Reservations Table -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-900 text-base">Próximas Reservas Registradas</h3>
            <p class="text-xs text-slate-500">Reservas correspondientes a este complejo</p>
          </div>
          <a routerLink="/admin/agenda" class="text-xs font-bold text-emerald-600 hover:text-emerald-700">Ver Agenda Completa →</a>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th class="p-4">Cliente</th>
                <th class="p-4">Teléfono</th>
                <th class="p-4">Fecha & Hora</th>
                <th class="p-4">Total</th>
                <th class="p-4">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (res of reservations(); track res.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="p-4 font-bold text-slate-900">{{ res.clientName }}</td>
                  <td class="p-4 font-mono">{{ res.clientPhone }}</td>
                  <td class="p-4">
                    <span class="font-semibold text-slate-800">{{ res.date }}</span> 
                    <span class="text-slate-400 font-mono text-[11px] ml-1">({{ res.startTime }} - {{ res.endTime }})</span>
                  </td>
                  <td class="p-4 font-bold text-emerald-600">Bs. {{ res.totalPrice }}</td>
                  <td class="p-4">
                    <app-status-badge [status]="res.status" [label]="res.status"></app-status-badge>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  tenantContext = inject(CurrentWallyContextService);
  private courtRepo = inject(COURT_REPOSITORY_TOKEN);
  private reservationRepo = inject(RESERVATION_REPOSITORY_TOKEN);

  courts = signal<Court[]>([]);
  reservations = signal<Reservation[]>([]);

  ngOnInit(): void {
    const wallyId = this.tenantContext.currentWallyId();
    if (wallyId) {
      this.courtRepo.findByWallyId(wallyId).subscribe(c => this.courts.set(c));
      this.reservationRepo.findByWallyId(wallyId).subscribe(r => this.reservations.set(r));
    }
  }

  totalRevenue(): number {
    return this.reservations().reduce((sum, r) => sum + r.totalPrice, 0);
  }
}
