import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrentWallyContextService } from '../../../../core/tenant/current-wally-context.service';
import { COURT_REPOSITORY_TOKEN, RESERVATION_REPOSITORY_TOKEN } from '../../../../shared/repositories/tokens';
import { Court } from '../../../../shared/models/court.model';
import { TimeSlot } from '../../../../shared/models/reservation.model';

@Component({
  selector: 'app-agenda-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Agenda & Horarios Visuales</h1>
          <p class="text-xs text-slate-500">Planificador de reservas por cancha y fecha</p>
        </div>
        <div class="flex items-center gap-3">
          <input type="date" [(ngModel)]="selectedDate" (change)="loadSlots()" class="bg-white border border-slate-200 text-xs font-bold text-slate-900 px-3 py-2 rounded-xl outline-none shadow-xs" />
        </div>
      </div>

      <!-- Courts Switcher Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2">
        @for (court of courts(); track court.id) {
          <button (click)="selectCourt(court)" [ngClass]="selectedCourt()?.id === court.id ? 'bg-slate-900 text-white font-bold' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'" class="px-4 py-2 rounded-xl text-xs transition-all shrink-0">
            {{ court.name }}
          </button>
        }
      </div>

      <!-- Time Slots Grid -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 class="font-bold text-slate-900 text-sm mb-4 flex items-center justify-between">
          <span>Horarios para {{ selectedDate }} - {{ selectedCourt()?.name }}</span>
          <span class="text-xs font-normal text-slate-500">Haz clic en un horario libre para registrar reserva</span>
        </h3>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          @for (slot of slots(); track slot.startTime) {
            <div (click)="onSlotClick(slot)" [ngClass]="slot.isAvailable ? 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-800 opacity-80'" class="p-3 rounded-xl border text-center cursor-pointer transition-all">
              <div class="text-sm font-extrabold">{{ slot.startTime }} - {{ slot.endTime }}</div>
              <div class="text-[11px] font-semibold mt-1">
                {{ slot.isAvailable ? 'DISPONIBLE (Bs. ' + slot.price + ')' : 'RESERVADO' }}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class AgendaViewComponent implements OnInit {
  tenantContext = inject(CurrentWallyContextService);
  private courtRepo = inject(COURT_REPOSITORY_TOKEN);
  private reservationRepo = inject(RESERVATION_REPOSITORY_TOKEN);

  courts = signal<Court[]>([]);
  selectedCourt = signal<Court | null>(null);
  slots = signal<TimeSlot[]>([]);
  selectedDate = '2026-09-27';

  ngOnInit(): void {
    const wId = this.tenantContext.currentWallyId();
    if (wId) {
      this.courtRepo.findByWallyId(wId).subscribe(list => {
        this.courts.set(list);
        if (list.length > 0) {
          this.selectCourt(list[0]);
        }
      });
    }
  }

  selectCourt(c: Court): void {
    this.selectedCourt.set(c);
    this.loadSlots();
  }

  loadSlots(): void {
    const court = this.selectedCourt();
    if (court) {
      this.reservationRepo.getAvailability(court.id, this.selectedDate).subscribe(s => this.slots.set(s));
    }
  }

  onSlotClick(slot: TimeSlot): void {
    if (slot.isAvailable) {
      const clientName = prompt(`Registrar reserva a las ${slot.startTime} para:`);
      if (clientName) {
        this.reservationRepo.create({
          wallyId: this.tenantContext.currentWallyId()!,
          courtId: slot.courtId,
          clientId: 'client-1',
          clientName,
          clientPhone: '+591 70000000',
          date: this.selectedDate,
          startTime: slot.startTime,
          endTime: slot.endTime,
          totalPrice: slot.price,
          depositAmount: slot.price / 2,
          status: 'CONFIRMED',
          createdByUserId: 'user-admin-1',
          createdAt: new Date().toISOString()
        }).subscribe(() => this.loadSlots());
      }
    }
  }
}
