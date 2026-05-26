/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Car, ALL_CARS } from '../constants';

// Backend car interface
interface BackendCar {
  _id: string;
  brand: string;
  carModel: string;
  modelDetail?: string;
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

// Map car model names to image filenames
const getCarImage = (brand: string, model: string, images: string[]): string => {
  // If backend has image, use it
  if (images && images.length > 0 && images[0]) {
    return images[0];
  }

  // Otherwise, map to local images based on brand and model
  const modelLower = model.toLowerCase();
  const brandLower = brand.toLowerCase();

  // Nissan
  if (brandLower.includes('nissan')) {
    if (modelLower.includes('skyline') || modelLower.includes('gt-r') || modelLower.includes('gtr')) {
      return '/cars/skyline-gt-r-bnr34.png';
    }
    if (modelLower.includes('silvia') || modelLower.includes('s15')) {
      return '/cars/nissan-silvia-s15.png';
    }
    if (modelLower.includes('300zx') || modelLower.includes('fairlady') || modelLower.includes('z32')) {
      return '/cars/z32-fairlady-z.png';
    }
    if (modelLower.includes('240z') || modelLower.includes('s30')) {
      return '/cars/fairlady-z.png';
    }
  }

  // Toyota
  if (brandLower.includes('toyota')) {
    if (modelLower.includes('supra') || modelLower.includes('jza80')) {
      return '/cars/supra-jza80.png';
    }
    if (modelLower.includes('ae86') || modelLower.includes('trueno') || modelLower.includes('sprinter')) {
      return '/cars/sprinter-trueno-ae86.png';
    }
    if (modelLower.includes('chaser') || modelLower.includes('tourer')) {
      return '/cars/chaser-tourer-v.png';
    }
    if (modelLower.includes('soarer')) {
      return '/cars/soarer-2.5gt-t.png';
    }
  }

  // Mazda
  if (brandLower.includes('mazda')) {
    if (modelLower.includes('fd3s') || (modelLower.includes('rx-7') && !modelLower.includes('fc'))) {
      return '/cars/rx-7-fd3s.png';
    }
    if (modelLower.includes('fc3s') || modelLower.includes('savanna')) {
      return '/cars/rx-7-savanna.png';
    }
  }

  // Honda
  if (brandLower.includes('honda')) {
    if (modelLower.includes('nsx')) {
      return '/cars/nsx-r.png';
    }
    if (modelLower.includes('integra')) {
      return '/cars/integra-type-r.png';
    }
    if (modelLower.includes('civic')) {
      return '/cars/civic-type-r.png';
    }
  }

  // Subaru
  if (brandLower.includes('subaru')) {
    if (modelLower.includes('22b')) {
      return '/cars/impreza-228-sti.png';
    }
    if (modelLower.includes('wrx') || modelLower.includes('sti') || modelLower.includes('impreza')) {
      return '/cars/impreza-wrx-st.png';
    }
  }

  // Mitsubishi
  if (brandLower.includes('mitsubishi')) {
    if (modelLower.includes('evolution') || modelLower.includes('evo')) {
      if (modelLower.includes('tommi') || modelLower.includes('mäkinen') || modelLower.includes('makinen')) {
        return '/cars/tommi-mäkinen-edition.png';
      }
      return '/cars/lancer-evolution-ix.png';
    }
    if (modelLower.includes('gto')) {
      return '/cars/gto-twin-turbo.png';
    }
  }

  // Suzuki
  if (brandLower.includes('suzuki') && modelLower.includes('cappuccino')) {
    return '/cars/cappuccino.png';
  }

  // Autozam
  if (brandLower.includes('autozam') || modelLower.includes('az-1')) {
    return '/cars/autozam-az-1.png';
  }

  // Default fallback
  return '';
};

// Get realistic performance stats based on car model
const getPerformanceStats = (brand: string, model: string): { acceleration: number; handling: number; modPriority: number } => {
  const modelLower = model.toLowerCase();
  const brandLower = brand.toLowerCase();

  // Nissan
  if (brandLower.includes('nissan')) {
    if (modelLower.includes('skyline') || modelLower.includes('gt-r')) {
      return { acceleration: 95, handling: 92, modPriority: 100 }; // GT-R BNR34
    }
    if (modelLower.includes('silvia') || modelLower.includes('s15')) {
      return { acceleration: 81, handling: 93, modPriority: 96 }; // Silvia S15
    }
    if (modelLower.includes('300zx') || modelLower.includes('z32')) {
      return { acceleration: 84, handling: 86, modPriority: 82 }; // 300ZX
    }
    if (modelLower.includes('240z') || modelLower.includes('fairlady') || modelLower.includes('s30')) {
      return { acceleration: 68, handling: 80, modPriority: 88 }; // Fairlady Z S30
    }
  }

  // Toyota
  if (brandLower.includes('toyota')) {
    if (modelLower.includes('supra') || modelLower.includes('jza80')) {
      return { acceleration: 92, handling: 85, modPriority: 100 }; // Supra JZA80
    }
    if (modelLower.includes('ae86') || modelLower.includes('trueno')) {
      return { acceleration: 65, handling: 95, modPriority: 98 }; // AE86
    }
    if (modelLower.includes('chaser')) {
      return { acceleration: 82, handling: 78, modPriority: 90 }; // Chaser
    }
    if (modelLower.includes('soarer')) {
      return { acceleration: 83, handling: 76, modPriority: 85 }; // Soarer
    }
  }

  // Mazda
  if (brandLower.includes('mazda')) {
    if (modelLower.includes('fd3s') || (modelLower.includes('rx-7') && !modelLower.includes('fc'))) {
      return { acceleration: 88, handling: 94, modPriority: 95 }; // RX-7 FD3S
    }
    if (modelLower.includes('fc3s') || modelLower.includes('savanna')) {
      return { acceleration: 80, handling: 88, modPriority: 85 }; // RX-7 FC3S
    }
  }

  // Honda
  if (brandLower.includes('honda')) {
    if (modelLower.includes('nsx')) {
      return { acceleration: 90, handling: 98, modPriority: 75 }; // NSX-R
    }
    if (modelLower.includes('integra')) {
      return { acceleration: 78, handling: 96, modPriority: 88 }; // Integra Type R
    }
    if (modelLower.includes('civic')) {
      return { acceleration: 75, handling: 92, modPriority: 94 }; // Civic Type R
    }
  }

  // Subaru
  if (brandLower.includes('subaru')) {
    if (modelLower.includes('22b')) {
      return { acceleration: 88, handling: 93, modPriority: 92 }; // 22B STi
    }
    if (modelLower.includes('wrx') || modelLower.includes('sti') || modelLower.includes('impreza')) {
      return { acceleration: 87, handling: 91, modPriority: 90 }; // WRX STi
    }
  }

  // Mitsubishi
  if (brandLower.includes('mitsubishi')) {
    if (modelLower.includes('tommi') || modelLower.includes('mäkinen') || modelLower.includes('makinen')) {
      return { acceleration: 89, handling: 95, modPriority: 93 }; // TME
    }
    if (modelLower.includes('evolution') || modelLower.includes('evo')) {
      return { acceleration: 90, handling: 94, modPriority: 95 }; // Evo IX
    }
    if (modelLower.includes('gto')) {
      return { acceleration: 85, handling: 82, modPriority: 70 }; // GTO
    }
  }

  // Suzuki
  if (brandLower.includes('suzuki') && modelLower.includes('cappuccino')) {
    return { acceleration: 62, handling: 85, modPriority: 75 }; // Cappuccino
  }

  // Autozam
  if (brandLower.includes('autozam') || modelLower.includes('az-1')) {
    return { acceleration: 60, handling: 88, modPriority: 78 }; // AZ-1
  }

  // Default
  return { acceleration: 75, handling: 80, modPriority: 70 };
};

// Determine category based on condition
const getCarCategory = (condition: string): 'Modified' | 'Standard' => {
  // Excellent condition = Modified (tuned/upgraded)
  // Good/Fair/Poor = Standard (stock or minimal mods)
  return condition === 'excellent' ? 'Modified' : 'Standard';
};

// Convert backend car to frontend Car format
const convertBackendCar = (backendCar: BackendCar): Car => {
  // Map backend data to frontend format
  const availability = backendCar.condition === 'excellent' ? 'Available' : 
                      backendCar.condition === 'good' ? 'Available' : 'Reserved';
  
  const performanceStats = getPerformanceStats(backendCar.brand, backendCar.carModel);
  
  return {
    id: backendCar._id,
    famousName: backendCar.carModel,
    modelDetail: backendCar.modelDetail || `${backendCar.brand} ${backendCar.carModel}`,
    brand: backendCar.brand,
    year: backendCar.year,
    price: backendCar.price,
    engine: backendCar.description || `${backendCar.fuelType} engine`,
    transmission: backendCar.transmission === 'manual' ? 'Manual' : 'Automatic',
    capacity: 2, // Default
    chassis: `${backendCar.brand.substring(0, 3).toUpperCase()}-${backendCar.year}`,
    availability: availability as 'Available' | 'Reserved' | 'Arriving Soon',
    category: getCarCategory(backendCar.condition),
    image: getCarImage(backendCar.brand, backendCar.carModel, backendCar.images),
    color: backendCar.color,
    efficiency: 'HIGH PERF',
    acceleration: performanceStats.acceleration,
    handling: performanceStats.handling,
    modPriority: performanceStats.modPriority
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
      
      // If API returns data, use it
      if (data && data.length > 0) {
        const convertedCars = data.map(convertBackendCar);
        setCars(convertedCars);
      } else {
        // Fallback to constants if no data from API
        console.log('No cars from API, using constants data');
        setCars(ALL_CARS);
      }
    } catch (err: any) {
      // On error, fallback to constants
      console.log('API error, using constants data:', err.message);
      setCars(ALL_CARS);
      setError(err.message || 'Failed to fetch cars');
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
