/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Users, Settings, Gauge } from 'lucide-react';
import { COLLECTION_CARS, Car } from '../constants';

interface CollectionGridProps {
  onSelectCar: (car: Car) => void;
}

export default function CollectionGrid({ onSelectCar }: CollectionGridProps) {
  return (
    <section className="px-6 md:px-12 py-16 md:py-24 bg-[#050505] relative border-t border-white/5">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-12 md:mb-16 gap-6">
        <div className="text-center sm:text-left">
          <div className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] mb-2">[ DB_BROWSER ]</div>
          <h2 className="text-3xl md:text-4xl font-black italic text-zinc-300 uppercase tracking-tighter">Full Archive</h2>
        </div>
        <button className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] hover:text-white flex items-center gap-2 transition-all group">
          Filter Matrix
          <div className="hidden sm:block w-4 h-px bg-zinc-800 transition-all group-hover:w-8 group-hover:bg-cyan-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLLECTION_CARS.map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectCar(car)}
            className="group relative bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/50 transition-all cursor-crosshair p-6"
          >
            {/* Index HUD */}
            <div className="absolute top-2 left-2 text-[8px] font-mono text-zinc-800">
               LOC_0{index + 1}
            </div>

            <div className="h-40 mb-6 flex items-center justify-center p-2 overflow-hidden">
              {car.image ? (
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  src={car.image} 
                  alt={car.famousName}
                  className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center border border-white/5 bg-white/5">
                  <span className="text-[10px] font-mono text-zinc-800 uppercase tracking-widest">No_Image</span>
                </div>
              )}
            </div>

            <div className="relative z-10">
              <div className="mb-4">
                <h3 className="text-xl font-black italic uppercase leading-none text-white tracking-tighter mb-1">{car.famousName}</h3>
                <p className="text-[9px] text-zinc-600 uppercase font-mono mb-1 leading-tight">{car.modelDetail}</p>
                <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">{car.year} Spec</p>
              </div>

              <div className="flex items-center gap-4 py-3 border-y border-zinc-900/50 mb-4 font-mono text-[8px] text-zinc-500 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <Users className="w-2.5 h-2.5 text-zinc-700" />
                  <span>C{car.capacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Settings className="w-2.5 h-2.5 text-zinc-700" />
                  <span>{car.transmission === 'Manual' ? 'MT' : 'AT'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gauge className="w-2.5 h-2.5 text-cyan-900" />
                  <span className="text-cyan-900">{car.efficiency}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-mono text-zinc-600 uppercase block mb-0.5">Rate</span>
                  <span className="text-2xl font-black italic text-white">${car.price}k<span className="text-[9px] italic text-zinc-500 font-normal">/hr</span></span>
                </div>
                
                <motion.button 
                  whileHover={{ backgroundColor: '#06b6d4', scale: 1.1 }}
                  className="w-10 h-10 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-black transition-all"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


function Plus({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
