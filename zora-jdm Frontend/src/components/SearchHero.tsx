import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SearchHero() {
  const [selectedMake, setSelectedMake] = useState('Nissan');
  const [selectedModel, setSelectedModel] = useState('Skyline GT-R');
  const navigate = useNavigate();

  const handleEngage = () => {
    navigate(`/buy?q=${encodeURIComponent(selectedModel)}`);
  };

  return (
    <div className="relative pt-12 pb-24 md:pb-32 px-6 md:px-12 overflow-hidden border-b border-white/5 bg-[#050505]">
      {/* Decorative Grid */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />

      {/* Decorative background text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.02] select-none pointer-events-none">
        <h1 className="text-[30vw] md:text-[20vw] font-black italic leading-none tracking-tighter whitespace-nowrap">PREMIUM UNIT</h1>
      </div>

      {/* Floating HUD Elements */}
      <div className="absolute top-20 right-20 hidden lg:block opacity-20 animate-pulse">
        <div className="flex flex-col gap-2 font-mono text-[8px] text-cyan-500">
          <div className="flex justify-between w-40 border-b border-cyan-500/30 pb-1"><span>COORD X</span><span>40.3948</span></div>
          <div className="flex justify-between w-40 border-b border-cyan-500/30 pb-1"><span>COORD Y</span><span>139.2938</span></div>
          <div className="flex justify-between w-40 border-b border-cyan-500/30 pb-1"><span>LINK STAT</span><span>ONLINE</span></div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="px-4 py-1 bg-cyan-500/10 border-l border-cyan-500 font-mono text-[10px] text-cyan-400 tracking-widest">
            [ SCANNING INVENTORY SYSTEM ]
          </div>
          <div className="h-px bg-white/5 flex-grow" />
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic text-white mb-12 leading-[0.9] tracking-tighter uppercase">
          DRIVE THE <span className="text-transparent border-t border-cyan-500 text-stroke-white group hover:text-cyan-500 transition-colors cursor-default" style={{ WebkitTextStroke: '1px white' }}>UNTOUCHABLE</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 border border-white/10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Brand */}
          <div className="p-4 md:p-6 bg-zinc-950/80 hover:bg-zinc-900 transition-colors cursor-pointer group relative overflow-hidden backdrop-blur-sm">
            <span className="block text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-2 font-mono">01. MAKE</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black italic uppercase group-hover:text-cyan-400 transition-colors">{selectedMake}</span>
              <ChevronDown className="w-3 h-3 text-cyan-500" />
            </div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/0 group-hover:border-cyan-500/30 transition-all" />
          </div>

          {/* Model */}
          <div className="p-4 md:p-6 bg-zinc-950/80 hover:bg-zinc-900 transition-colors cursor-pointer group relative overflow-hidden backdrop-blur-sm">
            <span className="block text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-2 font-mono">02. MODEL</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black italic uppercase group-hover:text-cyan-400 transition-colors">{selectedModel}</span>
              <ChevronDown className="w-3 h-3 text-cyan-500" />
            </div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/0 group-hover:border-cyan-500/30 transition-all" />
          </div>

          {/* Location */}
          <div className="p-4 md:p-6 bg-zinc-950/80 hover:bg-zinc-900 transition-colors cursor-pointer group relative overflow-hidden backdrop-blur-sm">
            <span className="block text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-2 font-mono">03. HUD LOC</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black italic uppercase group-hover:text-cyan-400 transition-colors">Tokyo Bay</span>
            </div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/0 group-hover:border-cyan-500/30 transition-all" />
          </div>

          {/* Search Button */}
          <button 
            onClick={handleEngage}
            className="w-full h-full px-8 py-6 bg-cyan-500/5 hover:bg-cyan-500 text-cyan-500 hover:text-black flex items-center justify-center gap-3 font-black italic uppercase text-[10px] tracking-[0.3em] transition-all duration-300 group"
          >
            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Engage Sys</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

