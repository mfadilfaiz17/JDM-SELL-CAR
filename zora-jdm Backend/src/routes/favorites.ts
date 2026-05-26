import { Router, Response } from 'express';
import Favorite from '../models/Favorite.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get user's favorites
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    console.log('📋 GET /favorites - Fetching favorites for user:', req.user?.id);
    
    const favorites = await Favorite.find({ user: req.user?.id })
      .populate('car')
      .sort({ createdAt: -1 });
    
    // Return array of car IDs
    const carIds = favorites.map(fav => fav.car._id.toString());
    
    console.log(`✅ Found ${carIds.length} favorites`);
    res.json(carIds);
  } catch (error: any) {
    console.error('❌ Error fetching favorites:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch favorites',
      code: 'FETCH_ERROR'
    });
  }
});

// Add to favorites
router.post('/:carId', async (req: AuthRequest, res: Response) => {
  try {
    const { carId } = req.params;
    console.log('➕ POST /favorites/:carId - Adding to favorites:', carId);
    
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ 
        error: 'Invalid car ID format',
        code: 'INVALID_ID'
      });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      user: req.user?.id,
      car: carId
    });

    if (existing) {
      return res.status(200).json({ 
        message: 'Already in favorites',
        code: 'ALREADY_EXISTS'
      });
    }

    // Create favorite
    const favorite = new Favorite({
      user: req.user?.id,
      car: carId
    });

    await favorite.save();
    
    console.log('✅ Added to favorites');
    res.status(201).json({ 
      message: 'Added to favorites',
      code: 'SUCCESS'
    });
  } catch (error: any) {
    console.error('❌ Error adding favorite:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to add favorite',
      code: 'ADD_ERROR'
    });
  }
});

// Remove from favorites
router.delete('/:carId', async (req: AuthRequest, res: Response) => {
  try {
    const { carId } = req.params;
    console.log('🗑️ DELETE /favorites/:carId - Removing from favorites:', carId);
    
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ 
        error: 'Invalid car ID format',
        code: 'INVALID_ID'
      });
    }

    const result = await Favorite.findOneAndDelete({
      user: req.user?.id,
      car: carId
    });

    if (!result) {
      return res.status(404).json({ 
        error: 'Favorite not found',
        code: 'NOT_FOUND'
      });
    }

    console.log('✅ Removed from favorites');
    res.json({ 
      message: 'Removed from favorites',
      code: 'SUCCESS'
    });
  } catch (error: any) {
    console.error('❌ Error removing favorite:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to remove favorite',
      code: 'REMOVE_ERROR'
    });
  }
});

// Get favorite cars with full details
router.get('/cars', async (req: AuthRequest, res: Response) => {
  try {
    console.log('🚗 GET /favorites/cars - Fetching favorite cars for user:', req.user?.id);
    
    const favorites = await Favorite.find({ user: req.user?.id })
      .populate({
        path: 'car',
        populate: {
          path: 'seller',
          select: 'name email phone'
        }
      })
      .sort({ createdAt: -1 });
    
    const cars = favorites.map(fav => fav.car).filter(car => car !== null);
    
    console.log(`✅ Found ${cars.length} favorite cars`);
    res.json(cars);
  } catch (error: any) {
    console.error('❌ Error fetching favorite cars:', error.message);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch favorite cars',
      code: 'FETCH_ERROR'
    });
  }
});

export default router;
