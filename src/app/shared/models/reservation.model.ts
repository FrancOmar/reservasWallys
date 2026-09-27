export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'BLOCKED';

export interface Reservation {
  id: string;
  wallyId: string;
  courtId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  date: string;       // "YYYY-MM-DD"
  startTime: string;  // "18:00"
  endTime: string;    // "19:00"
  totalPrice: number;
  depositAmount: number;
  status: ReservationStatus;
  notes?: string;
  createdByUserId: string;
  createdAt: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  courtId: string;
  reservationId?: string;
  price: number;
}
