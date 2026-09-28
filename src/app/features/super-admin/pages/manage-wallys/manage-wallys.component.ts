import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WALLY_REPOSITORY_TOKEN } from '../../../../shared/repositories/tokens';
import { Wally } from '../../../../shared/models/wally.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-manage-wallys',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">SuperAdmin Panel</span>
          <h1 class="text-2xl font-black text-slate-900">Gestión de Wallys (Complejos)</h1>
          <p class="text-xs text-slate-500">Registra y administra los complejos deportivos habilitados en la plataforma</p>
        </div>
        <button (click)="openCreateModal()" class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2">
          <i class="pi pi-plus"></i> Registrar Nuevo Wally
        </button>
      </div>

      <!-- Wallys Data Table -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-bold text-slate-900 text-base">Complejos Registrados</h3>
          <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            {{ wallys().length }} Complejos Total
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th class="p-4">Complejo</th>
                <th class="p-4">Slug URL</th>
                <th class="p-4">Ciudad / Dirección</th>
                <th class="p-4">WhatsApp</th>
                <th class="p-4">Estado</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (wally of wallys(); track wally.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="p-4 font-bold text-slate-900 flex items-center gap-3">
                    <img [src]="wally.logoUrl || defaultLogo" [alt]="wally.name" class="w-9 h-9 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                    <div>
                      <div class="font-bold text-slate-900">{{ wally.name }}</div>
                      <div class="text-[11px] text-slate-400 font-normal line-clamp-1">{{ wally.description }}</div>
                    </div>
                  </td>
                  <td class="p-4 font-mono text-emerald-600 font-semibold">/wally/{{ wally.slug }}</td>
                  <td class="p-4">
                    <span class="font-semibold text-slate-800">{{ wally.contact.city }}</span>
                    <span class="text-slate-400 block text-[11px]">{{ wally.contact.address }}</span>
                  </td>
                  <td class="p-4 font-mono">{{ wally.contact.whatsapp }}</td>
                  <td class="p-4">
                    <app-status-badge [status]="wally.isActive ? 'ACTIVE' : 'INACTIVE'" [label]="wally.isActive ? 'Activo' : 'Inactivo'"></app-status-badge>
                  </td>
                  <td class="p-4 text-right space-x-2">
                    <a [routerLink]="['/wally', wally.slug]" target="_blank" class="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium inline-block" title="Ver sitio público">
                      <i class="pi pi-external-link"></i>
                    </a>
                    <button (click)="toggleWallyStatus(wally)" class="p-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium inline-block" title="Cambiar Estado">
                      <i class="pi pi-sync"></i>
                    </button>
                    <button (click)="deleteWally(wally.id)" class="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium inline-block" title="Eliminar Wally">
                      <i class="pi pi-trash"></i>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL FORMULARIO PARA REGISTRAR NUEVO WALLY -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" (click)="closeModal()"></div>

          <!-- Modal Window -->
          <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[90vh] flex flex-col">
            <!-- Modal Header -->
            <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm">W</div>
                <h3 class="font-bold text-lg text-white">Registrar Nuevo Wally (Complejo)</h3>
              </div>
              <button (click)="closeModal()" class="text-slate-400 hover:text-white p-1 rounded-lg">
                <i class="pi pi-times text-lg"></i>
              </button>
            </div>

            <!-- Modal Form Body -->
            <form (ngSubmit)="submitWally()" #wallyFormRef="ngForm" class="p-6 overflow-y-auto space-y-4 flex-1">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-bold text-slate-700 mb-1 block">Nombre del Complejo *</label>
                  <input type="text" [(ngModel)]="form.name" (input)="generateSlug()" name="name" required placeholder="ej. Olimpo Sport Club" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 mb-1 block">Slug URL Único *</label>
                  <input type="text" [(ngModel)]="form.slug" name="slug" required placeholder="ej. olimpo-sport" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-emerald-600 outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div>
                <label class="text-xs font-bold text-slate-700 mb-1 block">Descripción Institucional</label>
                <textarea rows="2" [(ngModel)]="form.description" name="description" placeholder="Descripción breve de las instalaciones y deportes ofertados..." class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-emerald-500"></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-bold text-slate-700 mb-1 block">Ciudad *</label>
                  <input type="text" [(ngModel)]="form.city" name="city" required placeholder="ej. Santa Cruz" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 mb-1 block">Dirección Exacta</label>
                  <input type="text" [(ngModel)]="form.address" name="address" placeholder="ej. Av. Banzer 4to Anillo" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="text-xs font-bold text-slate-700 mb-1 block">Teléfono</label>
                  <input type="text" [(ngModel)]="form.phone" name="phone" placeholder="+591 70000000" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 mb-1 block">WhatsApp (ej. 59170000000) *</label>
                  <input type="text" [(ngModel)]="form.whatsapp" name="whatsapp" required placeholder="59170000000" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 mb-1 block">Email de Contacto</label>
                  <input type="email" [(ngModel)]="form.email" name="email" placeholder="contacto@olimpo.com" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-bold text-slate-700 mb-1 block">URL de Logo (Opcional)</label>
                  <input type="text" [(ngModel)]="form.logoUrl" name="logoUrl" placeholder="https://..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 mb-1 block">URL de Portada (Opcional)</label>
                  <input type="text" [(ngModel)]="form.coverUrl" name="coverUrl" placeholder="https://..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500" />
                </div>
              </div>

              <!-- Modal Footer Actions -->
              <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button type="button" (click)="closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
                  Cancelar
                </button>
                <button type="submit" [disabled]="!wallyFormRef.form.valid || isSubmitting()" class="px-5 py-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2">
                  @if (isSubmitting()) {
                    <i class="pi pi-spin pi-spinner"></i> Registrando...
                  } @else {
                    <i class="pi pi-check"></i> Registrar Wally
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class ManageWallysComponent implements OnInit {
  private wallyRepo = inject(WALLY_REPOSITORY_TOKEN);

  wallys = signal<Wally[]>([]);
  showModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  defaultLogo = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=200&q=80';
  defaultCover = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80';

  form = {
    name: '',
    slug: '',
    description: '',
    city: 'Santa Cruz',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    logoUrl: '',
    coverUrl: ''
  };

  ngOnInit(): void {
    this.loadWallys();
  }

  loadWallys(): void {
    this.wallyRepo.findAll().subscribe(data => this.wallys.set(data));
  }

  openCreateModal(): void {
    this.resetForm();
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  resetForm(): void {
    this.form = {
      name: '',
      slug: '',
      description: '',
      city: 'Santa Cruz',
      address: '',
      phone: '',
      whatsapp: '',
      email: '',
      logoUrl: '',
      coverUrl: ''
    };
  }

  generateSlug(): void {
    this.form.slug = this.form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  submitWally(): void {
    if (!this.form.name || !this.form.slug) return;

    this.isSubmitting.set(true);

    const newWally: Omit<Wally, 'id'> = {
      name: this.form.name,
      slug: this.form.slug,
      description: this.form.description || 'Nuevo complejo deportivo registrado en la plataforma.',
      logoUrl: this.form.logoUrl || this.defaultLogo,
      coverUrl: this.form.coverUrl || this.defaultCover,
      isActive: true,
      contact: {
        phone: this.form.phone || '+591 70000000',
        whatsapp: this.form.whatsapp || '59170000000',
        email: this.form.email || `contacto@${this.form.slug}.com`,
        address: this.form.address || 'Av. Principal',
        city: this.form.city || 'Santa Cruz'
      },
      social: [
        { platform: 'instagram', url: `https://instagram.com/${this.form.slug}` }
      ],
      businessHours: [
        { dayOfWeek: 1, dayName: 'Lunes', openTime: '08:00', closeTime: '23:00', isOpen: true },
        { dayOfWeek: 2, dayName: 'Martes', openTime: '08:00', closeTime: '23:00', isOpen: true },
        { dayOfWeek: 3, dayName: 'Miércoles', openTime: '08:00', closeTime: '23:00', isOpen: true },
        { dayOfWeek: 4, dayName: 'Jueves', openTime: '08:00', closeTime: '23:00', isOpen: true },
        { dayOfWeek: 5, dayName: 'Viernes', openTime: '08:00', closeTime: '23:59', isOpen: true },
        { dayOfWeek: 6, dayName: 'Sábado', openTime: '08:00', closeTime: '23:59', isOpen: true },
        { dayOfWeek: 0, dayName: 'Domingo', openTime: '08:00', closeTime: '22:00', isOpen: true }
      ],
      settings: {
        currencySymbol: 'Bs.',
        slotDurationMinutes: 60,
        allowOnlineBooking: true,
        requireDeposit: true,
        depositPercentage: 50
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.wallyRepo.create(newWally).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadWallys();
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Ocurrió un error al registrar el Wally.');
      }
    });
  }

  toggleWallyStatus(wally: Wally): void {
    this.wallyRepo.update(wally.id, { isActive: !wally.isActive }).subscribe(() => this.loadWallys());
  }

  deleteWally(id: string): void {
    if (confirm('¿Estás seguro de eliminar este complejo de la plataforma?')) {
      this.wallyRepo.delete(id).subscribe(() => this.loadWallys());
    }
  }
}
