import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="badgeClasses()" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="dotClass()"></span>
      {{ label() }}
    </span>
  `
})
export class StatusBadgeComponent {
  status = input.required<string>();
  label = input.required<string>();

  badgeClasses(): string {
    switch (this.status().toUpperCase()) {
      case 'CONFIRMED':
      case 'ACTIVE':
      case 'AVAILABLE':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border border-amber-300';
      case 'CANCELLED':
      case 'INACTIVE':
      case 'RESERVED':
        return 'bg-rose-100 text-rose-800 border border-rose-300';
      case 'MAINTENANCE':
      case 'BLOCKED':
        return 'bg-slate-200 text-slate-700 border border-slate-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  dotClass(): string {
    switch (this.status().toUpperCase()) {
      case 'CONFIRMED':
      case 'ACTIVE':
      case 'AVAILABLE':
        return 'bg-emerald-500 animate-pulse';
      case 'PENDING':
        return 'bg-amber-500';
      case 'CANCELLED':
      case 'INACTIVE':
      case 'RESERVED':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  }
}
