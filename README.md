# 🏎️ ZORA JDM - Japanese Domestic Market Car Marketplace

A modern, full-stack web application for buying and selling JDM (Japanese Domestic Market) cars. Built with React, TypeScript, Node.js, Express, and MongoDB Atlas.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)
![Status](https://img.shields.io/badge/status-production--ready-brightgreen.svg)

**Last Updated**: May 26, 2026  
**Status**: 🟢 Production Ready - All Phases Complete

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Testing Guide](#-testing-guide)
- [Development Progress](#-development-progress)
- [Security](#-security)
- [Performance](#-performance)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🚗 Car Marketplace
- **Browse Inventory**: 20+ iconic JDM cars with detailed specifications
- **Advanced Search & Filters**: Filter by brand, model, year, price, condition, fuel type
- **Car Comparison**: Compare up to 3 cars side-by-side
- **Favorites System**: Save favorite cars for later viewing
- **Pagination**: Smooth browsing with 12 cars per page
- **Real-time Data**: All data fetched from MongoDB Atlas with fallback support

### 👤 User Authentication & Authorization
- Secure JWT-based authentication
- User registration and login
- Protected routes for authenticated users
- Profile management (update info, change password)
- Role-based access (buyer, seller, both, admin)
- Ownership validation (users can only modify their own listings)

### 🏪 Seller Features
- **Personal Garage**: Manage your car listings
- **Sell Cars**: Create new listings with image upload
- **Full CRUD Operations**: Create, Read, Update, Delete listings
- **Toggle Active/Inactive**: Control listing visibility
- **Statistics Dashboard**: View total listings, active/inactive counts

### 🎨 Modern UI/UX
- Cyberpunk-inspired design with cyan accents
- Fully responsive (mobile 320px+, tablet 768px+, desktop 1024px+)
- Smooth CSS animations (no heavy libraries)
- Dark theme optimized for viewing
- Touch-friendly interactions
- Loading states and error handling

### 🔒 Security Features
- Helmet.js for HTTP security headers
- Rate limiting (100 req/15min general, 50 req/15min auth)
- JWT token validation
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable validation

### 📊 Performance Stats
Each car includes realistic performance metrics:
- **Acceleration** (0-100): Speed rating
- **Handling** (0-100): Cornering ability  
- **Mod Priority** (0-100): Tuning popularity

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- MongoDB Atlas account (free tier works)
- Git installed

### 1. Clone Repository
```bash
git clone https://github.com/mfadilfaiz17/zora-jdm.git
cd "Project JDM Sell Car"
```

### 2. Backend Setup
```bash
cd "zora-jdm Backend"
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB credentials
# Required: MONGODB_URI, JWT_SECRET, PORT

# Start backend
npm run dev
```

### 3. Frontend Setup
```bash
cd "zora-jdm Frontend"
npm install

# Create .env file (optional)
cp .env.example .env

# Start frontend
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

---

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://username:password@host:27017/zora-jdm?ssl=true&replicaSet=xxx&authSource=admin

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# API Configuration
API_VERSION=v1
API_URL=http://localhost:5001

# JWT Configuration (REQUIRED - generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### Frontend Environment Variables (.env) - Optional

```env
# Backend API URL
VITE_API_URL=http://localhost:5001/api
```

### MongoDB Atlas Setup

1. **Create Account**: https://cloud.mongodb.com/
2. **Create Cluster**: Free tier (M0) is sufficient
3. **Create Database User**: 
   - Username: your_username
   - Password: your_password
4. **Whitelist IP**: Add your IP address or use 0.0.0.0/0 for development
5. **Get Connection String**: Use standard (non-SRV) format
6. **Database Name**: `zora-jdm`

**Connection String Format:**
```
mongodb://username:password@host1:27017,host2:27017,host3:27017/zora-jdm?ssl=true&replicaSet=xxx&authSource=admin
```

---

## 📁 Project Structure

```
Project JDM Sell Car/
├── zora-jdm Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT authentication
│   │   │   └── upload.ts            # File upload handling
│   │   ├── models/
│   │   │   ├── Car.ts               # Car schema
│   │   │   └── User.ts              # User schema
│   │   ├── routes/
│   │   │   ├── auth.ts              # Auth endpoints
│   │   │   ├── cars.ts              # Car CRUD endpoints
│   │   │   ├── upload.ts            # Image upload
│   │   │   └── users.ts             # User endpoints
│   │   └── index.ts                 # Entry point
│   ├── uploads/                     # Uploaded images
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── package.json
│   ├── tsconfig.json
│   └── seed-cars.js                 # Database seeding script
│
├── zora-jdm Frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts            # API client (Axios)
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Navigation bar
│   │   │   ├── Footer.tsx           # Footer
│   │   │   ├── CarCard.tsx          # Car display card
│   │   │   ├── ComparisonModal.tsx  # Car comparison
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── BuyCar.tsx           # Browse cars
│   │   │   ├── SellCar.tsx          # Create listing
│   │   │   ├── Garage.tsx           # User's listings
│   │   │   ├── Login.tsx            # Login page
│   │   │   ├── Register.tsx         # Registration
│   │   │   └── UserProfile.tsx      # Profile management
│   │   ├── hooks/
│   │   │   └── useCars.ts           # Car data hook
│   │   ├── constants.ts             # Car data & types
│   │   ├── App.tsx                  # Main app component
│   │   └── main.tsx                 # Entry point
│   ├── public/
│   │   └── cars/                    # Car images (20 files)
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── bekas dokumentasi/               # Archived documentation
└── README.md                        # This file
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "seller"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+9876543210"
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

### Car Endpoints

#### Get All Cars (Public)
```http
GET /api/cars
```

#### Get Car by ID (Public)
```http
GET /api/cars/:id
```

#### Create Car (Protected)
```http
POST /api/cars
Authorization: Bearer {token}
Content-Type: application/json

{
  "brand": "Nissan",
  "carModel": "Skyline GT-R",
  "year": 2002,
  "price": 150000,
  "mileage": 45000,
  "condition": "excellent",
  "fuelType": "petrol",
  "transmission": "manual",
  "color": "Silver",
  "description": "RB26DETT engine",
  "images": ["/cars/skyline-gt-r-bnr34.png"]
}
```

#### Update Car (Protected - Owner/Admin Only)
```http
PUT /api/cars/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 160000,
  "mileage": 50000
}
```

#### Delete Car (Protected - Owner/Admin Only)
```http
DELETE /api/cars/:id
Authorization: Bearer {token}
```

### Upload Endpoints

#### Upload Image
```http
POST /api/upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData: image (file)
```

### Health Check
```http
GET /api/health

Response:
{
  "status": "OK",
  "timestamp": "2026-05-26T10:00:00.000Z"
}
```

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### Authentication Flow
- [ ] Register new user
- [ ] Login with credentials
- [ ] Access protected routes
- [ ] Update profile information
- [ ] Change password
- [ ] Logout

#### Car Marketplace Flow
- [ ] Browse cars on Buy page
- [ ] Search cars by keyword
- [ ] Filter by brand, year, price
- [ ] View car details in modal
- [ ] Add cars to favorites
- [ ] Compare multiple cars

#### Seller Flow
- [ ] Create new car listing
- [ ] Upload car images
- [ ] View listings in Garage
- [ ] Edit car details
- [ ] Toggle active/inactive status
- [ ] Delete car listing

#### Error Handling
- [ ] Test with backend offline (fallback to constants)
- [ ] Test unauthorized access (redirect to login)
- [ ] Test invalid form inputs (validation errors)
- [ ] Test expired JWT token

### API Testing with curl

**Health Check:**
```bash
curl http://localhost:5001/api/health
```

**Get All Cars:**
```bash
curl http://localhost:5001/api/cars
```

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Automated Testing

```bash
# Backend tests
cd "zora-jdm Backend"
npm test

# Frontend tests
cd "zora-jdm Frontend"
npm test
```

---

## 📊 Development Progress

### ✅ Completed Phases (100%)

#### Phase A: Contract Stabilization
- ✅ API contracts defined and stable
- ✅ Frontend-backend integration working
- ✅ Data models finalized

#### Phase B: Core Marketplace Real Data
- ✅ BuyCar page fetches from API with fallback
- ✅ PopularCars displays first 6 cars from database
- ✅ SellCar submits to API with real image upload
- ✅ Garage page with full CRUD operations
- ✅ Edit, delete, toggle active/inactive functionality

#### Phase C: Profile & Password Real Flow
- ✅ UserProfile fetches from `/api/auth/me`
- ✅ Profile update via `/api/auth/profile`
- ✅ Change password via `/api/auth/change-password`
- ✅ Fallback to localStorage if API fails

#### Phase D: Security Hardening
- ✅ Helmet.js for HTTP security headers
- ✅ Rate limiting (100 req/15min general, 50 req/15min auth)
- ✅ JWT validation (no fallback)
- ✅ Environment variable validation on startup
- ✅ Ownership checks (only owner/admin can modify)
- ✅ Comprehensive input validation
- ✅ Authentication required for protected routes

### 🎯 Optional Enhancements (Future)

#### Phase 7: Deployment
- [ ] Deploy backend to Railway/Heroku/Render
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Setup production MongoDB
- [ ] Configure production environment variables
- [ ] Setup custom domain
- [ ] Setup SSL certificate
- [ ] Setup CI/CD pipeline

#### Additional Features
- [ ] Email verification
- [ ] Password reset via email
- [ ] Advanced search (full-text search)
- [ ] User reviews and ratings
- [ ] Admin dashboard
- [ ] Analytics and monitoring
- [ ] Image optimization (WebP)
- [ ] SEO optimization

---

## 🔒 Security

### Implemented Security Measures

1. **Helmet.js**: Sets secure HTTP headers
2. **Rate Limiting**: Prevents brute force attacks
3. **JWT Authentication**: Secure token-based auth
4. **Password Hashing**: bcrypt with 10 salt rounds
5. **Ownership Validation**: Users can only modify their own data
6. **Input Validation**: Comprehensive validation on all inputs
7. **Environment Validation**: Required env vars checked on startup
8. **CORS Configuration**: Restricted to allowed origins

### Security Best Practices

- ✅ Never commit `.env` files to git
- ✅ Use strong JWT_SECRET (minimum 32 characters)
- ✅ Whitelist specific IPs in MongoDB Atlas (not 0.0.0.0/0 in production)
- ✅ Use HTTPS in production
- ✅ Regularly update dependencies
- ✅ Enable MongoDB Atlas encryption at rest
- ✅ Use environment-specific configurations

---

## ⚡ Performance

### Build Metrics

**Frontend (Production Build):**
- Main bundle: ~386 kB (gzip: ~123 kB)
- CSS: ~63 kB (gzip: ~10 kB)
- Total chunks: 19 files
- Build time: ~2-3 seconds
- Code splitting: ✅ Enabled
- Lazy loading: ✅ Enabled

**Backend:**
- Response time: <100ms for most queries
- Database connection: Stable
- Memory usage: Optimized

### Optimization Techniques

- ✅ Code splitting with React.lazy
- ✅ Image lazy loading
- ✅ CSS animations (no heavy libraries)
- ✅ Pagination (12 items per page)
- ✅ Efficient database queries
- ✅ Gzip compression
- ✅ Minification and tree-shaking

---

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)

1. **Create account** on Railway or Heroku
2. **Create new project**
3. **Connect GitHub repository**
4. **Set environment variables**:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your frontend URL)
5. **Deploy** from main branch

### Frontend Deployment (Vercel/Netlify)

1. **Create account** on Vercel or Netlify
2. **Import project** from GitHub
3. **Configure build settings**:
   - Build command: `npm run build`
   - Output directory: `dist`
4. **Set environment variables**:
   - `VITE_API_URL` (your backend URL)
5. **Deploy**

### Production Checklist

- [ ] Update CORS origins to production URLs
- [ ] Use strong JWT_SECRET
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Setup SSL certificates
- [ ] Configure custom domain
- [ ] Enable error logging
- [ ] Setup monitoring (e.g., Sentry)
- [ ] Test all features in production
- [ ] Setup automated backups

---

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
**Problem**: `MONGODB_URI is undefined`  
**Solution**: Check `.env` file exists and has correct MongoDB connection string

**Problem**: `Port 5001 already in use`  
**Solution**: Change PORT in `.env` or kill process using port 5001

#### Frontend can't connect to backend
**Problem**: `Failed to fetch`  
**Solution**: 
- Check backend is running on correct port
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS configuration in backend

#### Images not displaying
**Problem**: Car images not showing  
**Solution**:
- Check images exist in `public/cars/` folder
- Verify image paths in database match filenames
- Check browser console for 404 errors
- Run seed script: `node seed-cars.js`

#### MongoDB connection failed
**Problem**: `querySrv ECONNREFUSED`  
**Solution**: Use standard (non-SRV) connection string format

**Problem**: `Authentication failed`  
**Solution**: 
- Verify username and password in connection string
- Check user has correct permissions in MongoDB Atlas
- Ensure IP is whitelisted

#### JWT token expired
**Problem**: `401 Unauthorized`  
**Solution**: Login again to get new token

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Coding Standards

- Use TypeScript for type safety
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

---

## 👨‍💻 Author

**Muhammad Fadil Faiz**
- Email: mfadilfaiz17@gmail.com
- GitHub: [@mfadilfaiz17](https://github.com/mfadilfaiz17)

---

## 🙏 Acknowledgments

- Car images and data inspired by real JDM legends
- Design inspired by cyberpunk aesthetics
- Built with modern web technologies
- Special thanks to the JDM community

---

## 📞 Support

For support:
- Open an issue on GitHub
- Email: mfadilfaiz17@gmail.com

---

**Made with ❤️ for JDM enthusiasts**

🏁 Happy car hunting! 🏁
