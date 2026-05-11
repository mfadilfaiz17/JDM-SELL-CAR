import { useEffect, useState } from 'react';

/**
 * Hook untuk auto-load gambar mobil berdasarkan nama
 * Mencoba berbagai format nama file untuk fleksibilitas maksimal
 */
export const useCarImage = (famousName: string, providedImage: string | null) => {
  const [imagePath, setImagePath] = useState<string | null>(providedImage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);

      // Jika sudah ada gambar yang diberikan, cek apakah ada
      if (providedImage) {
        const exists = await checkImageExists(providedImage);
        if (exists) {
          setImagePath(providedImage);
          setIsLoading(false);
          return;
        }
      }

      // Coba berbagai format nama file
      const pathsToTry = [
        // Format 1: exact name dengan spasi (Skyline GT-R BNR34.png)
        `/cars/${famousName}.png`,
        // Format 2: lowercase dengan spasi (skyline gt-r bnr34.png)
        `/cars/${famousName.toLowerCase()}.png`,
        // Format 3: lowercase dengan dash (skyline-gt-r-bnr34.png)
        `/cars/${famousName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')}.png`,
        // Format 4: replace spasi dengan underscore (skyline_gt_r_bnr34.png)
        `/cars/${famousName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}.png`,
      ];

      for (const path of pathsToTry) {
        const exists = await checkImageExists(path);
        if (exists) {
          setImagePath(path);
          setIsLoading(false);
          return;
        }
      }

      // Jika tidak ada satupun, set null
      setImagePath(null);
      setIsLoading(false);
    };

    loadImage();
  }, [famousName, providedImage]);

  return { imagePath, isLoading };
};

/**
 * Fungsi untuk mengecek apakah gambar ada
 */
const checkImageExists = async (imagePath: string): Promise<boolean> => {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
