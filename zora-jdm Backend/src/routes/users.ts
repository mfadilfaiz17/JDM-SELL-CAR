import { Router, Request, Response } from 'express';
import User from '../models/User.js';

const router = Router();

// Mock data untuk development jika database tidak tersedia
const mockUsers = [
  {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '507f1f77bcf86cd799439012',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    if (User.db && User.db.readyState === 1) {
      const users = await User.find();
      res.json(users);
    } else {
      console.log('📝 Using mock users data (database not connected)');
      res.json(mockUsers);
    }
  } catch (error) {
    console.log('📝 Database error, using mock users data');
    res.json(mockUsers);
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (User.db && User.db.readyState === 1) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } else {
      const user = mockUsers.find(u => u._id === req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  } catch (error) {
    const user = mockUsers.find(u => u._id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  }
});

// Create user
router.post('/', async (req: Request, res: Response) => {
  try {
    if (User.db && User.db.readyState === 1) {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } else {
      const newUser = { _id: Date.now().toString(), ...req.body, createdAt: new Date(), updatedAt: new Date() };
      mockUsers.push(newUser);
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (User.db && User.db.readyState === 1) {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } else {
      const userIndex = mockUsers.findIndex(u => u._id === req.params.id);
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...req.body, updatedAt: new Date() };
      res.json(mockUsers[userIndex]);
    }
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (User.db && User.db.readyState === 1) {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } else {
      const userIndex = mockUsers.findIndex(u => u._id === req.params.id);
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      mockUsers.splice(userIndex, 1);
      res.json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
