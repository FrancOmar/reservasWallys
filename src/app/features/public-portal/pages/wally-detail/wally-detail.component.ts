import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Wally } from '../../../../shared/models/wally.model';
import { Court } from '../../../../shared/models/court.model';
import { TimeSlot } from '../../../../shared/models/reservation.model';
import { WALLY_REPOSITORY_TOKEN, COURT_REPOSITORY_TOKEN, RESERVATION_REPOSITORY_TOKEN } from '../../../../shared/repositories/tokens';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-wally-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StatusBadgeComponent],
  template: `
    @if (isLoading()) {
      <div class="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div class="flex items-center gap-3 text-emerald-400 font-bold">
          <i class="pi pi-spin pi-spinner text-2xl"></i> Cargando complejo deportivo...
        </div>
      </div>
    } @else if (!wally()) {
      <div class="max-w-4xl mx-auto my-20 text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
        <i class="pi pi-exclamation-triangle text-5xl text-amber-500 mb-4"></i>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Complejo no encontrado</h2>
        <p class="text-slate-500 mb-6">No existe ningún establecimiento con esta dirección.</p>
        <a routerLink="/wallys" class="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl">Volver al Directorio</a>
      </div>
    } @else {
      <!-- Wally Public Web Banner -->
      <div class="relative bg-slate-950 text-white border-b border-slate-800">
        <div class="h-64 sm:h-80 w-full overflow-hidden relative">
          <img [src]="wally()?.coverUrl" [alt]="wally()?.name" class="w-full h-full object-cover opacity-75" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 pb-8">
          <div class="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <img [src]="wally()?.logoUrl" [alt]="wally()?.name" class="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-slate-950 shadow-2xl object-cover bg-white shrink-0" />
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1">
                <h1 class="text-2xl sm:text-4xl font-black text-white tracking-tight">{{ wally()?.name }}</h1>
                <app-status-badge [status]="wally()?.isActive ? 'ACTIVE' : 'INACTIVE'" [label]="wally()?.isActive ? 'Abierto' : 'Cerrado'"></app-status-badge>
              </div>
              <p class="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mb-2">
                <i class="pi pi-map-marker text-emerald-400"></i>
                {{ wally()?.contact?.address }}, {{ wally()?.contact?.city }}
              </p>
            </div>
            <a [href]="'https://wa.me/' + wally()?.contact?.whatsapp" target="_blank" class="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-sm transition-all">
              <i class="pi pi-whatsapp text-lg"></i>
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Column: Canchas & Availability -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Overview Description -->
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 class="text-lg font-bold text-slate-900 mb-2">Acerca de este Complejo</h3>
            <p class="text-slate-600 text-sm leading-relaxed">{{ wally()?.description }}</p>
          </div>

          <!-- Canchas Section -->
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-black text-slate-900">Canchas Disponibles</h3>
                <p class="text-xs text-slate-500">Selecciona una cancha para verificar horarios</p>
              </div>
              <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                {{ courts().length }} Canchas
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              @for (court of courts(); track court.id) {
                <div (click)="selectCourt(court)" [ngClass]="selectedCourt()?.id === court.id ? 'border-2 border-emerald-500 bg-emerald-50/50' : 'border border-slate-200 hover:border-slate-300'" class="p-4 rounded-xl cursor-pointer transition-all">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-bold text-slate-900 text-sm">{{ court.name }}</h4>
                    <span class="text-xs font-black text-emerald-600">Bs. {{ court.hourlyRate }}/hr</span>
                  </div>
                  <p class="text-xs text-slate-500 mb-2">{{ court.sport }} - {{ court.surfaceType }}</p>
                  <div class="flex items-center gap-1 text-[11px] text-slate-400">
                    <i class="pi pi-check-circle text-emerald-500"></i> {{ court.isCovered ? 'Techada' : 'Al Aire Libre' }}
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Availability TimeSlot Picker -->
          @if (selectedCourt()) {
            <div class="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Disponibilidad en Tiempo Real</span>
                  <h3 class="text-lg font-bold text-white">{{ selectedCourt()?.name }}</h3>
                </div>
                <input type="date" [(ngModel)]="selectedDate" (change)="loadAvailability()" class="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 outline-none" />
              </div>

              <!-- TimeSlots Grid -->
              <div class="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
                @for (slot of timeSlots(); track slot.startTime) {
                  <div [ngClass]="slot.isAvailable ? 'bg-slate-800 hover:bg-emerald-600 text-white border-slate-700 cursor-pointer' : 'bg-rose-950/40 text-rose-300 border-rose-900/50 cursor-not-allowed opacity-60'" class="p-2.5 rounded-xl border text-center transition-all">
                    <div class="text-xs font-bold">{{ slot.startTime }}</div>
                    <div class="text-[10px] font-semibold mt-1">
                      {{ slot.isAvailable ? 'Bs. ' + slot.price : 'Reservado' }}
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Sidebar Info Column -->
        <div class="space-y-6">
          <!-- Contact Box -->
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h4 class="font-bold text-slate-900 text-base border-b pb-3">Información de Contacto</h4>
            <div class="space-y-3 text-xs text-slate-600">
              <div class="flex items-center gap-3">
                <i class="pi pi-phone text-emerald-600 text-base"></i>
                <span>{{ wally()?.contact?.phone }}</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-envelope text-emerald-600 text-base"></i>
                <span>{{ wally()?.contact?.email }}</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-map-marker text-emerald-600 text-base"></i>
                <span>{{ wally()?.contact?.address }}</span>
              </div>
            </div>
          </div>

          <!-- Business Hours Box -->
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h4 class="font-bold text-slate-900 text-base border-b pb-3 mb-3">Horarios de Atención</h4>
            <div class="space-y-2 text-xs">
              @for (hours of wally()?.businessHours; track hours.dayOfWeek) {
                <div class="flex items-center justify-between text-slate-600 py-1 border-b border-slate-50 last:border-0">
                  <span class="font-semibold text-slate-800">{{ hours.dayName }}</span>
                  <span class="font-mono text-emerald-600 font-medium">{{ hours.openTime }} - {{ hours.closeTime }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class WallyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private wallyRepo = inject(WALLY_REPOSITORY_TOKEN);
  private courtRepo = inject(COURT_REPOSITORY_TOKEN);
  private reservationRepo = inject(RESERVATION_REPOSITORY_TOKEN);

  wally = signal<Wally | null>(null);
  courts = signal<Court[]>([]);
  selectedCourt = signal<Court | null>(null);
  timeSlots = signal<TimeSlot[]>([]);
  isLoading = signal<boolean>(true);
  selectedDate = '2026-09-27';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.wallyRepo.findBySlug(slug).subscribe(w => {
          this.wally.set(w);
          if (w) {
            this.courtRepo.findByWallyId(w.id).subscribe(cList => {
              this.courts.set(cList);
              if (cList.length > 0) {
                this.selectCourt(cList[0]);
              }
              this.isLoading.set(false);
            });
          } else {
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  selectCourt(court: Court): void {
    this.selectedCourt.set(court);
    this.loadAvailability();
  }

  loadAvailability(): void {
    const court = this.selectedCourt();
    if (court) {
      this.reservationRepo.getAvailability(court.id, this.selectedDate).subscribe(slots => {
        this.timeSlots.set(slots);
      });
    }
  }
}
