import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { RoleType } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-300 flex items-center justify-center text-slate-950 font-black text-3xl mx-auto mb-3 shadow-lg shadow-emerald-500/20">
            W
          </div>
          <h2 class="text-2xl font-black text-white">SISTEMA WALLY</h2>
          <p class="text-xs text-slate-400 mt-1">Acceso a la Plataforma de Administración</p>
        </div>

        <div class="space-y-4 mb-6">
          <label class="text-xs font-bold text-slate-300 uppercase tracking-wider block">Seleccionar Perfil de Demostración:</label>

          <button (click)="loginAs('SUPER_ADMIN')" class="w-full p-4 rounded-xl border border-slate-700 bg-slate-800 hover:border-emerald-500 hover:bg-slate-700/80 text-left transition-all group flex items-center justify-between">
            <div>
              <h4 class="font-bold text-white text-sm group-hover:text-emerald-400">SuperAdministrador Global</h4>
              <p class="text-xs text-slate-400">Acceso a todos los Wallys, métricas globales y configuración SaaS</p>
            </div>
            <i class="pi pi-shield text-emerald-400 text-xl"></i>
          </button>

          <button (click)="loginAs('ADMIN')" class="w-full p-4 rounded-xl border border-slate-700 bg-slate-800 hover:border-emerald-500 hover:bg-slate-700/80 text-left transition-all group flex items-center justify-between">
            <div>
              <h4 class="font-bold text-white text-sm group-hover:text-emerald-400">Administrador de Complejo (CMS)</h4>
              <p class="text-xs text-slate-400">Gestión de canchas, agenda, tarifas y clientes de Arena Sport</p>
            </div>
            <i class="pi pi-home text-emerald-400 text-xl"></i>
          </button>
        </div>

        <div class="text-center pt-4 border-t border-slate-800">
          <a routerLink="/wallys" class="text-xs font-semibold text-emerald-400 hover:underline">← Volver al Portal Público de Reservas</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginAs(role: RoleType): void {
    const email = role === 'SUPER_ADMIN' ? 'admin@wallys.com' : 'arena@wallys.com';
    this.authService.login(email, role).subscribe(() => {
      if (role === 'SUPER_ADMIN') {
        this.router.navigate(['/super-admin/dashboard']);
      } else {
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }
}
