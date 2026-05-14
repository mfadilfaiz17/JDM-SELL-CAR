export interface Car {
  id: string;
  brand: string;
  famousName: string;
  modelDetail: string;
  year: number;
  engine: string;
  price: number;
  availability: 'Available' | 'Arriving Soon' | 'Reserved';
  image: string | null;
  color: string;
  chassis: string; // Dynamic Chassis/VIN for search
  category: 'Modified' | 'Standard';
  author?: {
    name: string;
    verified: boolean;
  };
  capacity?: number;
  transmission?: 'Manual' | 'Automatic';
  efficiency?: string;
  // Performance stats
  acceleration?: number; // 0-100 (higher = faster)
  handling?: number; // 0-100 (higher = better)
  modPriority?: number; // 0-100 (higher = more popular for mods)
}

export const POPULAR_CARS: Car[] = [
  {
    id: '1',
    brand: 'Nissan',
    famousName: 'Skyline GT-R BNR34',
    modelDetail: 'V-Spec II Nür',
    year: 2002,
    engine: 'RB26DETT 2.6L I6 Twin Turbo',
    price: 150, // $150k USD (Rp 2.4M)
    availability: 'Arriving Soon',
    image: '/cars/skyline-gt-r-bnr34.png',
    color: '#E5E7EB',
    chassis: 'BNR34-400123',
    category: 'Modified',
    author: { name: 'Rebel Automotive', verified: true },
    acceleration: 95,
    handling: 92,
    modPriority: 100
  },
  {
    id: '2',
    brand: 'Toyota',
    famousName: 'Sprinter Trueno AE86',
    modelDetail: 'GT-Apex',
    year: 1986,
    engine: '4A-GE 1.6L I4 16v',
    price: 35, // $35k USD (Rp 570M)
    availability: 'Available',
    image: '/cars/sprinter-trueno-ae86.png',
    color: '#FEE2E2',
    chassis: 'AE86-501283',
    category: 'Standard',
    author: { name: 'Touge Legends', verified: true },
    acceleration: 65,
    handling: 95,
    modPriority: 98
  },
  {
    id: '3',
    brand: 'Mazda',
    famousName: 'RX-7 FD3S',
    modelDetail: 'Spirit R Type A',
    year: 2002,
    engine: '13B-REW Sequential Turbo Rotary',
    price: 65, // $65k USD (Rp 1M)
    availability: 'Reserved',
    image: '/cars/rx-7-fd3s.png',
    color: '#FEF2F2',
    chassis: 'FD3S-602931',
    category: 'Modified',
    author: { name: 'Rotary Works', verified: true },
    acceleration: 88,
    handling: 94,
    modPriority: 95
  },
  {
    id: '8',
    brand: 'Toyota',
    famousName: 'Supra JZA80',
    modelDetail: 'RZ Series',
    year: 1998,
    engine: '2JZ-GTE 3.0L I6 Twin Turbo',
    price: 120, // $120k USD (Rp 1.9M)
    availability: 'Available',
    image: '/cars/supra-jza80.png',
    color: '#FEE2E2',
    chassis: 'JZA80-009122',
    category: 'Standard',
    author: { name: 'Legacy Imports', verified: true },
    acceleration: 92,
    handling: 85,
    modPriority: 100
  }
];

export const COLLECTION_CARS: Car[] = [
  {
    id: '4',
    brand: 'Honda',
    famousName: 'NSX-R',
    modelDetail: 'NA2 Championship White',
    year: 2002,
    engine: 'C32B 3.2L V6 VTEC',
    price: 180, // $180k USD (Rp 2.9M)
    availability: 'Available',
    image: '/cars/nsx-r.png',
    color: '#FFFFFF',
    chassis: 'NA2-100234',
    category: 'Standard',
    capacity: 2,
    transmission: 'Manual',
    efficiency: '3.2L V6',
    acceleration: 90,
    handling: 98,
    modPriority: 75
  },
  {
    id: '5',
    brand: 'Subaru',
    famousName: 'Impreza 22B-STi',
    modelDetail: 'GC8 Limited Edition',
    year: 1998,
    engine: 'EJ22 2.2L F4 Flat-Four Turbo',
    price: 250, // $250k USD (Rp 4M) - rare limited edition
    availability: 'Available',
    image: '/cars/impreza-228-sti.png',
    color: '#DBEAFE',
    chassis: 'GC8-00022B',
    category: 'Modified',
    capacity: 2,
    transmission: 'Manual',
    efficiency: '2.2L Turbo',
    acceleration: 88,
    handling: 93,
    modPriority: 92
  },
  {
    id: '9',
    brand: 'Honda',
    famousName: 'Integra Type R',
    modelDetail: 'DC2 98 Spec',
    year: 1998,
    engine: 'B18C 1.8L I4 DOHC VTEC',
    price: 45, // $45k USD (Rp 730M)
    availability: 'Available',
    image: '/cars/integra-type-r.png',
    color: '#FFFFFF',
    chassis: 'DC2-130948',
    category: 'Standard',
    capacity: 2,
    transmission: 'Manual',
    efficiency: '1.8L VTEC',
    acceleration: 78,
    handling: 96,
    modPriority: 88
  },
  {
    id: '10',
    brand: 'Mitsubishi',
    famousName: 'GTO Twin Turbo',
    modelDetail: 'Z16A MR Version',
    year: 1998,
    engine: '6G72 3.0L V6 Twin Turbo',
    price: 28, // $28k USD (Rp 455M)
    availability: 'Available',
    image: '/cars/gto-twin-turbo.png',
    color: '#F3F4F6',
    chassis: 'Z16A-002394',
    category: 'Standard',
    capacity: 2,
    transmission: 'Manual',
    efficiency: '3.0L V6',
    acceleration: 85,
    handling: 82,
    modPriority: 70
  },
  {
    id: '6',
    brand: 'Mitsubishi',
    famousName: 'Lancer Evolution IX',
    modelDetail: 'CT9A MR Edition',
    year: 2006,
    engine: '4G63T 2.0L I4 MIVEC Turbo',
    price: 55, // $55k USD (Rp 895M)
    availability: 'Available',
    image: '/cars/lancer-evolution-ix.png',
    color: '#F3F4F6',
    chassis: 'CT9A-040123',
    category: 'Modified',
    capacity: 4,
    transmission: 'Manual',
    efficiency: '2.0L Turbo',
    acceleration: 90,
    handling: 94,
    modPriority: 95
  },
  {
    id: '11',
    brand: 'Toyota',
    famousName: 'Chaser Tourer V',
    modelDetail: 'JZX100 VVT-i',
    year: 1999,
    engine: '1JZ-GTE 2.5L I6 VVT-i Turbo',
    price: 32, // $32k USD (Rp 520M)
    availability: 'Available',
    image: '/cars/chaser-tourer-v.png',
    color: '#FFFFFF',
    chassis: 'JZX100-001293',
    category: 'Modified',
    capacity: 4,
    transmission: 'Manual',
    efficiency: '2.5L Turbo',
    acceleration: 82,
    handling: 78,
    modPriority: 90
  },
  {
    id: '12',
    brand: 'Nissan',
    famousName: '300ZX TT',
    modelDetail: 'Z32 Fairlady Z',
    year: 1996,
    engine: 'VG30DETT 3.0L V6 Twin Turbo',
    price: 38, // $38k USD (Rp 618M)
    availability: 'Available',
    image: '/cars/z32-fairlady-z.png',
    color: '#FFFFFF',
    chassis: 'Z32-059231',
    category: 'Standard',
    capacity: 2,
    transmission: 'Manual',
    efficiency: '3.0L Twin Turbo',
    acceleration: 84,
    handling: 86,
    modPriority: 82
  },
  {
    id: '13',
    brand: 'Honda',
    famousName: 'Civic Type R',
    modelDetail: 'EK9 Hatchback',
    year: 1998,
    engine: 'B16B 1.6L I4 DOHC VTEC',
    price: 42, // $42k USD (Rp 683M)
    availability: 'Available',
    image: '/cars/civic-type-r.png',
    color: '#FFFFFF',
    chassis: 'EK9-100234',
    category: 'Modified',
    capacity: 2,
    transmission: 'Manual',
    efficiency: '1.6L VTEC',
    acceleration: 75,
    handling: 92,
    modPriority: 94
  },
  {
    id: '14',
    brand: 'Mazda',
    famousName: 'RX-7 Savanna',
    modelDetail: 'FC3S Turbo II',
    year: 1991,
    engine: '13B-T Rotary Turbo',
    price: 30, // $30k USD (Rp 488M)
    availability: 'Available',
    image: '/cars/rx-7-savanna.png',
    color: '#FFFFFF',
    chassis: 'FC3S-203948',
    category: 'Standard',
    capacity: 2,
    transmission: 'Manual',
    efficiency: '1.3L Turbo',
    acceleration: 80,
    handling: 88,
    modPriority: 85
  },
  {
    id: '15',
    brand: 'Nissan',
    famousName: 'Fairlady Z',
    modelDetail: 'S30 240ZG',
    year: 1975,
    engine: 'L24 2.4L I6',
    price: 75, // $75k USD (Rp 1.2M) - classic collector
    availability: 'Available',
    image: '/cars/fairlady-z.png',
    color: '#FFFFFF',
    chassis: 'S30-001234',
    category: 'Standard',
    capacity: 2,
    transmission: 'Manual',
    efficiency: '2.4L I6',
    acceleration: 68,
    handling: 80,
    modPriority: 88
  },
  {
    id: '16',
    brand: 'Lancer Evo VI',
    famousName: 'Tommi Mäkinen Edition',
    modelDetail: 'CP9A TME Exclusive',
    year: 1999,
    engine: '4G63T 2.0L I4 Turbo',
    price: 85, // $85k USD (Rp 1.38M) - rare TME
    availability: 'Available',
    image: '/cars/tommi-mäkinen-edition.png',
    color: '#FFFFFF',
    chassis: 'CP9A-010234',
    category: 'Modified',
    capacity: 4,
    transmission: 'Manual',
    efficiency: '2.0L Turbo',
    acceleration: 89,
    handling: 95,
    modPriority: 93
  },
  {
    id: '17',
    brand: 'Subaru',
    famousName: 'Impreza WRX STi',
    modelDetail: 'GDB-E Hawkeye',
    year: 2006,
    engine: 'EJ257 2.5L F4 Turbo',
    price: 48, // $48k USD (Rp 780M)
    availability: 'Available',
    image: '/cars/impreza-wrx-st.png',
    color: '#FFFFFF',
    chassis: 'GDB-049231',
    category: 'Standard',
    capacity: 4,
    transmission: 'Manual',
    efficiency: '2.5L Turbo',
    acceleration: 87,
    handling: 91,
    modPriority: 90
  },
  {
    id: '18',
    brand: 'Suzuki',
    famousName: 'Cappuccino',
    modelDetail: 'EA11R Kei-Car',
    year: 1995,
    engine: 'F6A 0.66L I3 DOHC Turbo',
    price: 18, // $18k USD (Rp 293M)
    availability: 'Available',
    image: '/cars/cappuccino.png',
    color: '#FFFFFF',
    chassis: 'EA11R-102934',
    category: 'Standard',
    capacity: 2,
    transmission: 'Manual',
    efficiency: '0.6L Turbo',
    acceleration: 62,
    handling: 85,
    modPriority: 75
  },
  {
    id: '19',
    brand: 'Autozam',
    famousName: 'AZ-1',
    modelDetail: 'PG6SA Gullwing',
    year: 1992,
    engine: 'F6A 0.66L I3 DOHC Turbo',
    price: 25, // $25k USD (Rp 406M)
    availability: 'Available',
    image: '/cars/autozam-az-1.png',
    color: '#FFFFFF',
    chassis: 'PG6SA-100234',
    category: 'Standard',
    capacity: 2,
    transmission: 'Manual',
    efficiency: '0.6L Turbo',
    acceleration: 60,
    handling: 88,
    modPriority: 78
  },
  {
    id: '20',
    brand: 'Toyota',
    famousName: 'Soarer 2.5GT-T',
    modelDetail: 'JZZ30 VVT-i',
    year: 1997,
    engine: '1JZ-GTE 2.5L I6 VVT-i Turbo',
    price: 35, // $35k USD (Rp 570M)
    availability: 'Available',
    image: '/cars/soarer-2.5gt-t.png',
    color: '#FFFFFF',
    chassis: 'JZZ30-001234',
    category: 'Modified',
    capacity: 4,
    transmission: 'Manual',
    efficiency: '2.5L Turbo',
    acceleration: 83,
    handling: 76,
    modPriority: 85
  },
  {
    id: '7',
    brand: 'Nissan',
    famousName: 'Silvia Spec-R',
    modelDetail: 'S15 Turbo',
    year: 2002,
    engine: 'SR20DET 2.0L I4 Turbo',
    price: 40, // $40k USD (Rp 650M)
    availability: 'Available',
    image: '/cars/nissan-silvia-s15.png',
    color: '#FFFFFF',
    chassis: 'S15-092314',
    category: 'Modified',
    capacity: 2,
    transmission: 'Manual',
    efficiency: '2.0L Turbo',
    acceleration: 81,
    handling: 93,
    modPriority: 96
  }
];

export const ALL_CARS = [...POPULAR_CARS, ...COLLECTION_CARS];
