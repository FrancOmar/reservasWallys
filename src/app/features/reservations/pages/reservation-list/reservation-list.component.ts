import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentWallyContextService } from '../../../../core/tenant/current-wally-context.service';
import { RESERVATION_REPOSITORY_TOKEN } from '../../../../shared/repositories/tokens';
import { Reservation } from '../../../../shared/models/reservation.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Listado de Reservas</h1>
          <p class="text-xs text-slate-500">Historial completo de reservas registradas</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th class="p-4">ID</th>
                <th class="p-4">Cliente</th>
                <th class="p-4">Teléfono</th>
                <th class="p-4">Fecha</th>
                <th class="p-4">Horario</th>
                <th class="p-4">Precio Total</th>
                <th class="p-4">Estado</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (res of reservations(); track res.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="p-4 font-mono text-slate-400 text-[11px]">{{ res.id }}</td>
                  <td class="p-4 font-bold text-slate-900">{{ res.clientName }}</td>
                  <td class="p-4 font-mono">{{ res.clientPhone }}</td>
                  <td class="p-4 font-semibold text-slate-800">{{ res.date }}</td>
                  <td class="p-4 font-mono text-emerald-600 font-bold">{{ res.startTime }} - {{ res.endTime }}</td>
                  <td class="p-4 font-bold text-slate-900">Bs. {{ res.totalPrice }}</td>
                  <td class="p-4">
                    <app-status-badge [status]="res.status" [label]="res.status"></app-status-badge>
                  </td>
                  <td class="p-4 text-right">
                    <button (click)="cancelReservation(res.id)" class="text-rose-600 hover:text-rose-800 font-bold text-xs">Cancelar</button>
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
export class ReservationListComponent implements OnInit {
  tenantContext = inject(CurrentWallyContextService);
  private reservationRepo = inject(RESERVATION_REPOSITORY_TOKEN);

  reservations = signal<Reservation[]>([]);

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    const wId = this.tenantContext.currentWallyId();
    if (wId) {
      this.reservationRepo.findByWallyId(wId).subscribe(list => this.reservations.set(list));
    }
  }

  cancelReservation(id: string): void {
    if (confirm('¿Deseas cancelar esta reserva?')) {
      this.reservationRepo.update(id, { status: 'CANCELLED' }).subscribe(() => this.loadReservations());
    }
  }
}
