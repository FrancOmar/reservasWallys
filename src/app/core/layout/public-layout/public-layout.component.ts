import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 font-sans">
      <!-- Public Navbar Header -->
      <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <!-- Brand Logo -->
          <a routerLink="/wallys" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-300 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              W
            </div>
            <div>
              <span class="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">WALLY</span>
              <span class="text-[10px] block font-semibold text-emerald-400 uppercase tracking-widest leading-none">Reserva Tu Cancha</span>
            </div>
          </a>

          <!-- Public Nav Links -->
          <nav class="hidden md:flex items-center gap-6">
            <a routerLink="/wallys" routerLinkActive="text-emerald-400 font-bold" class="text-slate-300 hover:text-white text-sm font-medium transition-colors">
              Explorar Canchas
            </a>
            <a routerLink="/wally/arena-sport" class="text-slate-300 hover:text-white text-sm font-medium transition-colors">
              Arena Sport
            </a>
            <a routerLink="/wally/padel-center-pro" class="text-slate-300 hover:text-white text-sm font-medium transition-colors">
              Padel Center
            </a>
          </nav>

          <!-- Admin Login Quick Button -->
          <div class="flex items-center gap-3">
            <a routerLink="/admin/dashboard" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all">
              <i class="pi pi-user text-xs"></i>
              Panel Admin
            </a>
          </div>
        </div>
      </header>

      <!-- Main Public Router Outlet -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <!-- Public Footer -->
      <footer class="bg-slate-950 text-slate-400 py-10 border-t border-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm">W</div>
              <span class="font-bold text-white text-lg">SISTEMA WALLY</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              La plataforma inteligente para administrar complejos deportivos y reservar canchas en tiempo real.
            </p>
          </div>
          <div>
            <h4 class="text-white text-xs font-bold uppercase tracking-wider mb-3">Accesos Rápido</h4>
            <ul class="space-y-2 text-xs">
              <li><a routerLink="/wallys" class="hover:text-emerald-400">Directorio de Complejos</a></li>
              <li><a routerLink="/wally/arena-sport" class="hover:text-emerald-400">Arena Sport Complex</a></li>
              <li><a routerLink="/admin/dashboard" class="hover:text-emerald-400">Acceso a Administradores</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white text-xs font-bold uppercase tracking-wider mb-3">Soporte WALLY</h4>
            <p class="text-xs text-slate-400 mb-2">¿Tienes un complejo deportivo y quieres registrarlo en la plataforma?</p>
            <span class="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <i class="pi pi-whatsapp"></i> +591 70000000
            </span>
          </div>
        </div>
        <div class="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-600">
          © 2026 Sistema Wally — Todos los derechos reservados.
        </div>
      </footer>
    </div>
  `
})
export class PublicLayoutComponent {}
