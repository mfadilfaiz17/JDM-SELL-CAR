/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Car } from '../constants';

// Backend car interface
interface BackendCar {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'manual' | 'automatic';
  color: string;
  description: string;
  images: string[];
  seller: any;
  createdAt: string;
  updatedAt: string;
}

// Convert backend car to frontend Car format
const convertBackendCar = (backendCar: BackendCar): Car => {
  // Map backend data to frontend format
  const availability = backendCar.condition === 'excellent' ? 'Available' : 
                      backendCar.condition === 'good' ? 'Available' : 'Reserved';
  
  return {
    id: backendCar._id,
    famousName: backendCar.model,
    modelDetail: `${backendCar.brand} ${backendCar.model}`,
    brand: backendCar.brand,
    year: backendCar.year,
    price: backendCar.price,
    engine: backendCar.description || `${backendCar.fuelType} engine`,
    transmission: backendCar.transmission === 'manual' ? 'Manual' : 'Automatic',
    capacity: 2, // Default
    chassis: `${backendCar.brand.substring(0, 3).toUpperCase()}-${backendCar.year}`,
    availability: availability as 'Available' | 'Reserved' | 'Arriving Soon',
    category: backendCar.condition === 'excellent' ? 'Modified' : 'Standard',
    image: backendCar.images[0] || '',
    efficiency: 'HIGH PERF',
    acceleration: 85,
    handling: 90,
    modPriority: 'Engine' as any
  };
};

export const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: any = await apiClient.cars.getAll();
      const convertedCars = data.map(convertBackendCar);
      setCars(convertedCars);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cars');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return { cars, loading, error, refetch: fetchCars };
};

export const useUserCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserCars = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get all cars and filter by current user
      const data: any = await apiClient.cars.getAll();
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userCars = data.filter((car: BackendCar) => 
        car.seller === user.id || car.seller._id === user.id
      );
      const convertedCars = userCars.map(convertBackendCar);
      setCars(convertedCars);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user cars');
      console.error('Error fetching user cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCars();
  }, []);

  return { cars, loading, error, refetch: fetchUserCars };
};
