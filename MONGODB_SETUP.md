# MongoDB Atlas Setup Guide

## Masalah: querySrv ECONNREFUSED

Jika Anda mendapatkan error `querySrv ECONNREFUSED`, ikuti langkah-langkah di bawah:

### 1. Whitelist IP Address

**Langkah:**
1. Login ke [MongoDB Atlas](https://cloud.mongodb.com)
2. Pilih Project Anda
3. Klik **"Network Access"** di sidebar kiri
4. Klik **"Add IP Address"**
5. Pilih **"Allow Access from Anywhere"** dan masukkan `0.0.0.0/0`
6. Klik **"Confirm"**
7. Tunggu 5-10 menit agar perubahan berlaku

### 2. Verifikasi Connection String

Connection string harus dalam format:
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

**Contoh:**
```
mongodb+srv://faiz:faiz123@cluster0.n9a8nuf.mongodb.net/zora_jdm_db?retryWrites=true&w=majority
```

**Penting:**
- Ganti `faiz` dengan username Anda
- Ganti `faiz123` dengan password Anda (URL encode jika ada karakter spesial)
- Ganti `cluster0.n9a8nuf` dengan cluster name Anda
- Ganti `zora_jdm_db` dengan database name Anda

### 3. Dapatkan Connection String dari MongoDB Atlas

1. Login ke MongoDB Atlas
2. Klik **"Connect"** pada cluster Anda
3. Pilih **"Drivers"**
4. Pilih **"Node.js"**
5. Copy connection string
6. Paste ke file `.env` di variable `MONGODB_URI`

### 4. Test Koneksi

Jalankan test script:
```bash
node test-mongodb.js
```

Jika berhasil, Anda akan melihat:
```
✅ MongoDB Connected Successfully!
📊 Database: zora_jdm_db
🔗 Host: cluster0.n9a8nuf.mongodb.net
```

### 5. Jika Masih Error

**Cek beberapa hal:**

1. **Username/Password salah?**
   - Pastikan Anda menggunakan database user, bukan account user
   - Jika password mengandung karakter spesial (@, #, $, dll), URL encode-nya
   - Contoh: `@` menjadi `%40`, `#` menjadi `%23`

2. **Firewall/Antivirus memblokir?**
   - Coba disable firewall sementara untuk test
   - Atau tambahkan exception untuk Node.js

3. **ISP memblokir DNS?**
   - Coba gunakan DNS publik: 8.8.8.8 atau 1.1.1.1
   - Atau gunakan connection string tanpa SRV (lihat di bawah)

### 6. Alternative: Connection String Tanpa SRV

Jika SRV tidak bekerja, coba format ini:

```
mongodb://username:password@cluster0-shard-00-00.mongodb.net:27017,cluster0-shard-00-01.mongodb.net:27017,cluster0-shard-00-02.mongodb.net:27017/database-name?ssl=true&replicaSet=atlas-xxxxx&authSource=admin&retryWrites=true&w=majority
```

Dapatkan dari MongoDB Atlas:
1. Klik **"Connect"**
2. Pilih **"Drivers"**
3. Pilih **"Node.js"**
4. Klik **"I'm using MongoDB 3.6 or later"** untuk melihat format alternatif

## Setelah Berhasil Connect

Jalankan server:
```bash
npm run dev
```

Anda akan melihat:
```
✅ MongoDB Atlas Connected Successfully
🚀 Server is running at http://localhost:5000
```

## Test API

Buka browser atau gunakan curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all cars
curl http://localhost:5000/api/cars

# Get all users
curl http://localhost:5000/api/users
```

## Bantuan Lebih Lanjut

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/)
- [Network Access](https://docs.atlas.mongodb.com/security-whitelist/)
