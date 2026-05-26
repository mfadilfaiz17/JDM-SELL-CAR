import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Define schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  password: String,
  phone: String,
  role: { type: String, enum: ['buyer', 'seller', 'both', 'admin'], default: 'buyer' },
  createdAt: { type: Date, default: Date.now }
});

const carSchema = new mongoose.Schema({
  brand: String,
  carModel: String,
  year: Number,
  price: Number,
  mileage: { type: Number, default: 0 },
  condition: String,
  fuelType: String,
  transmission: String,
  color: String,
  description: String,
  images: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Car = mongoose.model('Car', carSchema);

// Data from Frontend constants.ts - MATCHED WITH ACTUAL IMAGE FILES
const carsData = [
  {
    brand: 'Nissan',
    carModel: 'Skyline GT-R BNR34',
    modelDetail: 'V-Spec II Nür',
    year: 2002,
    engine: 'RB26DETT 2.6L I6 Twin Turbo',
    price: 150000,
    mileage: 45000,
    color: 'Silver',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'excellent',
    description: 'RB26DETT 2.6L I6 Twin Turbo - Legendary JDM icon',
    image: '/cars/skyline-gt-r-bnr34.png'
  },
  {
    brand: 'Toyota',
    carModel: 'Sprinter Trueno AE86',
    modelDetail: 'GT-Apex',
    year: 1986,
    engine: '4A-GE 1.6L I4 16v',
    price: 35000,
    mileage: 120000,
    color: 'White/Black',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'good',
    description: '4A-GE 1.6L I4 16v - Iconic drift legend',
    image: '/cars/sprinter-trueno-ae86.png'
  },
  {
    brand: 'Mazda',
    carModel: 'RX-7 FD3S',
    modelDetail: 'Spirit R Type A',
    year: 2002,
    engine: '13B-REW Sequential Turbo Rotary',
    price: 65000,
    mileage: 55000,
    color: 'Red',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'excellent',
    description: '13B-REW Sequential Turbo Rotary - Rotary legend',
    image: '/cars/rx-7-fd3s.png'
  },
  {
    brand: 'Toyota',
    carModel: 'Supra JZA80',
    modelDetail: 'RZ Series',
    year: 1998,
    engine: '2JZ-GTE 3.0L I6 Twin Turbo',
    price: 120000,
    mileage: 48000,
    color: 'White',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'excellent',
    description: '2JZ-GTE 3.0L I6 Twin Turbo - Legendary tuner car',
    image: '/cars/supra-jza80.png'
  },
  {
    brand: 'Honda',
    carModel: 'NSX-R',
    modelDetail: 'NA2 Championship White',
    year: 2002,
    engine: 'C32B 3.2L V6 VTEC',
    price: 180000,
    mileage: 25000,
    color: 'White',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'excellent',
    description: 'C32B 3.2L V6 VTEC - Japanese supercar',
    image: '/cars/nsx-r.png'
  },
  {
    brand: 'Subaru',
    carModel: 'Impreza 22B-STi',
    modelDetail: 'GC8 Limited Edition',
    year: 1998,
    engine: 'EJ22 2.2L F4 Flat-Four Turbo',
    price: 250000,
    mileage: 35000,
    color: 'Blue',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'excellent',
    description: 'EJ22 2.2L F4 Flat-Four Turbo - Rare limited edition',
    image: '/cars/impreza-228-sti.png'
  },
  {
    brand: 'Mitsubishi',
    carModel: 'Lancer Evolution IX',
    modelDetail: 'CT9A MR Edition',
    year: 2006,
    engine: '4G63T 2.0L I4 MIVEC Turbo',
    price: 55000,
    mileage: 62000,
    color: 'Silver',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'excellent',
    description: '4G63T 2.0L I4 MIVEC Turbo - Rally legend',
    image: '/cars/lancer-evolution-ix.png'
  },
  {
    brand: 'Honda',
    carModel: 'Integra Type R',
    modelDetail: 'DC2 98 Spec',
    year: 1998,
    engine: 'B18C 1.8L I4 DOHC VTEC',
    price: 45000,
    mileage: 78000,
    color: 'White',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'good',
    description: 'B18C 1.8L I4 DOHC VTEC - VTEC legend',
    image: '/cars/integra-type-r.png'
  },
  {
    brand: 'Mitsubishi',
    carModel: 'GTO Twin Turbo',
    modelDetail: 'Z16A MR Version',
    year: 1998,
    engine: '6G72 3.0L V6 Twin Turbo',
    price: 28000,
    mileage: 95000,
    color: 'Silver',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'good',
    description: '6G72 3.0L V6 Twin Turbo - AWD powerhouse',
    image: '/cars/gto-twin-turbo.png'
  },
  {
    brand: 'Toyota',
    carModel: 'Chaser Tourer V',
    modelDetail: 'JZX100 VVT-i',
    year: 1999,
    engine: '1JZ-GTE 2.5L I6 VVT-i Turbo',
    price: 32000,
    mileage: 105000,
    color: 'White',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'good',
    description: '1JZ-GTE 2.5L I6 VVT-i Turbo - Drift sedan',
    image: '/cars/chaser-tourer-v.png'
  },
  {
    brand: 'Nissan',
    carModel: '300ZX Fairlady Z',
    modelDetail: 'Z32 Twin Turbo',
    year: 1996,
    engine: 'VG30DETT 3.0L V6 Twin Turbo',
    price: 38000,
    mileage: 88000,
    color: 'White',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'good',
    description: 'VG30DETT 3.0L V6 Twin Turbo - 90s sports car',
    image: '/cars/z32-fairlady-z.png'
  },
  {
    brand: 'Honda',
    carModel: 'Civic Type R',
    modelDetail: 'EK9 Hatchback',
    year: 1998,
    engine: 'B16B 1.6L I4 DOHC VTEC',
    price: 42000,
    mileage: 72000,
    color: 'White',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'excellent',
    description: 'B16B 1.6L I4 DOHC VTEC - Hot hatch legend',
    image: '/cars/civic-type-r.png'
  },
  {
    brand: 'Mazda',
    carModel: 'RX-7 Savanna',
    modelDetail: 'FC3S Turbo II',
    year: 1991,
    engine: '13B-T Rotary Turbo',
    price: 30000,
    mileage: 98000,
    color: 'White',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'good',
    description: '13B-T Rotary Turbo - Classic rotary',
    image: '/cars/rx-7-savanna.png'
  },
  {
    brand: 'Nissan',
    carModel: 'Fairlady Z',
    modelDetail: 'S30 240ZG',
    year: 1975,
    engine: 'L24 2.4L I6',
    price: 75000,
    mileage: 145000,
    color: 'Orange',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'good',
    description: 'L24 2.4L I6 - Classic collector',
    image: '/cars/fairlady-z.png'
  },
  {
    brand: 'Mitsubishi',
    carModel: 'Lancer Evo VI Tommi Mäkinen Edition',
    modelDetail: 'CP9A TME Exclusive',
    year: 1999,
    engine: '4G63T 2.0L I4 Turbo',
    price: 85000,
    mileage: 52000,
    color: 'Red',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'excellent',
    description: '4G63T 2.0L I4 Turbo - Rare TME edition',
    image: '/cars/tommi-mäkinen-edition.png'
  },
  {
    brand: 'Subaru',
    carModel: 'Impreza WRX STi',
    modelDetail: 'GDB-E Hawkeye',
    year: 2006,
    engine: 'EJ257 2.5L F4 Turbo',
    price: 48000,
    mileage: 68000,
    color: 'Blue',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'good',
    description: 'EJ257 2.5L F4 Turbo - AWD performance',
    image: '/cars/impreza-wrx-st.png'
  },
  {
    brand: 'Suzuki',
    carModel: 'Cappuccino',
    modelDetail: 'EA11R Kei-Car',
    year: 1995,
    engine: 'F6A 0.66L I3 DOHC Turbo',
    price: 18000,
    mileage: 85000,
    color: 'Red',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'good',
    description: 'F6A 0.66L I3 DOHC Turbo - Kei sports car',
    image: '/cars/cappuccino.png'
  },
  {
    brand: 'Autozam',
    carModel: 'AZ-1',
    modelDetail: 'PG6SA Gullwing',
    year: 1992,
    engine: 'F6A 0.66L I3 DOHC Turbo',
    price: 25000,
    mileage: 75000,
    color: 'Blue',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'good',
    description: 'F6A 0.66L I3 DOHC Turbo - Gullwing kei car',
    image: '/cars/autozam-az-1.png'
  },
  {
    brand: 'Toyota',
    carModel: 'Soarer 2.5GT-T',
    modelDetail: 'JZZ30 VVT-i',
    year: 1997,
    engine: '1JZ-GTE 2.5L I6 VVT-i Turbo',
    price: 35000,
    mileage: 112000,
    color: 'Silver',
    transmission: 'automatic',
    fuelType: 'petrol',
    condition: 'good',
    description: '1JZ-GTE 2.5L I6 VVT-i Turbo - Luxury GT',
    image: '/cars/soarer-2.5gt-t.png'
  },
  {
    brand: 'Nissan',
    carModel: 'Silvia Spec-R S15',
    modelDetail: 'S15 Turbo',
    year: 2002,
    engine: 'SR20DET 2.0L I4 Turbo',
    price: 40000,
    mileage: 65000,
    color: 'Silver',
    transmission: 'manual',
    fuelType: 'petrol',
    condition: 'excellent',
    description: 'SR20DET 2.0L I4 Turbo - Drift icon',
    image: '/cars/nissan-silvia-s15.png'
  }
];

async function seedCars() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create or get admin seller
    let adminSeller = await User.findOne({ email: 'admin@zorajdm.com' });
    if (!adminSeller) {
      console.log('👤 Creating admin seller user...');
      const hashedPassword = await bcryptjs.hash('Admin123!', 10);
      adminSeller = await User.create({
        name: 'Zora Admin',
        email: 'admin@zorajdm.com',
        password: hashedPassword,
        phone: '+62812345678',
        role: 'admin'
      });
      console.log('✅ Admin seller created');
    }

    // Clear existing cars
    const deleteResult = await Car.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing cars`);

    // Seed new cars
    const carsToInsert = carsData.map(car => ({
      ...car,
      seller: adminSeller._id,
      images: car.image ? [car.image] : []
    }));

    const insertedCars = await Car.insertMany(carsToInsert);
    console.log(`✅ Successfully seeded ${insertedCars.length} cars`);

    // Verify
    const carCount = await Car.countDocuments();
    console.log(`📊 Total cars in database: ${carCount}`);

    const sampleCar = await Car.findOne();
    console.log('📌 Sample car:', {
      brand: sampleCar.brand,
      carModel: sampleCar.carModel,
      year: sampleCar.year,
      price: sampleCar.price,
      seller: sampleCar.seller
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedCars();
