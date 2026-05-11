/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { validateImageFile } from '../../middleware/upload.js';

describe('Upload Middleware', () => {
  describe('Image Validation', () => {
    test('should accept valid JPEG image', () => {
      const file = {
        mimetype: 'image/jpeg',
        size: 1024 * 1024, // 1MB
      };
      expect(validateImageFile(file)).toBe(true);
    });

    test('should accept valid PNG image', () => {
      const file = {
        mimetype: 'image/png',
        size: 2 * 1024 * 1024, // 2MB
      };
      expect(validateImageFile(file)).toBe(true);
    });

    test('should accept valid GIF image', () => {
      const file = {
        mimetype: 'image/gif',
        size: 512 * 1024, // 512KB
      };
      expect(validateImageFile(file)).toBe(true);
    });

    test('should accept valid WebP image', () => {
      const file = {
        mimetype: 'image/webp',
        size: 3 * 1024 * 1024, // 3MB
      };
      expect(validateImageFile(file)).toBe(true);
    });

    test('should reject invalid file type', () => {
      const file = {
        mimetype: 'application/pdf',
        size: 1024 * 1024,
      };
      expect(validateImageFile(file)).toBe(false);
    });

    test('should reject file exceeding size limit', () => {
      const file = {
        mimetype: 'image/jpeg',
        size: 10 * 1024 * 1024, // 10MB (exceeds 5MB limit)
      };
      expect(validateImageFile(file)).toBe(false);
    });

    test('should reject null file', () => {
      expect(validateImageFile(null)).toBe(false);
    });

    test('should reject undefined file', () => {
      expect(validateImageFile(undefined)).toBe(false);
    });

    test('should accept file at size limit', () => {
      const file = {
        mimetype: 'image/jpeg',
        size: 5 * 1024 * 1024, // Exactly 5MB
      };
      expect(validateImageFile(file)).toBe(true);
    });

    test('should reject file just over size limit', () => {
      const file = {
        mimetype: 'image/jpeg',
        size: 5 * 1024 * 1024 + 1, // 5MB + 1 byte
      };
      expect(validateImageFile(file)).toBe(false);
    });
  });

  describe('File Size Validation', () => {
    test('should accept small files', () => {
      const file = {
        mimetype: 'image/jpeg',
        size: 100 * 1024, // 100KB
      };
      expect(validateImageFile(file)).toBe(true);
    });

    test('should accept medium files', () => {
      const file = {
        mimetype: 'image/png',
        size: 2.5 * 1024 * 1024, // 2.5MB
      };
      expect(validateImageFile(file)).toBe(true);
    });

    test('should reject very large files', () => {
      const file = {
        mimetype: 'image/jpeg',
        size: 50 * 1024 * 1024, // 50MB
      };
      expect(validateImageFile(file)).toBe(false);
    });
  });

  describe('MIME Type Validation', () => {
    test('should reject text files', () => {
      const file = {
        mimetype: 'text/plain',
        size: 1024,
      };
      expect(validateImageFile(file)).toBe(false);
    });

    test('should reject video files', () => {
      const file = {
        mimetype: 'video/mp4',
        size: 1024 * 1024,
      };
      expect(validateImageFile(file)).toBe(false);
    });

    test('should reject audio files', () => {
      const file = {
        mimetype: 'audio/mpeg',
        size: 1024 * 1024,
      };
      expect(validateImageFile(file)).toBe(false);
    });

    test('should reject executable files', () => {
      const file = {
        mimetype: 'application/x-msdownload',
        size: 1024 * 1024,
      };
      expect(validateImageFile(file)).toBe(false);
    });
  });
});
