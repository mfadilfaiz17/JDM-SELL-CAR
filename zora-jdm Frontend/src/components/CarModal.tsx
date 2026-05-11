/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gauge, Settings, Users, ShieldCheck, Zap } from 'lucide-react';
import { Car } from '../constants';
import ImageGallery from './ImageGallery';

interface CarModalProps {
  car: Car | null;
  onClose: () => void;
}

export default function CarModal({ car, onClose }: CarModalProps) {
  if (!car) return null;

  const formatIDR = (price: number) => {
    const idr = price * 16300; // Approximate conversion rate
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(idr);
  };

  // Prepare images array - use car.image if available, otherwise use empty array
  const images = car.image ? [car.image] : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center border border-white/10 text-white hover:bg-cyan-500 hover:text-black transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-96 lg:h-auto lg:min-h-[600px] bg-[#0a0a0a] flex items-center justify-center p-8 overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 select-none">
                <h2 className="text-9xl font-black italic">{car.brand}</h2>
              </div>
              
              {/* Use ImageGallery if multiple images, otherwise show single image */}
              {images.length > 0 ? (
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <div className="w-full h-full max-h-[400px]">
                    <ImageGallery 
                      images={images}
                      title={car.famousName}
                      className="h-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative z-10 w-full h-full flex items-center justify-center border border-white/5 bg-white/5">
                  <span className="text-xl font-mono text-zinc-800 uppercase tracking-widest">No_Image_Data</span>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-6 lg:p-8 overflow-y-auto max-h-[70vh] lg:max-h-[600px] space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 font-mono text-[9px] tracking-widest uppercase">
                    [ {car.chassis} ]
                  </div>
                  <span className="text-zinc-600 font-mono text-[9px]">{car.year} SPEC</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black italic text-white uppercase tracking-tighter leading-none mb-1">
                  {car.famousName}
                </h2>
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-3">
                  {car.modelDetail}
                </p>
                <p className="text-cyan-500 font-mono text-[10px] tracking-widest uppercase">{car.engine}</p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3">
                <SpecCard icon={<Zap className="w-4 h-4" />} label="Transmission" value={car.transmission || 'Manual'} />
                <SpecCard icon={<Gauge className="w-4 h-4" />} label="Category" value={car.efficiency || 'Legendary'} />
                <SpecCard icon={<Users className="w-4 h-4" />} label="Capacity" value={`${car.capacity || 2} Persons`} />
                <SpecCard icon={<ShieldCheck className="w-4 h-4" />} label="Status" value={car.availability} />
              </div>

              {/* Performance Visualization */}
              <div className="space-y-4">
                <StatBar label="Acceleration" value={95} color="bg-cyan-500" />
                <StatBar label="Handing" value={88} color="bg-magenta-500" />
                <StatBar label="Mod Priority" value={100} color="bg-white" />
              </div>

              {/* Pricing & Footer */}
              <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-zinc-500 mb-2 font-mono">Archive Rate</span>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black italic tracking-tighter text-white">${car.price}</span>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">/ Daily</span>
                    </div>
                    <span className="text-xs font-mono text-cyan-500 uppercase tracking-widest mt-1">
                      {formatIDR(car.price)}
                    </span>
                  </div>
                </div>
                <button className="w-full py-3 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:bg-cyan-600 transition-all">
                  Access Unit
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SpecCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 bg-zinc-900 border border-white/5">
      <div className="flex items-center gap-2 text-zinc-500 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{label}</span>
      </div>
      <p className="text-white font-black italic uppercase text-sm">{value}</p>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] uppercase text-zinc-500 font-bold mb-2 font-mono">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-zinc-900 w-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
