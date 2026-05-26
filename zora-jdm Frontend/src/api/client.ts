// API Client untuk komunikasi dengan backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

export const apiClient = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Build URL dengan query parameters
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString();
      url += `?${queryString}`;
    }

    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (fetchOptions.headers && typeof fetchOptions.headers === 'object') {
      Object.assign(headers, fetchOptions.headers);
    }

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        headers,
        ...fetchOptions,
      });

      if (!response.ok) {
        // If 401, clear token and redirect to login
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  },

  // Health check
  async health() {
    return this.request('/health');
  },

  // Version
  async version() {
    return this.request('/version');
  },

  // Auth
  auth: {
    async login(email: string, password: string) {
      return apiClient.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    async register(name: string, email: string, password: string, role: string) {
      return apiClient.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
    },

    async getProfile() {
      return apiClient.request('/auth/me');
    },

    async updateProfile(data: any) {
      return apiClient.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async changePassword(oldPassword: string, newPassword: string) {
      return apiClient.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword }),
      });
    },

    async logout() {
      return apiClient.request('/auth/logout', {
        method: 'POST',
      });
    },
  },

  // Cars
  cars: {
    async getAll() {
      return apiClient.request('/cars');
    },

    async getById(id: string) {
      return apiClient.request(`/cars/${id}`);
    },

    async create(data: any) {
      return apiClient.request('/cars', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id: string, data: any) {
      return apiClient.request(`/cars/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id: string) {
      return apiClient.request(`/cars/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Users
  users: {
    async getAll() {
      return apiClient.request('/users');
    },

    async getById(id: string) {
      return apiClient.request(`/users/${id}`);
    },

    async create(data: any) {
      return apiClient.request('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id: string, data: any) {
      return apiClient.request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id: string) {
      return apiClient.request(`/users/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Upload
  upload: {
    async image(imageBase64: string, filename: string) {
      return apiClient.request('/upload/image', {
        method: 'POST',
        body: JSON.stringify({ image: imageBase64, filename }),
      });
    },

    async deleteImage(imagePath: string) {
      return apiClient.request('/upload/image', {
        method: 'DELETE',
        body: JSON.stringify({ imagePath }),
      });
    },
  },

  // Favorites
  favorites: {
    async getAll(): Promise<string[]> {
      return apiClient.request('/favorites');
    },

    async add(carId: string) {
      return apiClient.request(`/favorites/${carId}`, {
        method: 'POST',
      });
    },

    async remove(carId: string) {
      return apiClient.request(`/favorites/${carId}`, {
        method: 'DELETE',
      });
    },

    async getCars() {
      return apiClient.request('/favorites/cars');
    },
  },
};
