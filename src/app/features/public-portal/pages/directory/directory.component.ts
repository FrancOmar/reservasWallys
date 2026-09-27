import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Wally } from '../../../../shared/models/wally.model';
import { WALLY_REPOSITORY_TOKEN } from '../../../../shared/repositories/tokens';
import { WallyCardComponent } from '../../../../shared/components/wally-card/wally-card.component';

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, WallyCardComponent],
  template: `
    <!-- Hero Banner -->
    <div class="relative bg-slate-950 text-white overflow-hidden py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      <div class="absolute inset-0 z-0 opacity-25">
        <img src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1600&q=80" alt="Stadium background" class="w-full h-full object-cover" />
      </div>
      <div class="relative z-10 max-w-5xl mx-auto text-center">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-4">
          <i class="pi pi-bolt"></i> Reserva Tu Cancha en Segundos
        </span>
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
          Encuentra y Reserva los Mejores Complejos Deportivos
        </h1>
        <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">
          Fútbol, Pádel, Tenis y Básquet. Consulta horarios disponibles y realiza tu reserva al instante en Sistema Wally.
        </p>

        <!-- Search Bar Container -->
        <div class="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2">
          <div class="flex-1 flex items-center gap-2 px-3 py-2 text-slate-800">
            <i class="pi pi-search text-emerald-600 text-lg"></i>
            <input type="text" [(ngModel)]="searchQuery" (input)="filterWallys()" placeholder="Buscar por nombre o ciudad..." class="w-full text-sm outline-none bg-transparent placeholder-slate-400 font-medium" />
          </div>
          <button (click)="filterWallys()" class="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md">
            Buscar Complejos
          </button>
        </div>
      </div>
    </div>

    <!-- Directory List Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-black text-slate-900">Complejos Deportivos Disponibles</h2>
          <p class="text-xs text-slate-500">Explora la lista de Wallys públicos registrados</p>
        </div>
        <span class="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">
          {{ filteredWallys().length }} Complejos
        </span>
      </div>

      <!-- Loading Skeleton / Empty State -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
          <div class="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
          <div class="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
        </div>
      } @else if (filteredWallys().length === 0) {
        <div class="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <i class="pi pi-exclamation-circle text-4xl text-slate-300 mb-3 block"></i>
          <h3 class="text-lg font-bold text-slate-800 mb-1">No se encontraron complejos</h3>
          <p class="text-xs text-slate-500">Prueba ajustando los términos de tu búsqueda.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (wally of filteredWallys(); track wally.id) {
            <app-wally-card [wally]="wally"></app-wally-card>
          }
        </div>
      }
    </div>
  `
})
export class DirectoryComponent implements OnInit {
  private wallyRepo = inject(WALLY_REPOSITORY_TOKEN);

  allWallys = signal<Wally[]>([]);
  filteredWallys = signal<Wally[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = '';

  ngOnInit(): void {
    this.wallyRepo.findActiveWallys().subscribe(data => {
      this.allWallys.set(data);
      this.filteredWallys.set(data);
      this.isLoading.set(false);
    });
  }

  filterWallys(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredWallys.set(this.allWallys());
      return;
    }
    const filtered = this.allWallys().filter(w => 
      w.name.toLowerCase().includes(query) ||
      w.contact.city.toLowerCase().includes(query) ||
      w.description.toLowerCase().includes(query)
    );
    this.filteredWallys.set(filtered);
  }
}
