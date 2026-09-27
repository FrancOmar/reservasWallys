export interface ContactInformation {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  coordinates?: { lat: number; lng: number };
}

export interface SocialNetwork {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'x' | 'youtube';
  url: string;
}

export interface BusinessHours {
  dayOfWeek: number; // 0 = Domingo, 1 = Lunes, etc.
  dayName: string;
  openTime: string;  // "08:00"
  closeTime: string; // "23:00"
  isOpen: boolean;
}

export interface WallySettings {
  currencySymbol: string;
  slotDurationMinutes: number; // 60, 90, 120
  allowOnlineBooking: boolean;
  requireDeposit: boolean;
  depositPercentage?: number;
}

export interface Wally {
  id: string;
  slug: string;
  name: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
  isActive: boolean;
  contact: ContactInformation;
  social: SocialNetwork[];
  businessHours: BusinessHours[];
  settings: WallySettings;
  createdAt: string;
  updatedAt: string;
}
