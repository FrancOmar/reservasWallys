export type RoleType = 'SUPER_ADMIN' | 'ADMIN' | 'CLIENT';

export type Permission = 
  | 'wally:create' | 'wally:read' | 'wally:update' | 'wally:delete'
  | 'court:create' | 'court:read' | 'court:update' | 'court:delete'
  | 'reservation:create' | 'reservation:read' | 'reservation:update' | 'reservation:cancel'
  | 'client:manage' | 'cms:manage' | 'media:manage' | 'user:manage' | 'reports:view';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: RoleType;
  assignedWallyIds: string[];
  isActive: boolean;
  createdAt: string;
}
