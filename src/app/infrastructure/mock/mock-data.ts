import { Wally } from '../../shared/models/wally.model';
import { Court } from '../../shared/models/court.model';
import { Reservation } from '../../shared/models/reservation.model';
import { Client } from '../../shared/models/client.model';
import { User } from '../../shared/models/user.model';

export const MOCK_USERS: User[] = [
  {
    id: 'user-superadmin',
    email: 'admin@wallys.com',
    fullName: 'Carlos SuperAdmin',
    phone: '+591 70000000',
    role: 'SUPER_ADMIN',
    assignedWallyIds: [],
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-admin-1',
    email: 'arena@wallys.com',
    fullName: 'Roberto Gómez (Arena Sport)',
    phone: '+591 71111111',
    role: 'ADMIN',
    assignedWallyIds: ['wally-arena-sport', 'wally-padel-center'],
    isActive: true,
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'user-admin-2',
    email: 'futbol@wallys.com',
    fullName: 'Mariana Silva (Fútbol Center)',
    phone: '+591 72222222',
    role: 'ADMIN',
    assignedWallyIds: ['wally-futbol-center'],
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z'
  }
];

export const MOCK_WALLYS: Wally[] = [
  {
    id: 'wally-arena-sport',
    slug: 'arena-sport',
    name: 'Arena Sport Complex',
    description: 'El complejo deportivo más moderno de la ciudad. Canchas sintéticas de nivel profesional, iluminación LED y vestuarios de primer nivel.',
    logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    contact: {
      phone: '+591 71111111',
      whatsapp: '59171111111',
      email: 'contacto@arenasport.com',
      address: 'Av. Las Palmas #450, Zona Norte',
      city: 'Santa Cruz'
    },
    social: [
      { platform: 'instagram', url: 'https://instagram.com/arenasport' },
      { platform: 'facebook', url: 'https://facebook.com/arenasport' }
    ],
    businessHours: [
      { dayOfWeek: 1, dayName: 'Lunes', openTime: '07:00', closeTime: '23:30', isOpen: true },
      { dayOfWeek: 2, dayName: 'Martes', openTime: '07:00', closeTime: '23:30', isOpen: true },
      { dayOfWeek: 3, dayName: 'Miércoles', openTime: '07:00', closeTime: '23:30', isOpen: true },
      { dayOfWeek: 4, dayName: 'Jueves', openTime: '07:00', closeTime: '23:30', isOpen: true },
      { dayOfWeek: 5, dayName: 'Viernes', openTime: '07:00', closeTime: '00:00', isOpen: true },
      { dayOfWeek: 6, dayName: 'Sábado', openTime: '07:00', closeTime: '00:00', isOpen: true },
      { dayOfWeek: 0, dayName: 'Domingo', openTime: '08:00', closeTime: '22:00', isOpen: true }
    ],
    settings: {
      currencySymbol: 'Bs.',
      slotDurationMinutes: 60,
      allowOnlineBooking: true,
      requireDeposit: true,
      depositPercentage: 50
    },
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z'
  },
  {
    id: 'wally-futbol-center',
    slug: 'futbol-center',
    name: 'Fútbol Center Club',
    description: 'Canchas sintéticas de fútbol 5, 7 y 11. Parrilleros, churrasqueras y parqueo privado.',
    logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    contact: {
      phone: '+591 72222222',
      whatsapp: '59172222222',
      email: 'info@futbolcenter.com',
      address: 'Calle Los Pinos #120, Equipetrol',
      city: 'Santa Cruz'
    },
    social: [
      { platform: 'instagram', url: 'https://instagram.com/futbolcenter' }
    ],
    businessHours: [
      { dayOfWeek: 1, dayName: 'Lunes', openTime: '08:00', closeTime: '23:00', isOpen: true },
      { dayOfWeek: 2, dayName: 'Martes', openTime: '08:00', closeTime: '23:00', isOpen: true },
      { dayOfWeek: 3, dayName: 'Miércoles', openTime: '08:00', closeTime: '23:00', isOpen: true },
      { dayOfWeek: 4, dayName: 'Jueves', openTime: '08:00', closeTime: '23:00', isOpen: true },
      { dayOfWeek: 5, dayName: 'Viernes', openTime: '08:00', closeTime: '23:59', isOpen: true },
      { dayOfWeek: 6, dayName: 'Sábado', openTime: '08:00', closeTime: '23:59', isOpen: true },
      { dayOfWeek: 0, dayName: 'Domingo', openTime: '08:00', closeTime: '22:00', isOpen: true }
    ],
    settings: {
      currencySymbol: 'Bs.',
      slotDurationMinutes: 60,
      allowOnlineBooking: true,
      requireDeposit: false
    },
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-03-05T00:00:00.000Z'
  },
  {
    id: 'wally-padel-center',
    slug: 'padel-center-pro',
    name: 'Padel Center Pro',
    description: 'El primer centro techado de Pádel con pistas panorámicas de cristal y piso oficial WPT.',
    logoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    contact: {
      phone: '+591 73333333',
      whatsapp: '59173333333',
      email: 'reservas@padelpro.com',
      address: '3er Anillo Interno #88, Zona Sur',
      city: 'Santa Cruz'
    },
    social: [
      { platform: 'instagram', url: 'https://instagram.com/padelcenterpro' },
      { platform: 'tiktok', url: 'https://tiktok.com/@padelcenterpro' }
    ],
    businessHours: [
      { dayOfWeek: 1, dayName: 'Lunes', openTime: '06:00', closeTime: '23:00', isOpen: true },
      { dayOfWeek: 2, dayName: 'Martes', openTime: '06:00', closeTime: '23:00', isOpen: true },
      { dayOfWeek: 3, dayName: 'Miércoles', openTime: '06:00', closeTime: '23:00', isOpen: true },
      { dayOfWeek: 4, dayName: 'Jueves', openTime: '06:00', closeTime: '23:00', isOpen: true },
      { dayOfWeek: 5, dayName: 'Viernes', openTime: '06:00', closeTime: '23:00', isOpen: true },
      { dayOfWeek: 6, dayName: 'Sábado', openTime: '07:00', closeTime: '22:00', isOpen: true },
      { dayOfWeek: 0, dayName: 'Domingo', openTime: '07:00', closeTime: '21:00', isOpen: true }
    ],
    settings: {
      currencySymbol: 'Bs.',
      slotDurationMinutes: 90,
      allowOnlineBooking: true,
      requireDeposit: true,
      depositPercentage: 50
    },
    createdAt: '2026-02-15T00:00:00.000Z',
    updatedAt: '2026-03-10T00:00:00.000Z'
  }
];

export const MOCK_COURTS: Court[] = [
  // Canchas de Arena Sport
  {
    id: 'court-arena-1',
    wallyId: 'wally-arena-sport',
    name: 'Cancha 1 (Fútbol 5)',
    description: 'Césped sintético FIFA Quality de 50mm, iluminación LED 500 Lux',
    sport: 'FUTBOL_5',
    surfaceType: 'Sintético 50mm',
    isCovered: true,
    status: 'ACTIVE',
    hourlyRate: 150,
    colorHex: '#10B981',
    mediaUrls: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'],
    features: ['Techo curvo', 'Iluminación LED', 'Vestuario VIP', 'Tablero Digital']
  },
  {
    id: 'court-arena-2',
    wallyId: 'wally-arena-sport',
    name: 'Cancha 2 (Fútbol 7)',
    description: 'Cancha amplia para fútbol 7 o dos canchas transversales',
    sport: 'FUTBOL_7',
    surfaceType: 'Sintético 60mm Monofilamento',
    isCovered: false,
    status: 'ACTIVE',
    hourlyRate: 220,
    colorHex: '#3B82F6',
    mediaUrls: ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80'],
    features: ['Al aire libre', 'Gradas para 100 espectadores', 'Balón oficial incluido']
  },
  {
    id: 'court-arena-3',
    wallyId: 'wally-arena-sport',
    name: 'Pista Padel 1',
    description: 'Pista panorámica de cristal templado 12mm',
    sport: 'PADEL',
    surfaceType: 'Moqueta Azul oficial',
    isCovered: true,
    status: 'ACTIVE',
    hourlyRate: 180,
    colorHex: '#8B5CF6',
    mediaUrls: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80'],
    features: ['Panorámica', 'Climatizada', 'Alquiler de palas']
  },
  // Canchas de Fútbol Center
  {
    id: 'court-futbol-1',
    wallyId: 'wally-futbol-center',
    name: 'Maracaná (Fútbol 5)',
    description: 'Cancha sintética techada con césped de alta densidad',
    sport: 'FUTBOL_5',
    surfaceType: 'Sintético 45mm',
    isCovered: true,
    status: 'ACTIVE',
    hourlyRate: 130,
    colorHex: '#059669',
    mediaUrls: ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80'],
    features: ['Techada', 'Malla protectora', 'Parrillero cercano']
  },
  {
    id: 'court-futbol-2',
    wallyId: 'wally-futbol-center',
    name: 'Camp Nou (Fútbol 7)',
    description: 'Cancha al aire libre con excelente drenaje pluvial',
    sport: 'FUTBOL_7',
    surfaceType: 'Sintético 50mm',
    isCovered: false,
    status: 'MAINTENANCE',
    hourlyRate: 200,
    colorHex: '#F59E0B',
    mediaUrls: ['https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80'],
    features: ['Al aire libre', 'Iluminación halógena', 'Refresquería']
  },
  // Canchas de Padel Center Pro
  {
    id: 'court-padel-1',
    wallyId: 'wally-padel-center',
    name: 'Pista Central WPT',
    description: 'Pista con gradas laterales y salida por tres',
    sport: 'PADEL',
    surfaceType: 'Césped Rizado Mondo Supercourt',
    isCovered: true,
    status: 'ACTIVE',
    hourlyRate: 200,
    colorHex: '#EC4899',
    mediaUrls: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80'],
    features: ['Oficial WPT', 'Grabación HD de partido', 'Cámara lenta']
  }
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'client-1',
    wallyId: 'wally-arena-sport',
    fullName: 'Juan Pérez Vaca',
    phone: '+591 78912345',
    email: 'juan.perez@gmail.com',
    notes: 'Cliente frecuente los martes por la noche',
    totalReservations: 12,
    isBlocked: false,
    createdAt: '2026-01-20T00:00:00.000Z'
  },
  {
    id: 'client-2',
    wallyId: 'wally-arena-sport',
    fullName: 'Andrés Suárez',
    phone: '+591 76543210',
    email: 'andres.suarez@hotmail.com',
    notes: 'Paga siempre por QR anticipado',
    totalReservations: 5,
    isBlocked: false,
    createdAt: '2026-02-05T00:00:00.000Z'
  },
  {
    id: 'client-3',
    wallyId: 'wally-futbol-center',
    fullName: 'Equipo Los Galácticos',
    phone: '+591 75554433',
    email: 'galacticos@fc.com',
    notes: 'Reservas para torneo interempresas',
    totalReservations: 8,
    isBlocked: false,
    createdAt: '2026-02-10T00:00:00.000Z'
  }
];

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    wallyId: 'wally-arena-sport',
    courtId: 'court-arena-1',
    clientId: 'client-1',
    clientName: 'Juan Pérez Vaca',
    clientPhone: '+591 78912345',
    date: '2026-09-27',
    startTime: '19:00',
    endTime: '20:00',
    totalPrice: 150,
    depositAmount: 75,
    status: 'CONFIRMED',
    notes: 'Partido entre amigos',
    createdByUserId: 'user-admin-1',
    createdAt: '2026-09-25T14:30:00.000Z'
  },
  {
    id: 'res-102',
    wallyId: 'wally-arena-sport',
    courtId: 'court-arena-1',
    clientId: 'client-2',
    clientName: 'Andrés Suárez',
    clientPhone: '+591 76543210',
    date: '2026-09-27',
    startTime: '20:00',
    endTime: '21:00',
    totalPrice: 150,
    depositAmount: 150,
    status: 'CONFIRMED',
    notes: 'Pago total completado',
    createdByUserId: 'user-admin-1',
    createdAt: '2026-09-26T10:00:00.000Z'
  },
  {
    id: 'res-103',
    wallyId: 'wally-arena-sport',
    courtId: 'court-arena-3',
    clientId: 'client-2',
    clientName: 'Andrés Suárez',
    clientPhone: '+591 76543210',
    date: '2026-09-27',
    startTime: '18:00',
    endTime: '19:30',
    totalPrice: 270,
    depositAmount: 135,
    status: 'PENDING',
    notes: 'Pendiente de envío de comprobante',
    createdByUserId: 'user-admin-1',
    createdAt: '2026-09-27T09:15:00.000Z'
  },
  {
    id: 'res-104',
    wallyId: 'wally-futbol-center',
    courtId: 'court-futbol-1',
    clientId: 'client-3',
    clientName: 'Equipo Los Galácticos',
    clientPhone: '+591 75554433',
    date: '2026-09-27',
    startTime: '21:00',
    endTime: '22:00',
    totalPrice: 130,
    depositAmount: 65,
    status: 'CONFIRMED',
    notes: 'Reserva confirmada',
    createdByUserId: 'user-admin-2',
    createdAt: '2026-09-26T18:20:00.000Z'
  }
];
