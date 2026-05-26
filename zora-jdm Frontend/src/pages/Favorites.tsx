/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Car } from '../constants';
import { Heart } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { apiClient } from '../api/client';
import { useCars } from '../hooks/useCars';

interface FavoritesProps {
  onSelectCar: (car: Car) => void;
}

export default function Favorites({ onSelectCar }: FavoritesProps) {
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const { cars: allCars } = useCars();
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavoriteCars = async () => {
      try {
        // Always filter from allCars (which already has proper image mapping from useCars)
        const filtered = allCars.filter(car => favorites.includes(car.id));
        setFavoriteCars(filtered);
      } catch (error) {
        console.error('Failed to load favorite cars:', error);
        setFavoriteCars([]);
      } finally {
        setLoading(false);
      }
    };

    if (!favoritesLoading) {
      loadFavoriteCars();
    }
  }, [favorites, allCars, favoritesLoading]);

  const formatIDR = (price: number) => {
    // price is in thousands (k), convert to actual USD then to IDR
    const idr = price * 1000 * 16250; // 1 USD = Rp 16,250
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(idr);
  };

  if (loading || favoritesLoading) {
    return (
      <div className="px-6 md:px-12 py-16 bg-[#050505] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-red-500 font-mono text-[10px] tracking-[0.4em]">LOADING FAVORITES...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-16 bg-[#050505] min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
      
      <div className="relative z-10 mb-12">
        <div className="text-red-500 font-mono text-[10px] tracking-[0.4em] mb-2">[ WISHLIST ACCESS ]</div>
        <h1 className="text-5xl md:text-6xl font-black italic text-white uppercase tracking-tighter mb-8">
          My <span className="text-red-500">Favorites</span>
        </h1>
        <p className="text-zinc-500 font-mono text-[10px] tracking-[0.2em] uppercase">
          {favoriteCars.length} UNIT{favoriteCars.length !== 1 ? 'S' : ''} SAVED
        </p>
      </div>

      {favoriteCars.length === 0 ? (
        <div className="py-24 text-center border border-white/5 bg-zinc-950/50">
          <Heart className="w-16 h-16 mx-auto text-zinc-800 mb-4" />
            <div className="text-zinc-600 font-mono text-[10px] tracking-[0.5em] mb-4">WISHLIST EMPTY</div>
          <div className="text-2xl font-black italic text-zinc-800 uppercase">No Favorites Yet</div>
          <p className="text-zinc-700 font-mono text-[9px] mt-4">Add cars to your wishlist to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {favoriteCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              layout
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0, transition: { delay: index * 0.05 } },
                exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
                hover: { y: -8, scale: 1.02 }
              }}
              onClick={() => onSelectCar(car)}
              className="group cursor-crosshair relative"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/2 transition-colors duration-500 rounded-none pointer-events-none" />
              
              <div className="bg-zinc-950 border border-white/5 p-6 relative z-10 hover:border-red-500/50 transition-all duration-300 overflow-hidden h-full flex flex-col">
                {/* Card Decoration */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/0 group-hover:border-red-500/30 transition-all" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-white/0 group-hover:border-red-500/30 transition-all" />
                
                <div className="flex justify-between items-start mb-6 relative z-20">
                  <div className="flex flex-col gap-1">
                    <div className="text-[8px] font-mono text-zinc-800 tracking-tighter">FAVORITE 0{index + 1}</div>
                    <div className={`text-[7px] font-mono px-1 w-fit border ${
                      car.category === 'Modified' ? 'border-purple-500/50 text-purple-500/70' : 'border-zinc-700 text-zinc-600'
                    }`}>
                      {car.category.toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('❤️ Heart clicked in Favorites, removing car:', car.id);
                      toggleFavorite(car.id);
                    }}
                    className="text-red-500 hover:text-red-400 transition-colors relative z-20 cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4" fill="currentColor" />
                  </button>
                </div>
                
                <div className="h-48 mb-6 flex items-center justify-center p-2 relative overflow-hidden">
                  {/* Image Hologram Effect */}
                  <div className="absolute inset-0 bg-linear-to-t from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/5 transition-all duration-500" />
                  {car.image ? (
                    <motion.img 
                      variants={{
                        hover: { scale: 1.08, x: 5 }
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      src={car.image} 
                      alt={car.famousName}
                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 relative z-10"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border border-white/5 bg-white/5">
                      <span className="text-[10px] font-mono text-zinc-800 uppercase tracking-widest">No Image Data</span>
                    </div>
                  )}
                </div>

                <div className="grow">
                  <h3 className="text-xl font-black italic uppercase leading-none text-white tracking-tighter mb-1 group-hover:text-red-400 transition-colors">{car.famousName}</h3>
                  <p className="text-[9px] text-zinc-600 uppercase font-mono mb-1 leading-tight">{car.modelDetail}</p>
                  <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-[0.2em] mb-4">{car.brand}</p>

                  {/* Primary Info */}
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-black italic text-white group-hover:scale-105 transition-transform origin-left">${car.price}k</span>
                      <div className="text-[9px] font-mono text-zinc-500 group-hover:text-red-500 transition-colors">
                        UNIT://{car.year}
                      </div>
                    </div>
                    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                      Est. {formatIDR(car.price)}
                    </div>
                  </div>

                  {/* Hover Reveal Details */}
                  <motion.div 
                    variants={{
                      initial: { height: 0, opacity: 0 },
                      hover: { height: 'auto', opacity: 1, transition: { duration: 0.3 } }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                        <div className="space-y-1">
                          <span className="block text-[7px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Powertrain</span>
                          <span className="block text-[9px] font-black text-red-500 italic uppercase truncate">{car.engine}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[7px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Efficiency</span>
                          <span className="block text-[9px] font-mono text-zinc-300 uppercase">{car.efficiency || 'HIGH PERF'}</span>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
