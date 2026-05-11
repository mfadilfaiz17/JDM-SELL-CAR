import { useState } from 'react';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percentage: 0 });
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      // Validate file
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      }

      if (file.size > maxSize) {
        throw new Error('File size exceeds 5MB limit.');
      }

      // Convert to base64
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            const token = localStorage.getItem('authToken');

            const response = await fetch('http://localhost:5000/api/upload/image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                image: base64,
                filename: file.name,
              }),
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || 'Upload failed');
            }

            const data = await response.json();
            setProgress({ loaded: file.size, total: file.size, percentage: 100 });
            setIsUploading(false);
            resolve(data.imagePath);
          } catch (err: any) {
            setError(err.message);
            setIsUploading(false);
            reject(err);
          }
        };

        reader.onerror = () => {
          const err = new Error('Failed to read file');
          setError(err.message);
          setIsUploading(false);
          reject(err);
        };

        reader.readAsDataURL(file);
      });
    } catch (err: any) {
      setError(err.message);
      setIsUploading(false);
      return null;
    }
  };

  const deleteImage = async (imagePath: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch('http://localhost:5000/api/upload/image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ imagePath }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Delete failed');
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    isUploading,
    progress,
    error,
  };
}
