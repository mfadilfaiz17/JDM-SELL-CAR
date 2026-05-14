# 🚀 Quick Start Guide - Zora JDM Backend

## ✅ Setup Selesai!

Backend Anda sudah siap digunakan dengan MongoDB Atlas.

## 📋 Informasi Server

- **URL**: http://localhost:5000
- **Environment**: development
- **Database**: MongoDB Atlas
- **API Version**: v1

## 🔌 API Endpoints

### Health & Info
- `GET /api/health` - Check server status
- `GET /api/version` - Get API version

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create new car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🏃 Menjalankan Server

### Development Mode
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000` dengan auto-reload.

### Production Mode
```bash
npm run build
npm start
```

## 📝 Testing API

### Menggunakan Node.js
```bash
node test-api.js
```

### Menggunakan Browser
Buka di browser:
```
http://localhost:5000/api/health
http://localhost:5000/api/cars
http://localhost:5000/api/users
```

### Menggunakan cURL
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/cars
curl http://localhost:5000/api/users
```

## 📊 Contoh Request

### Create User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": "Jakarta",
    "role": "seller"
  }'
```

### Create Car
```bash
curl -X POST http://localhost:5000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Supra",
    "year": 1995,
    "price": 500000000,
    "mileage": 50000,
    "condition": "excellent",
    "fuelType": "petrol",
    "transmission": "manual",
    "color": "Red",
    "description": "Classic JDM car",
    "seller": "USER_ID_HERE"
  }'
```

## 🔧 Environment Variables

File `.env` sudah dikonfigurasi dengan:
- `PORT=5000`
- `NODE_ENV=development`
- `MONGODB_URI=...` (MongoDB Atlas connection string)
- `FRONTEND_URL=http://localhost:3000`
- `API_VERSION=v1`

## 📚 Struktur Project

```
src/
├── index.ts              # Entry point
├── config/
│   └── database.ts       # MongoDB connection
├── models/
│   ├── Car.ts           # Car schema
│   └── User.ts          # User schema
└── routes/
    ├── cars.ts          # Car endpoints
    └── users.ts         # User endpoints
```

## 🐛 Troubleshooting

### Server tidak bisa connect ke MongoDB?
1. Pastikan IP address sudah di-whitelist di MongoDB Atlas
2. Verifikasi username dan password di `.env`
3. Cek koneksi internet Anda
4. Jalankan `node test-simple.js` untuk debug

### Port 5000 sudah digunakan?
Ubah `PORT` di file `.env` ke port lain, misalnya `5001`

### CORS error dari frontend?
Pastikan `FRONTEND_URL` di `.env` sesuai dengan URL frontend Anda

## 🚀 Next Steps

1. **Connect Frontend** - Update frontend untuk menggunakan API ini
2. **Add Authentication** - Implementasi JWT atau session-based auth
3. **Add Validation** - Tambahkan input validation untuk semua endpoints
4. **Add Error Handling** - Improve error messages dan logging
5. **Deploy** - Deploy ke production (Heroku, Railway, Vercel, dll)

## 📖 Dokumentasi Lengkap

- [README.md](./README.md) - Setup dan development guide
- [MONGODB_SETUP.md](./MONGODB_SETUP.md) - MongoDB troubleshooting
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)

---

**Happy Coding! 🎉**
