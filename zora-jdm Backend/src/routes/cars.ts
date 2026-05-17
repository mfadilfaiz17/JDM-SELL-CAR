import { Router, Request, Response } from 'express';
import Car from '../models/Car.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

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

// Create car (requires authentication)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Validate required fields
    const { brand, model, year, price, mileage, condition, fuelType, transmission, color } = req.body;
    
    if (!brand || !model || !year || !price || !mileage || !condition || !fuelType || !transmission || !color) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate data types and ranges
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    if (typeof mileage !== 'number' || mileage < 0) {
      return res.status(400).json({ error: 'Mileage must be a non-negative number' });
    }

    if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'Invalid year' });
    }

    // Validate enum values
    const validConditions = ['excellent', 'good', 'fair', 'poor'];
    if (!validConditions.includes(condition)) {
      return res.status(400).json({ error: 'Invalid condition value' });
    }

    const validFuelTypes = ['petrol', 'diesel', 'hybrid', 'electric'];
    if (!validFuelTypes.includes(fuelType)) {
      return res.status(400).json({ error: 'Invalid fuel type' });
    }

    const validTransmissions = ['manual', 'automatic'];
    if (!validTransmissions.includes(transmission)) {
      return res.status(400).json({ error: 'Invalid transmission type' });
    }

    if (Car.db && Car.db.readyState === 1) {
      // Set seller to authenticated user
      const carData = {
        ...req.body,
        seller: req.user?.id
      };
      
      const car = new Car(carData);
      await car.save();
      res.status(201).json(car);
    } else {
      // Mock creation
      const newCar = { 
        _id: Date.now().toString(), 
        ...req.body,
        seller: req.user?.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockCars.push(newCar);
      res.status(201).json(newCar);
    }
  } catch (error: any) {
    console.error('Create car error:', error);
    res.status(400).json({ error: error.message || 'Failed to create car' });
  }
});

// Update car (requires authentication and ownership)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (Car.db && Car.db.readyState === 1) {
      // Find car first to check ownership
      const car = await Car.findById(req.params.id);
      
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }

      // Check ownership (only owner or admin can update)
      if (car.seller.toString() !== req.user?.id && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'You do not have permission to update this car' });
      }

      // Validate if updating critical fields
      if (req.body.price !== undefined) {
        if (typeof req.body.price !== 'number' || req.body.price <= 0) {
          return res.status(400).json({ error: 'Price must be a positive number' });
        }
      }

      if (req.body.mileage !== undefined) {
        if (typeof req.body.mileage !== 'number' || req.body.mileage < 0) {
          return res.status(400).json({ error: 'Mileage must be a non-negative number' });
        }
      }

      if (req.body.condition !== undefined) {
        const validConditions = ['excellent', 'good', 'fair', 'poor'];
        if (!validConditions.includes(req.body.condition)) {
          return res.status(400).json({ error: 'Invalid condition value' });
        }
      }

      // Update car
      const updatedCar = await Car.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );
      
      res.json(updatedCar);
    } else {
      const carIndex = mockCars.findIndex(c => c._id === req.params.id);
      if (carIndex === -1) {
        return res.status(404).json({ error: 'Car not found' });
      }
      
      // Check ownership in mock mode
      if (mockCars[carIndex].seller !== req.user?.id && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'You do not have permission to update this car' });
      }
      
      mockCars[carIndex] = { ...mockCars[carIndex], ...req.body, updatedAt: new Date() };
      res.json(mockCars[carIndex]);
    }
  } catch (error: any) {
    console.error('Update car error:', error);
    res.status(400).json({ error: error.message || 'Failed to update car' });
  }
});

// Delete car (requires authentication and ownership)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (Car.db && Car.db.readyState === 1) {
      // Find car first to check ownership
      const car = await Car.findById(req.params.id);
      
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }

      // Check ownership (only owner or admin can delete)
      if (car.seller.toString() !== req.user?.id && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'You do not have permission to delete this car' });
      }

      await Car.findByIdAndDelete(req.params.id);
      res.json({ message: 'Car deleted successfully' });
    } else {
      const carIndex = mockCars.findIndex(c => c._id === req.params.id);
      if (carIndex === -1) {
        return res.status(404).json({ error: 'Car not found' });
      }
      
      // Check ownership in mock mode
      if (mockCars[carIndex].seller !== req.user?.id && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'You do not have permission to delete this car' });
      }
      
      mockCars.splice(carIndex, 1);
      res.json({ message: 'Car deleted successfully' });
    }
  } catch (error: any) {
    console.error('Delete car error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete car' });
  }
});

export default router;
