import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentWallyContextService } from '../../../../core/tenant/current-wally-context.service';
import { CLIENT_REPOSITORY_TOKEN } from '../../../../shared/repositories/tokens';
import { Client } from '../../../../shared/models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Directorio de Clientes</h1>
          <p class="text-xs text-slate-500">Clientes registrados en {{ tenantContext.currentWally()?.name }}</p>
        </div>
        <button (click)="addClient()" class="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs">
          + Registrar Cliente
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table class="w-full text-left text-xs text-slate-600">
          <thead class="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th class="p-4">Nombre Completo</th>
              <th class="p-4">Teléfono</th>
              <th class="p-4">Email</th>
              <th class="p-4">Reservas Realizadas</th>
              <th class="p-4">Notas</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (c of clients(); track c.id) {
              <tr class="hover:bg-slate-50">
                <td class="p-4 font-bold text-slate-900">{{ c.fullName }}</td>
                <td class="p-4 font-mono">{{ c.phone }}</td>
                <td class="p-4">{{ c.email || 'N/A' }}</td>
                <td class="p-4 font-bold text-emerald-600">{{ c.totalReservations }}</td>
                <td class="p-4 text-slate-500">{{ c.notes }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ClientListComponent implements OnInit {
  tenantContext = inject(CurrentWallyContextService);
  private clientRepo = inject(CLIENT_REPOSITORY_TOKEN);

  clients = signal<Client[]>([]);

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    const wId = this.tenantContext.currentWallyId();
    if (wId) {
      this.clientRepo.findByWallyId(wId).subscribe(list => this.clients.set(list));
    }
  }

  addClient(): void {
    const name = prompt('Nombre completo del cliente:');
    if (name) {
      this.clientRepo.create({
        wallyId: this.tenantContext.currentWallyId()!,
        fullName: name,
        phone: '+591 70000000',
        email: 'nuevo.cliente@gmail.com',
        notes: 'Cliente registrado desde panel',
        totalReservations: 1,
        isBlocked: false,
        createdAt: new Date().toISOString()
      }).subscribe(() => this.loadClients());
    }
  }
}
