import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export default function ImageUpload({ 
  onImagesChange, 
  maxImages = 5,
  maxSizeMB = 5 
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError('');
    setIsLoading(true);

    try {
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Hanya file gambar yang diperbolehkan');
          continue;
        }

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`Ukuran file maksimal ${maxSizeMB}MB`);
          continue;
        }

        // Check max images
        if (images.length + newImages.length >= maxImages) {
          setError(`Maksimal ${maxImages} gambar`);
          break;
        }

        // Convert to base64
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onload = (event) => {
            const result = event.target?.result as string;
            newImages.push(result);
            resolve(null);
          };
          reader.readAsDataURL(file);
        });
      }

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (err) {
      setError('Gagal upload gambar');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed border-white/20 hover:border-cyan-500/50 rounded-lg p-8 cursor-pointer transition-all bg-white/5 hover:bg-white/10"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isLoading || images.length >= maxImages}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          {isLoading ? (
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-zinc-500" />
          )}
          <div className="text-center">
            <p className="text-sm font-semibold text-white">
              {isLoading ? 'Uploading...' : 'Klik untuk upload gambar'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              atau drag & drop (Max {maxImages} gambar, {maxSizeMB}MB per file)
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded"
        >
          {error}
        </motion.div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            {images.length}/{maxImages} Gambar
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="aspect-square bg-zinc-900 border border-white/10 rounded overflow-hidden">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Remove Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </motion.button>

                {/* Index Badge */}
                <div className="absolute bottom-1 left-1 bg-black/50 px-2 py-1 rounded text-[10px] font-mono text-white">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      {images.length === 0 && (
        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded text-center">
          <ImageIcon className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
          <p className="text-xs text-zinc-500">
            Belum ada gambar. Upload minimal 1 gambar untuk mobil Anda.
          </p>
        </div>
      )}
    </div>
  );
}
