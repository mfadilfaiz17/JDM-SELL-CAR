# 🛠️ Development Guide

## 📋 Daftar Isi
1. [Setup Awal](#setup-awal)
2. [Menjalankan Server](#menjalankan-server)
3. [Struktur Project](#struktur-project)
4. [Membuat Endpoint Baru](#membuat-endpoint-baru)
5. [Database Operations](#database-operations)
6. [Error Handling](#error-handling)
7. [Testing](#testing)
8. [Deployment](#deployment)

## Setup Awal

### Prerequisites
- Node.js v18+
- npm atau yarn
- MongoDB Atlas account

### Installation
```bash
npm install
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

## Menjalankan Server

### Development Mode (dengan auto-reload)
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Lint TypeScript
```bash
npm run lint
```

### Clean Build
```bash
npm run clean
```

## Struktur Project

```
src/
├── index.ts                 # Entry point, setup Express app
├── config/
│   └── database.ts         # MongoDB connection logic
├── models/
│   ├── Car.ts              # Car schema & interface
│   └── User.ts             # User schema & interface
└── routes/
    ├── cars.ts             # Car CRUD endpoints
    └── users.ts            # User CRUD endpoints
```

## Membuat Endpoint Baru

### 1. Buat Model (jika diperlukan)

File: `src/models/Review.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  rating: number;
  comment: string;
  car: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', reviewSchema);
```

### 2. Buat Routes

File: `src/routes/reviews.ts`
```typescript
import { Router, Request, Response } from 'express';
import Review from '../models/Review.js';

const router = Router();

// Get all reviews
router.get('/', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find()
      .populate('car', 'brand model')
      .populate('user', 'name email');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get reviews by car
router.get('/car/:carId', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ car: req.params.carId })
      .populate('user', 'name email');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create review
router.post('/', async (req: Request, res: Response) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create review' });
  }
});

export default router;
```

### 3. Register Routes di index.ts

```typescript
import reviewsRouter from './routes/reviews.js';

// ... existing code ...

app.use('/api/reviews', reviewsRouter);
```

## Database Operations

### Query Examples

```typescript
// Find all
const cars = await Car.find();

// Find with filter
const cars = await Car.find({ brand: 'Toyota' });

// Find with pagination
const cars = await Car.find()
  .limit(10)
  .skip(0)
  .sort({ createdAt: -1 });

// Find by ID
const car = await Car.findById(id);

// Find and update
const car = await Car.findByIdAndUpdate(id, data, { new: true });

// Find and delete
const car = await Car.findByIdAndDelete(id);

// Populate references
const cars = await Car.find().populate('seller', 'name email');

// Count
const count = await Car.countDocuments({ brand: 'Toyota' });
```

### Validation

```typescript
// Mongoose akan validate berdasarkan schema
// Tambahkan custom validation jika diperlukan

const carSchema = new Schema({
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (v: number) => v > 0,
      message: 'Price must be greater than 0'
    }
  }
});
```

## Error Handling

### Best Practices

```typescript
// ✅ Good - Specific error handling
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ❌ Bad - Generic error handling
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const car = await Car.findById(req.params.id);
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
});
```

## Testing

### Test API dengan Node.js
```bash
node test-api.js
```

### Test MongoDB Connection
```bash
node test-simple.js
```

### Manual Testing dengan cURL

```bash
# Get all cars
curl http://localhost:5000/api/cars

# Create car
curl -X POST http://localhost:5000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Honda",
    "model": "Civic",
    "year": 2000,
    "price": 150000000,
    "mileage": 100000,
    "condition": "good",
    "fuelType": "petrol",
    "transmission": "manual",
    "color": "Blue",
    "seller": "USER_ID"
  }'

# Get car by ID
curl http://localhost:5000/api/cars/CAR_ID

# Update car
curl -X PUT http://localhost:5000/api/cars/CAR_ID \
  -H "Content-Type: application/json" \
  -d '{"price": 140000000}'

# Delete car
curl -X DELETE http://localhost:5000/api/cars/CAR_ID
```

## Deployment

### Prepare for Production

1. **Build**
   ```bash
   npm run build
   ```

2. **Test Build**
   ```bash
   npm start
   ```

3. **Environment Variables**
   - Set `NODE_ENV=production`
   - Update `MONGODB_URI` ke production database
   - Update `FRONTEND_URL` ke production frontend URL

### Deploy ke Heroku

```bash
# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_production_uri
heroku config:set FRONTEND_URL=your_frontend_url

# Deploy
git push heroku main
```

### Deploy ke Railway

1. Connect GitHub repository
2. Create new project
3. Add environment variables
4. Deploy

### Deploy ke Vercel

Vercel lebih cocok untuk frontend, tapi bisa juga untuk backend:

1. Push ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy

## 📚 Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [REST API Best Practices](https://restfulapi.net/)

## 🐛 Common Issues

### Issue: Cannot find module
**Solution**: Pastikan import path benar, terutama dengan `.js` extension untuk ES modules

### Issue: MongoDB connection timeout
**Solution**: Check IP whitelist di MongoDB Atlas, verify credentials

### Issue: CORS error
**Solution**: Verify `FRONTEND_URL` di `.env` sesuai dengan frontend URL

### Issue: Port already in use
**Solution**: Change `PORT` di `.env` atau kill process yang menggunakan port

---

Happy Coding! 🚀
