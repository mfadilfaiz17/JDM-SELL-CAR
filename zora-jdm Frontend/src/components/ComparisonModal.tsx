import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Minus } from 'lucide-react';
import { Car } from '../constants';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  cars: Car[];
}

export default function ComparisonModal({ isOpen, onClose, cars }: ComparisonModalProps) {
  if (!isOpen) return null;

  const specs = [
    { label: 'Manufacturer', key: 'brand' },
    { label: 'Powertrain', key: 'engine' },
    { label: 'Transmission', key: 'transmission' },
    { label: 'Efficiency', key: 'efficiency' },
    { label: 'Production Year', key: 'year' },
    { label: 'Capacity', key: 'capacity' },
    { label: 'Chassis ID', key: 'chassis' },
    { label: 'Classification', key: 'category' },
    { label: 'Market Value', key: 'price', format: (v: number) => `$${v}` },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-zinc-950 border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col relative"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/5 bg-zinc-900/50">
            <div>
              <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] mb-1">[ UNIT COMPARISON MATRIX ]</div>
              <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Spec Analysis</h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-red-500/50 hover:text-red-500 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grow overflow-auto p-6">
            <div className={`grid gap-6 ${
              cars.length === 1 ? 'grid-cols-[200px_1fr]' : 
              cars.length === 2 ? 'grid-cols-[200px_1fr_1fr]' : 
              'grid-cols-[200px_1fr_1fr_1fr]'
            }`}>
              {/* Row: Headers */}
              <div className="sticky left-0 bg-zinc-950 z-20"></div>
              {cars.map(car => (
                <div key={car.id} className="text-center pb-8 border-b border-white/5">
                  <div className="h-32 mb-6 flex items-center justify-center">
                    <img src={car.image || ''} alt={car.famousName} className="max-h-full max-w-full object-contain mix-blend-screen drop-shadow-[0_0_20px_rgba(6,182,212,0.2)]" />
                  </div>
                  <h3 className="text-xl font-black italic uppercase text-cyan-400 leading-none mb-1">{car.famousName}</h3>
                  <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">{car.modelDetail}</p>
                </div>
              ))}

              {/* Specs Rows */}
              {specs.map((spec) => (
                <React.Fragment key={spec.label}>
                  <div className="sticky left-0 bg-zinc-950 flex items-center py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">
                    {spec.label}
                  </div>
                  {cars.map(car => (
                    <div key={`${car.id}-${spec.label}`} className="flex items-center justify-center py-4 border-b border-white/5 text-center">
                      <span className="text-[11px] font-mono text-zinc-300 uppercase">
                        {spec.format 
                          ? spec.format(car[spec.key as keyof Car] as any) 
                          : (car[spec.key as keyof Car] || 'N/A')}
                      </span>
                    </div>
                  ))}
                </React.Fragment>
              ))}

              {/* Availability Row */}
              <div className="sticky left-0 bg-zinc-950 flex items-center py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">
                Status
              </div>
              {cars.map(car => (
                <div key={`${car.id}-status`} className="flex items-center justify-center py-4 border-b border-white/5">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 border ${
                    car.availability === 'Available' ? 'border-cyan-500 text-cyan-500' : 
                    car.availability === 'Reserved' ? 'border-amber-500 text-amber-500' : 
                    'border-zinc-700 text-zinc-500'
                  }`}>
                    {car.availability}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex justify-end gap-6 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-cyan-500" /> DATA_VERIFIED
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-cyan-500" /> ENGINE_SYMETRY_OK
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
