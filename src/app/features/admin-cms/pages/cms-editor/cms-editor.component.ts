import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrentWallyContextService } from '../../../../core/tenant/current-wally-context.service';
import { WALLY_REPOSITORY_TOKEN } from '../../../../shared/repositories/tokens';
import { Wally } from '../../../../shared/models/wally.model';

@Component({
  selector: 'app-cms-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Personalizar CMS Deportivo</h1>
          <p class="text-xs text-slate-500">Edita la información pública, imágenes y contacto de tu Wally</p>
        </div>
        <button (click)="saveChanges()" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all">
          Guardar Cambios
        </button>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <h3 class="font-bold text-slate-900 text-base border-b pb-3">Información Institucional</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-bold text-slate-700 mb-1 block">Nombre del Complejo</label>
            <input type="text" [(ngModel)]="wallyForm.name" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-700 mb-1 block">Slug URL Pública</label>
            <input type="text" [(ngModel)]="wallyForm.slug" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-emerald-600 outline-none focus:border-emerald-500" />
          </div>
        </div>

        <div>
          <label class="text-xs font-bold text-slate-700 mb-1 block">Descripción Pública</label>
          <textarea rows="3" [(ngModel)]="wallyForm.description" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-emerald-500"></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-bold text-slate-700 mb-1 block">URL de Logo Avatar</label>
            <input type="text" [(ngModel)]="wallyForm.logoUrl" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-700 mb-1 block">URL de Imagen de Portada</label>
            <input type="text" [(ngModel)]="wallyForm.coverUrl" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500" />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5" *ngIf="wallyForm.contact">
        <h3 class="font-bold text-slate-900 text-base border-b pb-3">Ubicación y Contacto</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-bold text-slate-700 mb-1 block">Teléfono</label>
            <input type="text" [(ngModel)]="wallyForm.contact.phone" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none" />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-700 mb-1 block">WhatsApp (ej. 59170000000)</label>
            <input type="text" [(ngModel)]="wallyForm.contact.whatsapp" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none" />
          </div>
        </div>
      </div>
    </div>
  `
})
export class CmsEditorComponent implements OnInit {
  tenantContext = inject(CurrentWallyContextService);
  private wallyRepo = inject(WALLY_REPOSITORY_TOKEN);

  wallyForm: Partial<Wally> = {};

  ngOnInit(): void {
    const w = this.tenantContext.currentWally();
    if (w) {
      this.wallyForm = { ...w };
    }
  }

  saveChanges(): void {
    if (this.wallyForm.id) {
      this.wallyRepo.update(this.wallyForm.id, this.wallyForm).subscribe(() => {
        alert('¡Configuración guardada exitosamente!');
      });
    }
  }
}
