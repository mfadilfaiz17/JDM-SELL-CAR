/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { POPULAR_CARS, Car } from '../constants';

interface PopularCarsProps {
  onSelectCar: (car: Car) => void;
}

export default function PopularCars({ onSelectCar }: PopularCarsProps) {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'Modified' | 'Standard'>('ALL');

  const filteredCars = POPULAR_CARS.filter(car => 
    activeCategory === 'ALL' || car.category === activeCategory
  );

  const formatIDR = (price: number) => {
    // price is in thousands (k), convert to actual USD then to IDR
    const idr = price * 1000 * 16250; // 1 USD = Rp 16,250
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(idr);
  };

  return (
    <section className="px-6 md:px-12 py-16 md:py-24 bg-[#050505] relative">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-12 md:mb-16 relative z-10 gap-6">
        <div className="text-center sm:text-left">
          <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] mb-2">[ ELITE_INVENTORY ]</div>
          <h2 className="text-3xl md:text-4xl font-black italic text-white uppercase tracking-tighter leading-tight">
            Hot Specimens
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex gap-2 p-1 bg-zinc-950 border border-white/10">
            {(['ALL', 'Modified', 'Standard'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Link to="/buy" className="w-full sm:w-auto px-8 py-3 border border-zinc-700 font-bold uppercase text-[10px] tracking-[0.3em] hover:border-cyan-500 hover:text-cyan-400 transition-all text-center">
            View All Units
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 min-h-[400px]">
        <AnimatePresence mode='popLayout'>
          {filteredCars.map((car, index) => (
            <motion.div
              key={car.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: index * 0.1 } }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover="hover"
              onClick={() => onSelectCar(car)}
              className="bg-zinc-950 border border-white/5 p-8 relative overflow-hidden group cursor-pointer h-full flex flex-col"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/5 blur-[100px] group-hover:bg-purple-500/10 transition-colors pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-zinc-600 tracking-tighter">ID: BNR34-00{index + 1}</span>
                    <div className={`text-[7px] font-mono px-1 w-fit border ${
                      car.category === 'Modified' ? 'border-purple-500/50 text-purple-500/70' : 'border-zinc-700 text-zinc-600'
                    }`}>
                      {car.category.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 border ${car.availability === 'Available' ? 'border-cyan-500 text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'border-zinc-700 text-zinc-500'}`}>
                      {car.availability}
                    </span>
                  </div>
                </div>
                <h3 className="text-3xl font-black italic uppercase leading-none mb-1 tracking-tighter group-hover:text-cyan-400 transition-colors flex items-baseline gap-2">
                  {car.famousName}
                  <span className="text-[10px] not-italic text-zinc-800 group-hover:text-cyan-900 transition-colors">//V1.0</span>
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase font-mono mb-3 leading-tight">{car.modelDetail}</p>
                <div className="h-px bg-gradient-to-r from-cyan-500/50 to-transparent w-20 mb-3" />
                <p className="font-mono text-[9px] text-cyan-500/70 uppercase tracking-widest">{car.engine}</p>
              </div>

              {/* Image */}
              <div className="relative h-48 my-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              {car.image ? (
                <motion.img 
                  variants={{
                    hover: { x: 10, y: -5, rotate: -2, transition: { duration: 0.7, ease: "easeOut" } }
                  }}
                  src={car.image} 
                  alt={car.famousName}
                  className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_30px_rgba(6,182,212,0.2)] grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 z-10"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center border border-white/5 bg-white/5">
                  <span className="text-[10px] font-mono text-zinc-800 uppercase tracking-widest">No_Image_Data</span>
                </div>
              )}
              </div>

              {/* Stats Visualization */}
              <div className="space-y-6 mb-8 relative z-10 mt-auto">
                <div>
                  <div className="flex justify-between text-[8px] uppercase text-zinc-500 font-bold mb-1 font-mono"><span>Potential</span><span>92%</span></div>
                  <div className="h-0.5 bg-zinc-900 w-full relative overflow-hidden">
                    <motion.div 
                      initial={{ x: '-100%' }}
                      whileInView={{ x: '0%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="absolute inset-0 bg-cyan-500 shadow-[0_0_10px_#06b6d4]" 
                    />
                  </div>
                </div>

                {/* Revealed Stats on Hover */}
                <motion.div 
                  variants={{
                    initial: { opacity: 0, height: 0 },
                    hover: { opacity: 1, height: 'auto', transition: { duration: 0.3 } }
                  }}
                  className="grid grid-cols-2 gap-4 overflow-hidden pt-2"
                >
                  <div className="border-l border-cyan-500/30 pl-3">
                    <span className="block text-[7px] text-zinc-600 uppercase font-mono tracking-widest mb-1">Chassis_Ref</span>
                    <span className="block text-[10px] text-zinc-300 font-mono uppercase">{car.chassis.split('-')[0]}</span>
                  </div>
                  <div className="border-l border-cyan-500/30 pl-3">
                    <span className="block text-[7px] text-zinc-600 uppercase font-mono tracking-widest mb-1">Trans_System</span>
                    <span className="block text-[10px] text-zinc-300 font-mono uppercase">{car.transmission || 'MT-6'}</span>
                  </div>
                </motion.div>
              </div>

              {/* Price & Action */}
              <div className="pt-6 border-t border-white/5 flex items-end justify-between relative z-10">
                <div>
                  <span className="block text-[8px] uppercase font-bold text-zinc-600 mb-1 font-mono">Daily Rate</span>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black italic tracking-tighter">${car.price}k</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight">
                      {formatIDR(car.price)}
                    </span>
                  </div>
                </div>
                <button className="px-6 py-3 bg-zinc-900 group-hover:bg-cyan-500 group-hover:text-black text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                  Details
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

