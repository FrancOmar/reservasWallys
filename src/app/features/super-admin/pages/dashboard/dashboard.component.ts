import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WALLY_REPOSITORY_TOKEN } from '../../../../shared/repositories/tokens';
import { Wally } from '../../../../shared/models/wally.model';
import { MOCK_USERS } from '../../../../infrastructure/mock/mock-data';

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Title Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">SuperAdmin Panel</span>
          <h1 class="text-2xl font-black text-slate-900">Dashboard Global SaaS</h1>
          <p class="text-xs text-slate-500">Métricas y supervisión de todos los complejos en Sistema Wally</p>
        </div>
        <a routerLink="/super-admin/wallys" class="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center gap-2">
          <i class="pi pi-plus"></i> Registrar Nuevo Wally
        </a>
      </div>

      <!-- Key Metrics Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
            <i class="pi pi-building"></i>
          </div>
          <div>
            <p class="text-xs text-slate-500 font-medium">Complejos Registrados</p>
            <h3 class="text-2xl font-black text-slate-900">{{ wallys().length }}</h3>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
            <i class="pi pi-users"></i>
          </div>
          <div>
            <p class="text-xs text-slate-500 font-medium">Administradores</p>
            <h3 class="text-2xl font-black text-slate-900">{{ adminsCount }}</h3>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold">
            <i class="pi pi-calendar"></i>
          </div>
          <div>
            <p class="text-xs text-slate-500 font-medium">Reservas Este Mes</p>
            <h3 class="text-2xl font-black text-slate-900">428</h3>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-bold">
            <i class="pi pi-dollar"></i>
          </div>
          <div>
            <p class="text-xs text-slate-500 font-medium">Volumen Transaccionado</p>
            <h3 class="text-2xl font-black text-slate-900">Bs. 64.200</h3>
          </div>
        </div>
      </div>

      <!-- Wallys SaaS Management Table -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-bold text-slate-900 text-base">Complejos Deportivos en la Plataforma</h3>
          <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            {{ wallys().length }} Complejos Activos
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th class="p-4">Complejo</th>
                <th class="p-4">Slug URL</th>
                <th class="p-4">Ciudad</th>
                <th class="p-4">WhatsApp</th>
                <th class="p-4">Estado</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (wally of wallys(); track wally.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="p-4 font-bold text-slate-900 flex items-center gap-3">
                    <img [src]="wally.logoUrl" [alt]="wally.name" class="w-8 h-8 rounded-lg object-cover" />
                    {{ wally.name }}
                  </td>
                  <td class="p-4 font-mono text-emerald-600 font-semibold">/wally/{{ wally.slug }}</td>
                  <td class="p-4">{{ wally.contact.city }}</td>
                  <td class="p-4">{{ wally.contact.whatsapp }}</td>
                  <td class="p-4">
                    <span [ngClass]="wally.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'" class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
                      {{ wally.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="p-4 text-right space-x-2">
                    <a [routerLink]="['/wally', wally.slug]" target="_blank" class="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium inline-block">
                      <i class="pi pi-external-link"></i>
                    </a>
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
export class SuperAdminDashboardComponent implements OnInit {
  private wallyRepo = inject(WALLY_REPOSITORY_TOKEN);

  wallys = signal<Wally[]>([]);
  adminsCount = MOCK_USERS.filter(u => u.role === 'ADMIN').length;

  ngOnInit(): void {
    this.wallyRepo.findAll().subscribe(data => this.wallys.set(data));
  }
}
