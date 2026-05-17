import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import carsRouter from './routes/cars.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Security: Helmet - Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Disable for development, enable in production
}));

// Security: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Naikkan dari 5 ke 50 untuk development
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API version endpoint
app.get('/api/version', (req: Request, res: Response) => {
  res.json({ version: process.env.API_VERSION || 'v1' });
});

// Routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/cars', carsRouter);
app.use('/api/users', usersRouter);
app.use('/api/upload', uploadRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
  try {
    // Validate required environment variables
    const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
      console.error('📝 Please check your .env file');
      process.exit(1);
    }

    // Try to connect to database, but don't fail if it doesn't work
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('⚠️  Database connection failed, but server will still start');
      console.warn('📝 Make sure to configure MongoDB Atlas correctly');
    }

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📚 API Version: ${process.env.API_VERSION || 'v1'}`);
      console.log(`🔒 Security: Helmet enabled, Rate limiting active`);
      console.log(`\n📋 Available endpoints:`);
      console.log(`   GET  /api/health - Health check`);
      console.log(`   GET  /api/version - API version`);
      console.log(`   POST /api/auth/register - Register user`);
      console.log(`   POST /api/auth/login - Login user`);
      console.log(`   GET  /api/auth/me - Get current user`);
      console.log(`   PUT  /api/auth/profile - Update profile`);
      console.log(`   POST /api/auth/change-password - Change password`);
      console.log(`   POST /api/auth/logout - Logout user`);
      console.log(`   GET  /api/cars - Get all cars`);
      console.log(`   POST /api/cars - Create car`);
      console.log(`   POST /api/upload/image - Upload image`);
      console.log(`   DELETE /api/upload/image - Delete image`);
      console.log(`   GET  /api/users - Get all users`);
      console.log(`   POST /api/users - Create user`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
