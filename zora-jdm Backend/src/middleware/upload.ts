import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export interface UploadedFile {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
}

// Simple file upload middleware
export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  // This is a placeholder - in production, use multer
  // For now, we'll handle base64 encoded files from frontend
  next();
};

// Save base64 image to disk
export const saveBase64Image = (base64Data: string, filename: string): string => {
  try {
    // Remove data:image/jpeg;base64, prefix if present
    const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
    
    // Create unique filename
    const uniqueFilename = `${Date.now()}-${filename}`;
    const filepath = path.join(uploadsDir, uniqueFilename);
    
    // Write file
    fs.writeFileSync(filepath, Buffer.from(base64String, 'base64'));
    
    return `/uploads/${uniqueFilename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
};

// Delete image file
export const deleteImage = (imagePath: string): void => {
  try {
    if (imagePath && imagePath.startsWith('/uploads/')) {
      const filepath = path.join(uploadsDir, path.basename(imagePath));
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// Validate image file
export const validateImageFile = (file: any): boolean => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!file) return false;
  if (!allowedMimes.includes(file.mimetype)) return false;
  if (file.size > maxSize) return false;

  return true;
};
