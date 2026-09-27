import { Injectable, signal, computed } from '@angular/core';
import { User, RoleType, Permission } from '../../shared/models/user.model';
import { MOCK_USERS } from '../../infrastructure/mock/mock-data';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly currentUser = signal<User | null>(MOCK_USERS[1]); // Default: Admin Roberto (Arena Sport)
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly currentRole = computed(() => this.currentUser()?.role || null);

  readonly isSuperAdmin = computed(() => this.currentRole() === 'SUPER_ADMIN');
  readonly isAdmin = computed(() => this.currentRole() === 'ADMIN');
  readonly isClient = computed(() => this.currentRole() === 'CLIENT');

  login(email: string, role: RoleType): Observable<User> {
    let found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      found = {
        id: `user-${Date.now()}`,
        email,
        fullName: email.split('@')[0],
        role,
        assignedWallyIds: ['wally-arena-sport'],
        isActive: true,
        createdAt: new Date().toISOString()
      };
    }
    this.currentUser.set(found);
    return of(found).pipe(delay(300));
  }

  logout(): void {
    this.currentUser.set(null);
  }

  switchUserRole(role: RoleType): void {
    const targetUser = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    this.currentUser.set(targetUser);
  }

  hasPermission(permission: Permission): boolean {
    const user = this.currentUser();
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    
    // Matriz de permisos para ADMIN
    if (user.role === 'ADMIN') {
      const adminPermissions: Permission[] = [
        'wally:read', 'wally:update',
        'court:create', 'court:read', 'court:update', 'court:delete',
        'reservation:create', 'reservation:read', 'reservation:update', 'reservation:cancel',
        'client:manage', 'cms:manage', 'media:manage', 'reports:view'
      ];
      return adminPermissions.includes(permission);
    }

    return false;
  }
}
