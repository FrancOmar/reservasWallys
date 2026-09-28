import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-media-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <label class="text-xs font-bold text-slate-700 block">{{ label() }}</label>
      
      <div class="relative group border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50 hover:bg-emerald-50/40 transition-all cursor-pointer overflow-hidden" (click)="fileInput.click()">
        <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" class="hidden" />

        @if (previewUrl()) {
          <div class="relative h-32 w-full rounded-xl overflow-hidden group">
            <img [src]="previewUrl()" [alt]="label()" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
              <i class="pi pi-refresh"></i> Cambiar Imagen
            </div>
          </div>
        } @else {
          <div class="py-4 flex flex-col items-center justify-center gap-2">
            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
              <i class="pi pi-image"></i>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-800">Haz clic para abrir tu Galería</p>
              <p class="text-[10px] text-slate-400">Archivos JPG, PNG o WEBP</p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class MediaUploaderComponent {
  label = input<string>('Subir Imagen');
  currentUrl = input<string>('');
  imageSelected = output<string>();

  previewUrl = signal<string>('');

  ngOnInit(): void {
    if (this.currentUrl()) {
      this.previewUrl.set(this.currentUrl());
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.previewUrl.set(result);
        this.imageSelected.emit(result);
      };
      reader.readAsDataURL(file);
    }
  }
}
