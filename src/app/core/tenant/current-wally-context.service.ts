import { Injectable, signal, computed, inject } from '@angular/core';
import { Wally } from '../../shared/models/wally.model';
import { WALLY_REPOSITORY_TOKEN } from '../../shared/repositories/tokens';

@Injectable({
  providedIn: 'root'
})
export class CurrentWallyContextService {
  private wallyRepo = inject(WALLY_REPOSITORY_TOKEN);

  readonly currentWallyId = signal<string | null>('wally-arena-sport');
  readonly currentWally = signal<Wally | null>(null);

  readonly isWallySelected = computed(() => !!this.currentWallyId());

  constructor() {
    this.loadWally(this.currentWallyId()!);
  }

  setWally(wallyId: string): void {
    this.currentWallyId.set(wallyId);
    this.loadWally(wallyId);
  }

  private loadWally(wallyId: string): void {
    this.wallyRepo.findById(wallyId).subscribe(wally => {
      if (wally) {
        this.currentWally.set(wally);
      }
    });
  }
}
