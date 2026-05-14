# 🏎️ ZORA JDM - Japanese Domestic Market Car Marketplace

A modern, full-stack web application for buying and selling JDM (Japanese Domestic Market) cars. Built with React, TypeScript, Node.js, and MongoDB.

![Version](https://img.shields.io/badge/version-3.1.4-blue.svg)
![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

## ✨ Features

### 🚗 Car Marketplace
- **Browse Inventory**: View 20+ iconic JDM cars with detailed specifications
- **Advanced Search**: Filter by brand, model, year, price, condition, and fuel type
- **Car Comparison**: Compare up to 3 cars side-by-side
- **Favorites System**: Save your favorite cars for later
- **Pagination**: Smooth browsing with 12 cars per page

### 📊 Performance Stats
Each car includes realistic performance metrics:
- **Acceleration** (0-100): Speed rating
- **Handling** (0-100): Cornering ability
- **Mod Priority** (0-100): Tuning popularity

### 🔐 User Authentication
- Secure JWT-based authentication
- User registration and login
- Protected routes for authenticated users
- Profile management

### 💼 User Features
- **Personal Garage**: Manage your car listings
- **Sell Cars**: Create new listings with image upload
- **Edit/Delete**: Full CRUD operations on your listings
- **Favorites**: Quick access to saved cars

### 🎨 Modern UI/UX
- Cyberpunk-inspired design with cyan accents
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Dark theme optimized for viewing
- Industry-standard performance

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/zora-jdm.git
cd zora-jdm
```

### 2. Backend Setup
```bash
cd "zora-jdm Backend"
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (generate a secure random string)
# - PORT (default: 5001)

# Build and start
npm run build
npm start
```

### 3. Frontend Setup
```bash
cd "zora-jdm Frontend"
npm install

# Create .env file (optional)
cp .env.example .env

# Start development server
npm run dev

# Or build for production
npm run build
npm run preview
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001
- **API Health**: http://localhost:5001/api/health

## 🚀 Quick Start

### Development Mode
```bash
# Terminal 1 - Backend
cd "zora-jdm Backend"
npm run dev

# Terminal 2 - Frontend  
cd "zora-jdm Frontend"
npm run dev
```

### Production Build
```bash
# Backend
cd "zora-jdm Backend"
npm run build
npm start

# Frontend
cd "zora-jdm Frontend"
npm run build
npm run preview
```

## 📁 Project Structure

```
zora-jdm/
├── zora-jdm Backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Auth, upload middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Entry point
│   ├── .env.example        # Environment template
│   └── package.json
│
├── zora-jdm Frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── api/            # API client
│   │   ├── constants.ts    # Car data & types
│   │   └── App.tsx         # Main app
│   ├── public/
│   │   └── cars/           # Car images
│   └── package.json
│
└── Documentation/          # Project docs
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
API_VERSION=v1
```

### Frontend (.env) - Optional
```env
VITE_API_URL=http://localhost:5001
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create car (auth required)
- `PUT /api/cars/:id` - Update car (auth required)
- `DELETE /api/cars/:id` - Delete car (auth required)

### Users
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update profile (auth required)

### Health
- `GET /api/health` - API health check
- `GET /api/version` - API version

## 🎨 Car Collection

The app features 20 iconic JDM cars:

**Legendary Tier ($150k+)**
- Nissan Skyline GT-R BNR34 - $150k
- Honda NSX-R - $180k
- Subaru Impreza 22B-STi - $250k
- Toyota Supra JZA80 - $120k

**High Performance ($50k-$99k)**
- Mazda RX-7 FD3S - $65k
- Mitsubishi Lancer Evo IX - $55k
- Nissan Fairlady Z S30 - $75k
- Tommi Mäkinen Edition - $85k

**Enthusiast ($30k-$49k)**
- Toyota AE86 Trueno - $35k
- Nissan Silvia S15 - $40k
- Honda Civic Type R EK9 - $42k
- Honda Integra Type R - $45k
- Subaru WRX STi - $48k

**And more!** Including kei cars, drift sedans, and classic JDMs.

## 🔒 Security

- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Input validation
- ✅ Environment variables for secrets
- ⚠️ **IMPORTANT**: Never commit `.env` files to git!

## 📊 Performance

**Bundle Sizes (Production)**
- Main bundle: 385.69 kB (gzip: 123.15 kB)
- CSS: 63.15 kB (gzip: 9.89 kB)
- Total chunks: 19 files
- Code splitting: ✅ Enabled
- Lazy loading: ✅ Enabled

## 🧪 Testing

```bash
# Backend tests
cd "zora-jdm Backend"
npm test

# Frontend tests
cd "zora-jdm Frontend"
npm test
```

## 📝 Documentation

- [Development Checklist](DEVELOPMENT_CHECKLIST.md) - Progress tracking
- [API Integration](API_INTEGRATION.md) - API documentation
- [Car Performance Stats](CAR_PERFORMANCE_STATS.md) - Car data details
- [Quick Start Guide](QUICK_START.md) - Getting started
- [Optimization Summary](OPTIMIZATION_SUMMARY.md) - Performance improvements

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 👨‍💻 Author

**Faiz**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Car images and data inspired by real JDM legends
- Design inspired by cyberpunk aesthetics
- Built with modern web technologies

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

**Made with ❤️ for JDM enthusiasts**

🚗 Happy car hunting! 🏁
