import { Router, Request, Response } from 'express';
import { saveBase64Image, deleteImage, validateImageFile } from '../middleware/upload.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Upload image endpoint
router.post('/image', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { image, filename } = req.body;

    if (!image || !filename) {
      return res.status(400).json({ error: 'Image and filename are required' });
    }

    // Validate image
    const file = {
      mimetype: image.split(';')[0].replace('data:', ''),
      size: Buffer.byteLength(image, 'base64'),
    };

    if (!validateImageFile(file)) {
      return res.status(400).json({ error: 'Invalid image file' });
    }

    // Save image
    const imagePath = saveBase64Image(image, filename);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imagePath,
      url: `${process.env.API_URL || 'http://localhost:5000'}${imagePath}`,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
});

// Delete image endpoint
router.delete('/image', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({ error: 'Image path is required' });
    }

    deleteImage(imagePath);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete image' });
  }
});

export default router;
