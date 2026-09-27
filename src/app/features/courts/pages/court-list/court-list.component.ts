import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrentWallyContextService } from '../../../../core/tenant/current-wally-context.service';
import { COURT_REPOSITORY_TOKEN } from '../../../../shared/repositories/tokens';
import { Court, SportType } from '../../../../shared/models/court.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-court-list',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Gestión de Canchas</h1>
          <p class="text-xs text-slate-500">Canchas asociadas a {{ tenantContext.currentWally()?.name }}</p>
        </div>
        <button (click)="openCreateModal()" class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2">
          <i class="pi pi-plus"></i> Nueva Cancha
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (court of courts(); track court.id) {
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div class="relative h-36 bg-slate-900">
              <img [src]="court.mediaUrls[0]" [alt]="court.name" class="w-full h-full object-cover" />
              <div class="absolute top-3 right-3">
                <app-status-badge [status]="court.status" [label]="court.status"></app-status-badge>
              </div>
            </div>
            <div class="p-5">
              <h3 class="font-bold text-slate-900 text-base mb-1">{{ court.name }}</h3>
              <p class="text-xs text-slate-500 mb-3">{{ court.sport }} - {{ court.surfaceType }}</p>
              <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                <span class="text-xs font-black text-emerald-600">Bs. {{ court.hourlyRate }}/hr</span>
                <button (click)="deleteCourt(court.id)" class="text-xs text-rose-500 hover:text-rose-700 font-semibold">Eliminar</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CourtListComponent implements OnInit {
  tenantContext = inject(CurrentWallyContextService);
  private courtRepo = inject(COURT_REPOSITORY_TOKEN);

  courts = signal<Court[]>([]);

  ngOnInit(): void {
    this.loadCourts();
  }

  loadCourts(): void {
    const wId = this.tenantContext.currentWallyId();
    if (wId) {
      this.courtRepo.findByWallyId(wId).subscribe(list => this.courts.set(list));
    }
  }

  openCreateModal(): void {
    const name = prompt('Nombre de la cancha (ej. Cancha 3 - Fútbol 5):');
    if (name) {
      this.courtRepo.create({
        wallyId: this.tenantContext.currentWallyId()!,
        name,
        description: 'Nueva cancha deportiva',
        sport: 'FUTBOL_5',
        surfaceType: 'Sintético 50mm',
        isCovered: true,
        status: 'ACTIVE',
        hourlyRate: 150,
        colorHex: '#10B981',
        mediaUrls: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'],
        features: ['Iluminación LED']
      }).subscribe(() => this.loadCourts());
    }
  }

  deleteCourt(id: string): void {
    if (confirm('¿Deseas eliminar esta cancha?')) {
      this.courtRepo.delete(id).subscribe(() => this.loadCourts());
    }
  }
}
