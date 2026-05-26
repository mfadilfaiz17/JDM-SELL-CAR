# ⚡ Quick Start Guide - Zora JDM

## 🚀 Start Development (5 Minutes)

### 1. Backend
```bash
cd "zora-jdm Backend"
npm install
npm run dev
```
✅ Backend running on http://localhost:5001

### 2. Frontend
```bash
cd "zora-jdm Frontend"
npm install
npm run dev
```
✅ Frontend running on http://localhost:3000

---

## 🔑 Default Credentials

**Admin Account:**
- Email: `admin@zorajdm.com`
- Password: `Admin123!`

**Or register new account** at http://localhost:3000/register

---

## 📊 Current Status

✅ **Database**: `zora-jdm` (MongoDB Atlas)  
✅ **Backend Port**: 5001  
✅ **Frontend Port**: 3000  
✅ **20 Cars**: Seeded with correct images  
✅ **All Phases**: Complete (A, B, C, D)

---

## 🛠️ Useful Commands

### Backend
```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Seed database
node seed-cars.js

# Test connection
node test-connection.js
```

### Frontend
```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

---

## 📁 Important Files

### Configuration
- `zora-jdm Backend/.env` - Backend environment variables
- `zora-jdm Frontend/.env` - Frontend environment variables

### Database
- `zora-jdm Backend/seed-cars.js` - Seed 20 cars with images
- `zora-jdm Backend/test-connection.js` - Test MongoDB connection

### Documentation
- `README.md` - Complete documentation (THIS IS THE MAIN DOC)
- `QUICK_START.md` - This file (quick reference)

---

## 🔍 Quick Checks

### Is Backend Running?
```bash
curl http://localhost:5001/api/health
```
Should return: `{"status":"OK","timestamp":"..."}`

### Is Database Connected?
Check backend terminal for:
```
✅ MongoDB Atlas Connected Successfully
📊 Database Name: zora-jdm
```

### Are Cars Loaded?
```bash
curl http://localhost:5001/api/cars
```
Should return array of 20 cars

---

## 🐛 Quick Fixes

### Backend won't start
1. Check `.env` file exists in `zora-jdm Backend/`
2. Verify `MONGODB_URI` is set
3. Verify `JWT_SECRET` is set

### Frontend can't connect
1. Check backend is running on port 5001
2. Check `VITE_API_URL` in frontend `.env`
3. Hard refresh browser: `Ctrl + Shift + R`

### Images not showing
1. Check backend is connected to `zora-jdm` database (not `test`)
2. Run seed script: `node seed-cars.js`
3. Hard refresh browser: `Ctrl + Shift + R`

---

## 📚 Full Documentation

For complete documentation, see **README.md**

---

**Need help?** Check README.md or contact mfadilfaiz17@gmail.com
