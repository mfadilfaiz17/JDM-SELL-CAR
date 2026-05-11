import { Router, Request, Response } from 'express';
import Car from '../models/Car.js';

const router = Router();

// Mock data untuk development jika database tidak tersedia
const mockCars = [
  {
    _id: '1',
    brand: 'Nissan',
    model: 'Skyline GT-R BNR34',
    year: 2002,
    price: 1260,
    mileage: 45000,
    condition: 'excellent',
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Silver',
    description: 'V-Spec II Nür - RB26DETT 2.6L I6 Twin Turbo',
    images: [],
    seller: '507f1f77bcf86cd799439011',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    brand: 'Toyota',
    model: 'Sprinter Trueno AE86',
    year: 1986,
    price: 450,
    mileage: 120000,
    condition: 'good',
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'White',
    description: 'GT-Apex - 4A-GE 1.6L I4 16v',
    images: [],
    seller: '507f1f77bcf86cd799439012',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    brand: 'Mazda',
    model: 'RX-7 FD3S',
    year: 2002,
    price: 800,
    mileage: 65000,
    condition: 'excellent',
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Red',
    description: 'Spirit R Type A - 13B-REW Sequential Turbo Rotary',
    images: [],
    seller: '507f1f77bcf86cd799439013',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all cars
router.get('/', async (req: Request, res: Response) => {
  try {
    // Try database first, fallback to mock data
    if (Car.db && Car.db.readyState === 1) {
      const cars = await Car.find().populate('seller', 'name email phone');
      res.json(cars);
    } else {
      console.log('📝 Using mock data (database not connected)');
      res.json(mockCars);
    }
  } catch (error) {
    console.log('📝 Database error, using mock data');
    res.json(mockCars);
  }
});

// Get car by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (Car.db && Car.db.readyState === 1) {
      const car = await Car.findById(req.params.id).populate('seller', 'name email phone');
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
      res.json(car);
    } else {
      const car = mockCars.find(c => c._id === req.params.id);
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
      res.json(car);
    }
  } catch (error) {
    const car = mockCars.find(c => c._id === req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(car);
  }
});

// Create car
router.post('/', async (req: Request, res: Response) => {
  try {
    if (Car.db && Car.db.readyState === 1) {
      const car = new Car(req.body);
      await car.save();
      res.status(201).json(car);
    } else {
      // Mock creation
      const newCar = { _id: Date.now().toString(), ...req.body };
      mockCars.push(newCar);
      res.status(201).json(newCar);
    }
  } catch (error) {
    res.status(400).json({ error: 'Failed to create car' });
  }
});

// Update car
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (Car.db && Car.db.readyState === 1) {
      const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
      res.json(car);
    } else {
      const carIndex = mockCars.findIndex(c => c._id === req.params.id);
      if (carIndex === -1) {
        return res.status(404).json({ error: 'Car not found' });
      }
      mockCars[carIndex] = { ...mockCars[carIndex], ...req.body };
      res.json(mockCars[carIndex]);
    }
  } catch (error) {
    res.status(400).json({ error: 'Failed to update car' });
  }
});

// Delete car
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (Car.db && Car.db.readyState === 1) {
      const car = await Car.findByIdAndDelete(req.params.id);
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
      res.json({ message: 'Car deleted successfully' });
    } else {
      const carIndex = mockCars.findIndex(c => c._id === req.params.id);
      if (carIndex === -1) {
        return res.status(404).json({ error: 'Car not found' });
      }
      mockCars.splice(carIndex, 1);
      res.json({ message: 'Car deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

export default router;
