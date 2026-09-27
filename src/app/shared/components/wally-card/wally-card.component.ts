import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Wally } from '../../models/wally.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-wally-card',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  template: `
    <div class="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <!-- Portada Image -->
      <div class="relative h-44 overflow-hidden bg-slate-900">
        <img [src]="wally().coverUrl" [alt]="wally().name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        
        <!-- Status Badge -->
        <div class="absolute top-3 right-3">
          <app-status-badge [status]="wally().isActive ? 'ACTIVE' : 'INACTIVE'" [label]="wally().isActive ? 'Abierto' : 'Cerrado'"></app-status-badge>
        </div>

        <!-- Logo Avatar Floating -->
        <div class="absolute -bottom-4 left-5 w-14 h-14 rounded-xl overflow-hidden border-2 border-white bg-white shadow-md">
          <img [src]="wally().logoUrl" [alt]="wally().name" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-5 pt-6 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              {{ wally().name }}
            </h3>
          </div>

          <p class="text-xs text-slate-500 flex items-center gap-1 mb-3">
            <i class="pi pi-map-marker text-emerald-500"></i>
            {{ wally().contact.address }}, {{ wally().contact.city }}
          </p>

          <p class="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {{ wally().description }}
          </p>
        </div>

        <!-- Card Footer -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div class="text-xs font-medium text-slate-500 flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              <i class="pi pi-clock text-emerald-600"></i>
              7 AM - 11 PM
            </span>
          </div>

          <a [routerLink]="['/wally', wally().slug]" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold transition-all">
            Ver Complejo
            <i class="pi pi-arrow-right text-[10px]"></i>
          </a>
        </div>
      </div>
    </div>
  `
})
export class WallyCardComponent {
  wally = input.required<Wally>();
}
