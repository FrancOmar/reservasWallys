import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Court } from '../../models/court.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-court-card',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div class="relative h-40 bg-slate-800">
        <img [src]="court().mediaUrls[0]" [alt]="court().name" class="w-full h-full object-cover" />
        <div class="absolute top-3 right-3">
          <app-status-badge [status]="court().status" [label]="court().status"></app-status-badge>
        </div>
        <div class="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-xs font-semibold">
          {{ court().surfaceType }}
        </div>
      </div>

      <div class="p-4">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-bold text-slate-900 text-base">{{ court().name }}</h4>
          <span class="text-sm font-extrabold text-emerald-600">Bs. {{ court().hourlyRate }}/hr</span>
        </div>

        <p class="text-xs text-slate-500 mb-3 line-clamp-2">{{ court().description }}</p>

        <div class="flex flex-wrap gap-1.5 mb-4">
          @for (feature of court().features; track feature) {
            <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium flex items-center gap-1">
              <i class="pi pi-check text-emerald-500 text-[9px]"></i>
              {{ feature }}
            </span>
          }
        </div>
      </div>
    </div>
  `
})
export class CourtCardComponent {
  court = input.required<Court>();
}
