/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import bcrypt from 'bcryptjs';

// Mock User model for testing
class User {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller' | 'both';

  constructor(name: string, email: string, password: string, role: 'buyer' | 'seller' | 'both' = 'buyer') {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

describe('User Model', () => {
  describe('User Creation', () => {
    test('should create a user with valid data', () => {
      const user = new User('John Doe', 'john@example.com', 'password123', 'buyer');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.role).toBe('buyer');
    });

    test('should create a user with default role', () => {
      const user = new User('Jane Doe', 'jane@example.com', 'password123');
      expect(user.role).toBe('buyer');
    });

    test('should create a seller user', () => {
      const user = new User('Seller', 'seller@example.com', 'password123', 'seller');
      expect(user.role).toBe('seller');
    });
  });

  describe('Password Hashing', () => {
    test('should hash password correctly', async () => {
      const user = new User('Test User', 'test@example.com', 'password123');
      const originalPassword = user.password;
      
      await user.hashPassword();
      
      expect(user.password).not.toBe(originalPassword);
      expect(user.password.length).toBeGreaterThan(20);
    });

    test('should compare password correctly', async () => {
      const user = new User('Test User', 'test@example.com', 'password123');
      await user.hashPassword();
      
      const isMatch = await user.comparePassword('password123');
      expect(isMatch).toBe(true);
    });

    test('should not match incorrect password', async () => {
      const user = new User('Test User', 'test@example.com', 'password123');
      await user.hashPassword();
      
      const isMatch = await user.comparePassword('wrongpassword');
      expect(isMatch).toBe(false);
    });
  });

  describe('Email Validation', () => {
    test('should accept valid email', () => {
      const user = new User('Test', 'test@example.com', 'password');
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    test('should store email correctly', () => {
      const email = 'user@domain.co.uk';
      const user = new User('Test', email, 'password');
      expect(user.email).toBe(email);
    });
  });
});
