# 📸 Image Implementation Summary

## Components Created

### 1. ImageUpload Component
**File**: `src/components/ImageUpload.tsx`

Untuk upload gambar mobil dengan preview.

**Features:**
- ✅ Multiple image upload (max 5)
- ✅ File validation (type & size)
- ✅ Base64 encoding
- ✅ Image preview grid
- ✅ Remove individual images
- ✅ Error handling

**Usage:**
```typescript
import ImageUpload from '@/components/ImageUpload';

<ImageUpload 
  onImagesChange={(images) => setFormData({...formData, images})}
  maxImages={5}
  maxSizeMB={5}
/>
```

### 2. ImageGallery Component
**File**: `src/components/ImageGallery.tsx`

Untuk menampilkan gallery gambar dengan navigation.

**Features:**
- ✅ Main image display
- ✅ Thumbnail strip
- ✅ Previous/Next navigation
- ✅ Fullscreen mode
- ✅ Image counter
- ✅ Smooth animations

**Usage:**
```typescript
import ImageGallery from '@/components/ImageGallery';

<ImageGallery 
  images={car.images}
  title={`${car.brand} ${car.model}`}
  className="h-96"
/>
```

### 3. Updated CarModal
**File**: `src/components/CarModal.tsx`

Integrated ImageGallery untuk menampilkan gambar mobil.

## Image Specifications

### Recommended Sizes

| Use Case | Dimensions | Aspect Ratio | Max Size |
|----------|-----------|--------------|----------|
| Thumbnail | 200x150px | 4:3 | 100KB |
| Gallery | 800x600px | 4:3 | 500KB |
| Fullscreen | 1920x1440px | 4:3 | 2MB |
| Card | 400x300px | 4:3 | 300KB |

### File Requirements

- **Format**: JPG, PNG, WebP
- **Max per file**: 5MB
- **Max per car**: 5 images
- **Aspect ratio**: 4:3 recommended

## Implementation Steps

### Step 1: Update SellCar Page

```typescript
import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { apiClient } from '@/api/client';

export function SellCar() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: 2024,
    price: 0,
    mileage: 0,
    condition: 'good',
    fuelType: 'petrol',
    transmission: 'manual',
    color: '',
    description: '',
    images: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      alert('Minimal 1 gambar harus diupload');
      return;
    }

    try {
      const currentUser = JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );

      const car = await apiClient.cars.create({
        ...formData,
        seller: currentUser._id
      });

      alert('Mobil berhasil dijual!');
      // Redirect to garage or success page
    } catch (error) {
      alert('Gagal menjual mobil');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      {/* Brand */}
      <div>
        <label className="block text-sm font-semibold mb-2">Brand</label>
        <input
          type="text"
          required
          value={formData.brand}
          onChange={(e) => setFormData({...formData, brand: e.target.value})}
          className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded text-white"
          placeholder="Toyota, Honda, Nissan..."
        />
      </div>

      {/* Model */}
      <div>
        <label className="block text-sm font-semibold mb-2">Model</label>
        <input
          type="text"
          required
          value={formData.model}
          onChange={(e) => setFormData({...formData, model: e.target.value})}
          className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded text-white"
          placeholder="Supra, Civic, Skyline..."
        />
      </div>

      {/* Year */}
      <div>
        <label className="block text-sm font-semibold mb-2">Tahun</label>
        <input
          type="number"
          required
          value={formData.year}
          onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
          className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded text-white"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold mb-2">Harga (Rp)</label>
        <input
          type="number"
          required
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
          className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded text-white"
        />
      </div>

      {/* Mileage */}
      <div>
        <label className="block text-sm font-semibold mb-2">Kilometer</label>
        <input
          type="number"
          required
          value={formData.mileage}
          onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value)})}
          className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded text-white"
        />
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-semibold mb-2">Kondisi</label>
        <select
          value={formData.condition}
          onChange={(e) => setFormData({...formData, condition: e.target.value as any})}
          className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded text-white"
        >
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-sm font-semibold mb-2">Tipe Bahan Bakar</label>
        <select
          value={formData.fuelType}
          onChange={(e) => setFormData({...formData, fuelType: e.target.value as any})}
          className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded text-white"
        >
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
          <option value="electric">Electric</option>
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-semibold mb-2">Transmisi</label>
        <select
          value={formData.transmission}
          onChange={(e) => setFormData({...formData, transmission: e.target.value as any})}
          className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded text-white"
        >
          <option value="manual">Manual</option>
          <option value="automatic">Automatic</option>
        </select>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-semibold mb-2">Warna</label>
        <input
          type="text"
          required
          value={formData.color}
          onChange={(e) => setFormData({...formData, color: e.target.value})}
          className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded text-white"
          placeholder="Red, Blue, Black..."
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-2">Deskripsi</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded text-white h-24"
          placeholder="Deskripsi mobil Anda..."
        />
      </div>

      {/* Images Upload */}
      <div>
        <label className="block text-sm font-semibold mb-2">Gambar Mobil</label>
        <ImageUpload 
          onImagesChange={(images) => 
            setFormData({...formData, images})
          }
          maxImages={5}
          maxSizeMB={5}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-cyan-500 text-black font-bold py-3 rounded hover:bg-cyan-600 transition-colors"
      >
        Jual Mobil
      </button>
    </form>
  );
}
```

### Step 2: Update BuyCar Page

```typescript
import { useEffect, useState } from 'react';
import ImageGallery from '@/components/ImageGallery';
import { apiClient } from '@/api/client';

export function BuyCar() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await apiClient.cars.getAll();
        setCars(data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Beli Mobil JDM</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car: any) => (
          <div
            key={car._id}
            className="border border-white/10 rounded overflow-hidden hover:border-cyan-500 transition-all cursor-pointer"
            onClick={() => setSelectedCar(car)}
          >
            {/* Image Gallery */}
            <ImageGallery 
              images={car.images || []}
              title={`${car.brand} ${car.model}`}
              className="h-48"
            />

            {/* Info */}
            <div className="p-4">
              <h3 className="text-lg font-bold">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm text-gray-500">{car.year}</p>
              <p className="text-xl font-bold mt-2">
                Rp {car.price.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {car.mileage.toLocaleString('id-ID')} km
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-white/10 rounded max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <button
              onClick={() => setSelectedCar(null)}
              className="float-right text-white hover:text-cyan-500"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedCar.brand} {selectedCar.model}
            </h2>

            <ImageGallery 
              images={selectedCar.images || []}
              title={`${selectedCar.brand} ${selectedCar.model}`}
              className="h-64 mb-4"
            />

            <div className="space-y-2">
              <p><strong>Tahun:</strong> {selectedCar.year}</p>
              <p><strong>Harga:</strong> Rp {selectedCar.price.toLocaleString('id-ID')}</p>
              <p><strong>Kilometer:</strong> {selectedCar.mileage.toLocaleString('id-ID')} km</p>
              <p><strong>Kondisi:</strong> {selectedCar.condition}</p>
              <p><strong>Bahan Bakar:</strong> {selectedCar.fuelType}</p>
              <p><strong>Transmisi:</strong> {selectedCar.transmission}</p>
              <p><strong>Warna:</strong> {selectedCar.color}</p>
              <p><strong>Deskripsi:</strong> {selectedCar.description}</p>
            </div>

            <button className="w-full bg-cyan-500 text-black font-bold py-2 mt-4 rounded hover:bg-cyan-600">
              Hubungi Penjual
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 3: Update Garage Page

```typescript
import { useEffect, useState } from 'react';
import ImageGallery from '@/components/ImageGallery';
import { apiClient } from '@/api/client';

export function Garage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCars = async () => {
      try {
        const currentUser = JSON.parse(
          localStorage.getItem('currentUser') || '{}'
        );

        const allCars = await apiClient.cars.getAll();
        const userCars = allCars.filter(
          (car: any) => car.seller === currentUser._id
        );

        setCars(userCars);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCars();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Garasi Saya</h1>

      {cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Anda belum menjual mobil apapun</p>
          <a href="/sell" className="bg-cyan-500 text-black px-6 py-2 rounded font-bold">
            Jual Mobil Sekarang
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car: any) => (
            <div
              key={car._id}
              className="border border-white/10 rounded overflow-hidden"
            >
              <ImageGallery 
                images={car.images || []}
                title={`${car.brand} ${car.model}`}
                className="h-48"
              />

              <div className="p-4">
                <h3 className="text-lg font-bold">
                  {car.brand} {car.model}
                </h3>
                <p className="text-xl font-bold text-cyan-500 mt-2">
                  Rp {car.price.toLocaleString('id-ID')}
                </p>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-cyan-500 text-black py-2 rounded font-bold hover:bg-cyan-600">
                    Edit
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded font-bold hover:bg-red-600">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Image Size Guidelines

### For Different Devices

**Mobile (320px - 640px)**
- Thumbnail: 150x112px
- Gallery: 320x240px

**Tablet (641px - 1024px)**
- Thumbnail: 200x150px
- Gallery: 600x450px

**Desktop (1025px+)**
- Thumbnail: 250x188px
- Gallery: 800x600px

### Optimization Tips

1. **Compress before upload**
   - Use TinyPNG, ImageOptim
   - Target: 200-400KB per image

2. **Use appropriate formats**
   - JPG: Photos (best compression)
   - PNG: Graphics (transparency)
   - WebP: Modern browsers (better compression)

3. **Responsive images**
   - Provide multiple sizes
   - Use srcset attribute

## Testing

### Test Upload
1. Go to SellCar page
2. Upload 1-5 images
3. Verify preview shows correctly
4. Submit form
5. Check images saved in database

### Test Display
1. Go to BuyCar page
2. Click on car with images
3. Verify gallery displays
4. Test navigation (prev/next)
5. Test fullscreen mode
6. Test thumbnail strip

### Test Garage
1. Go to Garage page
2. Verify your cars display with images
3. Test edit/delete functionality

## Troubleshooting

### Images not showing
- Check if images array is populated
- Verify image URLs are valid
- Check browser console for errors

### Upload fails
- Check file size (max 5MB)
- Verify file type is image
- Check browser storage limits

### Performance issues
- Compress images before upload
- Use lazy loading
- Implement pagination

## Next Steps

1. ✅ Create ImageUpload component
2. ✅ Create ImageGallery component
3. ✅ Update CarModal
4. ⏭️ Integrate with SellCar page
5. ⏭️ Integrate with BuyCar page
6. ⏭️ Integrate with Garage page
7. ⏭️ Add image compression
8. ⏭️ Setup cloud storage (optional)

---

**Happy uploading! 📸**
