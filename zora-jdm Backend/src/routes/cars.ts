import { Router, Request, Response } from 'express';
import Car from '../models/Car.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = Router();

// ============ GET ENDPOINTS ============

// Get all cars (PUBLIC)
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('📋 GET /cars - Fetching cars from database...');
    
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ Database not connected. State:', mongoose.connection.readyState);
      return res.status(503).json({ 
        error: 'Database connection error',
        code: 'DB_NOT_CONNECTED'
      });
    }

    const cars = await Car.find()
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${cars.length} cars`);
    res.json(cars);
  } catch (error: any) {
    console.error('❌ Error fetching cars:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch cars',
      code: 'FETCH_ERROR'
    });
  }
});

// Get car by ID (PUBLIC)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    console.log('🔍 GET /cars/:id - Fetching car:', req.params.id);
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.warn('⚠️ Invalid car ID format');
      return res.status(400).json({ 
        error: 'Invalid car ID format',
        code: 'INVALID_ID'
      });
    }

    if (mongoose.connection.readyState !== 1) {
      console.error('❌ Database not connected');
      return res.status(503).json({ 
        error: 'Database connection error',
        code: 'DB_NOT_CONNECTED'
      });
    }

    const car = await Car.findById(req.params.id).populate('seller', 'name email phone');
    if (!car) {
      console.warn('❌ Car not found');
      return res.status(404).json({ 
        error: 'Car not found',
        code: 'NOT_FOUND'
      });
    }

    console.log('✅ Car found:', car._id);
    res.json(car);
  } catch (error: any) {
    console.error('❌ Error fetching car:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch car',
      code: 'FETCH_ERROR'
    });
  }
});

// ============ POST ENDPOINTS ============

// Create car (PROTECTED - requires authentication)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    console.log('➕ POST /cars - Creating new car by user:', req.user?.id);

    if (mongoose.connection.readyState !== 1) {
      console.error('❌ Database not connected');
      return res.status(503).json({ 
        error: 'Database connection error',
        code: 'DB_NOT_CONNECTED'
      });
    }

    // Validate required fields
    const { brand, model, year, price, mileage, condition, fuelType, transmission, color } = req.body;
    
    if (!brand || !model || !year || !price || !mileage || !condition || !fuelType || !transmission || !color) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        code: 'MISSING_FIELDS'
      });
    }

    // Validate data types and ranges
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ 
        error: 'Price must be a positive number',
        code: 'INVALID_PRICE'
      });
    }

    if (typeof mileage !== 'number' || mileage < 0) {
      return res.status(400).json({ 
        error: 'Mileage must be a non-negative number',
        code: 'INVALID_MILEAGE'
      });
    }

    if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 1) {
      return res.status(400).json({ 
        error: 'Invalid year',
        code: 'INVALID_YEAR'
      });
    }

    // Validate enum values
    const validConditions = ['excellent', 'good', 'fair', 'poor'];
    if (!validConditions.includes(condition)) {
      return res.status(400).json({ 
        error: 'Invalid condition value',
        code: 'INVALID_CONDITION'
      });
    }

    const validFuelTypes = ['petrol', 'diesel', 'hybrid', 'electric'];
    if (!validFuelTypes.includes(fuelType)) {
      return res.status(400).json({ 
        error: 'Invalid fuel type',
        code: 'INVALID_FUEL_TYPE'
      });
    }

    const validTransmissions = ['manual', 'automatic'];
    if (!validTransmissions.includes(transmission)) {
      return res.status(400).json({ 
        error: 'Invalid transmission type',
        code: 'INVALID_TRANSMISSION'
      });
    }

    // Create car
    const carData = {
      ...req.body,
      seller: req.user?.id
    };
    
    const car = new Car(carData);
    await car.save();
    
    console.log('✅ Car created:', car._id);
    res.status(201).json(car);
  } catch (error: any) {
    console.error('❌ Create car error:', error.message);
    res.status(400).json({ 
      error: error.message || 'Failed to create car',
      code: 'CREATE_ERROR'
    });
  }
});

// ============ PUT ENDPOINTS ============

// Update car (PROTECTED - requires authentication and ownership)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    console.log('✏️ PUT /cars/:id - Updating car:', req.params.id);

    if (mongoose.connection.readyState !== 1) {
      console.error('❌ Database not connected');
      return res.status(503).json({ 
        error: 'Database connection error',
        code: 'DB_NOT_CONNECTED'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        error: 'Invalid car ID format',
        code: 'INVALID_ID'
      });
    }

    // Find car first to check ownership
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ 
        error: 'Car not found',
        code: 'NOT_FOUND'
      });
    }

    // Check ownership (only owner or admin can update)
    if (car.seller.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ 
        error: 'You do not have permission to update this car',
        code: 'FORBIDDEN'
      });
    }

    // Validate if updating critical fields
    if (req.body.price !== undefined) {
      if (typeof req.body.price !== 'number' || req.body.price <= 0) {
        return res.status(400).json({ 
          error: 'Price must be a positive number',
          code: 'INVALID_PRICE'
        });
      }
    }

    if (req.body.mileage !== undefined) {
      if (typeof req.body.mileage !== 'number' || req.body.mileage < 0) {
        return res.status(400).json({ 
          error: 'Mileage must be a non-negative number',
          code: 'INVALID_MILEAGE'
        });
      }
    }

    if (req.body.condition !== undefined) {
      const validConditions = ['excellent', 'good', 'fair', 'poor'];
      if (!validConditions.includes(req.body.condition)) {
        return res.status(400).json({ 
          error: 'Invalid condition value',
          code: 'INVALID_CONDITION'
        });
      }
    }

    // Update car
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedCar) {
      return res.status(404).json({ 
        error: 'Car not found',
        code: 'NOT_FOUND'
      });
    }

    console.log('✅ Car updated:', updatedCar._id);
    res.json(updatedCar);
  } catch (error: any) {
    console.error('❌ Update car error:', error.message);
    res.status(400).json({ 
      error: error.message || 'Failed to update car',
      code: 'UPDATE_ERROR'
    });
  }
});

// ============ DELETE ENDPOINTS ============

// Delete car (PROTECTED - requires authentication and ownership)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    console.log('🗑️ DELETE /cars/:id - Deleting car:', req.params.id);

    if (mongoose.connection.readyState !== 1) {
      console.error('❌ Database not connected');
      return res.status(503).json({ 
        error: 'Database connection error',
        code: 'DB_NOT_CONNECTED'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        error: 'Invalid car ID format',
        code: 'INVALID_ID'
      });
    }

    // Find car first to check ownership
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ 
        error: 'Car not found',
        code: 'NOT_FOUND'
      });
    }

    // Check ownership (only owner or admin can delete)
    if (car.seller.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ 
        error: 'You do not have permission to delete this car',
        code: 'FORBIDDEN'
      });
    }

    await Car.findByIdAndDelete(req.params.id);
    
    console.log('✅ Car deleted:', req.params.id);
    res.json({ 
      message: 'Car deleted successfully',
      code: 'SUCCESS'
    });
  } catch (error: any) {
    console.error('❌ Delete car error:', error.message);
    res.status(400).json({ 
      error: error.message || 'Failed to delete car',
      code: 'DELETE_ERROR'
    });
  }
});

export default router;
