export interface Client {
  id: string;
  wallyId: string;
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
  totalReservations: number;
  isBlocked: boolean;
  createdAt: string;
}
