/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploadComponentProps {
  onImageUpload: (imagePath: string) => void;
  onImageDelete?: (imagePath: string) => void;
  maxImages?: number;
  label?: string;
}

export default function ImageUploadComponent({
  onImageUpload,
  onImageDelete,
  maxImages = 1,
  label = 'Upload Image',
}: ImageUploadComponentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const { uploadImage, deleteImage, isUploading, progress, error } = useImageUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      if (uploadedImages.length >= maxImages) {
        alert(`Maximum ${maxImages} image(s) allowed`);
        break;
      }

      const file = files[i];

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setPreviewImages((prev) => [...prev, preview]);
      };
      reader.readAsDataURL(file);

      // Upload image
      try {
        const imagePath = await uploadImage(file);
        if (imagePath) {
          setUploadedImages((prev) => [...prev, imagePath]);
          onImageUpload(imagePath);
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imagePath = uploadedImages[index];

    // Delete from server
    if (onImageDelete) {
      onImageDelete(imagePath);
    }

    // Remove from local state
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-3">
          {label}
        </label>

        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 hover:border-cyan-500/50 transition-all p-8 cursor-pointer bg-white/5 hover:bg-white/10 rounded-lg"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <Upload className="w-8 h-8 text-zinc-600" />
            <div className="text-center">
              <p className="text-sm font-mono text-white uppercase tracking-widest">
                Click to upload or drag and drop
              </p>
              <p className="text-[9px] font-mono text-zinc-600 mt-1">
                PNG, JPG, GIF, WebP up to 5MB
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 border border-red-500/50 bg-red-500/10 text-red-400 text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 space-y-2"
          >
            <div className="flex justify-between text-[9px] font-mono text-zinc-600">
              <span>Uploading...</span>
              <span>{progress.percentage}%</span>
            </div>
            <div className="h-2 bg-zinc-900 border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                className="h-full bg-cyan-500"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
            Uploaded Images ({uploadedImages.length}/{maxImages})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewImages.map((preview, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="aspect-square bg-zinc-900 border border-white/10 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Upload Status */}
                {uploadedImages[index] && (
                  <div className="absolute bottom-1 left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
