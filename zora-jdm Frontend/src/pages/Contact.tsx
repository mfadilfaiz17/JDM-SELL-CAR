/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Smartphone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="px-6 md:px-12 py-24 bg-[#050505] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] mb-4">[ HQ_COMM_CHANNEL ]</div>
            <h1 className="text-6xl md:text-8xl font-black italic text-white uppercase tracking-tighter mb-8 leading-none">
              Get in <br /><span className="text-cyan-500 text-stroke-white" style={{ WebkitTextStroke: '1px white' }}>Touch</span>
            </h1>
            
            <div className="space-y-12 mt-16">
              <ContactInfo icon={<Mail />} label="Mainframe" value="OFFICIAL@ZORAJDM.COM" />
              <ContactInfo icon={<Smartphone />} label="Nerve Center" value="+62-9999-9999" />
              <ContactInfo icon={<MapPin />} label="Coordinates" value="JAKARTA CENTER" />
            </div>
          </div>

          <div className="bg-zinc-950 border border-white/5 p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl" />
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <InputGroup label="Alias" placeholder="REBEL_01" />
                <InputGroup label="Identity" placeholder="NAME@EMAIL.COM" />
              </div>
              <InputGroup label="Subject" placeholder="UNIT_INQUIRY" />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Message Packet</label>
                <textarea 
                  rows={6}
                  placeholder="TRANSMIT YOUR MESSAGE..."
                  className="w-full bg-zinc-900 border border-white/5 p-4 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
              <button className="w-full py-6 bg-white text-black font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-cyan-500 transition-all">
                Transmit <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-6">
      <div className="w-12 h-12 bg-zinc-950 border border-white/5 flex items-center justify-center text-cyan-500">
        {icon}
      </div>
      <div>
        <span className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono mb-1">{label}</span>
        <p className="text-white font-black italic uppercase text-lg tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">{label}</label>
      <input 
        type="text"
        placeholder={placeholder}
        className="w-full bg-zinc-900 border border-white/5 p-4 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500 transition-all"
      />
    </div>
  );
}
