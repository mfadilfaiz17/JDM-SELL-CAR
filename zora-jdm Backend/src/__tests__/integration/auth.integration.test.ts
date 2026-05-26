/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Integration Tests for Authentication Flow
 * 
 * These tests verify the complete authentication workflow:
 * 1. User Registration
 * 2. User Login
 * 3. Token Generation
 * 4. Protected Routes
 * 5. Password Change
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:5001/api';

// Test data
const testUser = {
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  role: 'buyer'
};

let authToken: string;
let userId: string;

/**
 * Helper function to make API calls
 */
async function apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error: any = await response.json();
    throw new Error(`API Error: ${response.status} - ${error?.message || response.statusText}`);
  }

  return response.json() as Promise<any>;
}

describe('Authentication Integration Tests', () => {
  describe('User Registration Flow', () => {
    test('should register a new user successfully', async () => {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: testUser.name,
          email: testUser.email,
          password: testUser.password,
          role: testUser.role
        })
      });

      expect(response).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.user.email).toBe(testUser.email);
      expect(response.token).toBeDefined();

      // Store for later tests
      authToken = response.token;
      userId = response.user.id;
    });

    test('should reject duplicate email registration', async () => {
      try {
        await apiCall('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Another User',
            email: testUser.email,
            password: 'Password123!',
            role: 'seller'
          })
        });
        throw new Error('Should have thrown error for duplicate email');
      } catch (error: any) {
        expect(error.message).toContain('API Error');
      }
    });

    test('should validate email format', async () => {
      try {
        await apiCall('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Test User',
            email: 'invalid-email',
            password: 'Password123!',
            role: 'buyer'
          })
        });
        throw new Error('Should have thrown error for invalid email');
      } catch (error: any) {
        expect(error.message).toContain('API Error');
      }
    });

    test('should validate password strength', async () => {
      try {
        await apiCall('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Test User',
            email: `test-weak-${Date.now()}@example.com`,
            password: '123',
            role: 'buyer'
          })
        });
        throw new Error('Should have thrown error for weak password');
      } catch (error: any) {
        expect(error.message).toContain('API Error');
      }
    });
  });

  describe('User Login Flow', () => {
    test('should login user with correct credentials', async () => {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });

      expect(response).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.user.email).toBe(testUser.email);
      expect(response.token).toBeDefined();

      // Update token
      authToken = response.token;
    });

    test('should reject login with incorrect password', async () => {
      try {
        await apiCall('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: testUser.email,
            password: 'WrongPassword123!'
          })
        });
        throw new Error('Should have thrown error for incorrect password');
      } catch (error: any) {
        expect(error.message).toContain('API Error');
      }
    });

    test('should reject login with non-existent email', async () => {
      try {
        await apiCall('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: 'nonexistent@example.com',
            password: 'Password123!'
          })
        });
        throw new Error('Should have thrown error for non-existent user');
      } catch (error: any) {
        expect(error.message).toContain('API Error');
      }
    });
  });

  describe('Protected Routes', () => {
    test('should get user profile with valid token', async () => {
      const response = await apiCall('/auth/me');

      expect(response).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.user.email).toBe(testUser.email);
    });

    test('should reject request without token', async () => {
      const token = authToken;
      authToken = ''; // Clear token

      try {
        await apiCall('/auth/me');
        authToken = token; // Restore token
        throw new Error('Should have thrown error without token');
      } catch (error: any) {
        authToken = token; // Restore token
        expect(error.message).toContain('API Error');
      }
    });

    test('should reject request with invalid token', async () => {
      const token = authToken;
      authToken = 'invalid-token-xyz';

      try {
        await apiCall('/auth/me');
        authToken = token; // Restore token
        throw new Error('Should have thrown error with invalid token');
      } catch (error: any) {
        authToken = token; // Restore token
        expect(error.message).toContain('API Error');
      }
    });
  });

  describe('Password Management', () => {
    test('should change password successfully', async () => {
      const newPassword = 'NewPassword123!';

      const response = await apiCall('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          oldPassword: testUser.password,
          newPassword: newPassword
        })
      });

      expect(response).toBeDefined();

      // Update test user password
      testUser.password = newPassword;
    });

    test('should reject password change with wrong old password', async () => {
      try {
        await apiCall('/auth/change-password', {
          method: 'POST',
          body: JSON.stringify({
            oldPassword: 'WrongPassword123!',
            newPassword: 'AnotherPassword123!'
          })
        });
        throw new Error('Should have thrown error with wrong old password');
      } catch (error: any) {
        expect(error.message).toContain('API Error');
      }
    });
  });

  describe('Cleanup', () => {
    test('should cleanup test user', async () => {
      // This is optional - depends on your delete user endpoint
      if (userId) {
        try {
          await apiCall(`/users/${userId}`, {
            method: 'DELETE'
          });
        } catch (error) {
          console.log('Cleanup note: Could not delete user');
        }
      }
    });
  });
});
