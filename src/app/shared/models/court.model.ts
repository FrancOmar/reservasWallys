export type CourtStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export type SportType = 'FUTBOL_5' | 'FUTBOL_7' | 'FUTBOL_11' | 'PADEL' | 'TENIS' | 'BASQUET' | 'VOLEY';

export interface Court {
  id: string;
  wallyId: string;
  name: string;
  description: string;
  sport: SportType;
  surfaceType: string;
  isCovered: boolean;
  status: CourtStatus;
  hourlyRate: number;
  colorHex: string;
  mediaUrls: string[];
  features: string[];
}
