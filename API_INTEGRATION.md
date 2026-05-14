# 🔗 Frontend-Backend Integration Guide

## Setup

### 1. Environment Variables

Buat atau update file `.env` di folder `zora-jdm Frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

Untuk production, ubah ke URL backend production Anda.

### 2. API Client

API client sudah tersedia di `src/api/client.ts`. Gunakan untuk semua komunikasi dengan backend.

## 📚 Cara Menggunakan API Client

### Import
```typescript
import { apiClient } from '@/api/client';
```

### Health Check
```typescript
const health = await apiClient.health();
console.log(health); // { status: 'OK', timestamp: '...' }
```

### Get All Cars
```typescript
const cars = await apiClient.cars.getAll();
console.log(cars); // Array of cars
```

### Get Car by ID
```typescript
const car = await apiClient.cars.getById('car-id');
console.log(car); // Car object
```

### Create Car
```typescript
const newCar = await apiClient.cars.create({
  brand: 'Toyota',
  model: 'Supra',
  year: 1995,
  price: 500000000,
  mileage: 50000,
  condition: 'excellent',
  fuelType: 'petrol',
  transmission: 'manual',
  color: 'Red',
  description: 'Classic JDM car',
  seller: 'user-id-here'
});
```

### Update Car
```typescript
const updatedCar = await apiClient.cars.update('car-id', {
  price: 450000000,
  mileage: 55000
});
```

### Delete Car
```typescript
await apiClient.cars.delete('car-id');
```

### Get All Users
```typescript
const users = await apiClient.users.getAll();
```

### Create User
```typescript
const newUser = await apiClient.users.create({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '08123456789',
  address: 'Jakarta',
  role: 'seller'
});
```

## 🎯 Contoh Implementasi di Component

### React Component dengan API Call

```typescript
import { useEffect, useState } from 'react';
import { apiClient } from '@/api/client';

export function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await apiClient.cars.getAll();
        setCars(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {cars.map(car => (
        <div key={car._id}>
          <h3>{car.brand} {car.model}</h3>
          <p>Price: Rp {car.price.toLocaleString('id-ID')}</p>
          <p>Year: {car.year}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Error Handling

API client akan throw error jika request gagal. Selalu gunakan try-catch:

```typescript
try {
  const cars = await apiClient.cars.getAll();
} catch (error) {
  console.error('Failed to fetch cars:', error);
  // Handle error - show toast, alert, etc
}
```

## 🚀 Running Both Frontend & Backend

### Terminal 1 - Backend
```bash
cd "zora-jdm Backend"
npm run dev
```

### Terminal 2 - Frontend
```bash
cd "zora-jdm Frontend"
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`
Backend akan berjalan di `http://localhost:5000`

## 📝 API Response Format

### Success Response
```json
{
  "_id": "...",
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
  "seller": "user-id",
  "createdAt": "2026-05-06T21:20:56.589Z",
  "updatedAt": "2026-05-06T21:20:56.589Z"
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## 🔐 CORS Configuration

Backend sudah dikonfigurasi untuk accept requests dari frontend di `http://localhost:3000`.

Untuk production, update `FRONTEND_URL` di backend `.env`:
```env
FRONTEND_URL=https://your-frontend-domain.com
```

## 📚 Dokumentasi Lengkap

- [Backend README](../zora-jdm%20Backend/README.md)
- [Backend Quick Start](../zora-jdm%20Backend/QUICK_START.md)
- [MongoDB Setup](../zora-jdm%20Backend/MONGODB_SETUP.md)

---

**Happy Coding! 🎉**
