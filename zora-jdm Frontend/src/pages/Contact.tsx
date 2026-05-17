/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Smartphone, MapPin, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { CONTACT_CONFIG, generateGeneralInquiryUrl } from '../config/contact';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="px-6 md:px-12 py-24 bg-[#050505] min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] mb-4">[ HQ COMM CHANNEL ]</div>
            <h1 className="text-6xl md:text-8xl font-black italic text-white uppercase tracking-tighter mb-8 leading-none">
              Get in <br /><span className="text-cyan-500 text-stroke-white" style={{ WebkitTextStroke: '1px white' }}>Touch</span>
            </h1>
            
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-12 leading-relaxed">
              Connect with our team for inquiries about JDM units, pricing, availability, or custom orders. We're here to help you find your perfect ride.
            </p>
            
            <div className="space-y-12 mt-16">
              <ContactInfo icon={<Mail />} label="Mainframe" value={CONTACT_CONFIG.email.toUpperCase()} />
              <ContactInfo icon={<Smartphone />} label="Nerve Center" value={CONTACT_CONFIG.phone} />
              <ContactInfo icon={<MapPin />} label="Coordinates" value={CONTACT_CONFIG.location.toUpperCase()} />
            </div>

            <div className="mt-16 p-6 border border-white/5 bg-zinc-950/50">
              <div className="text-cyan-500 font-mono text-[9px] tracking-[0.3em] mb-3">[ OPERATING HOURS ]</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span className="font-mono text-[10px] uppercase">Monday - Friday</span>
                  <span className="font-black text-white">{CONTACT_CONFIG.operatingHours.weekday}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="font-mono text-[10px] uppercase">Saturday</span>
                  <span className="font-black text-white">{CONTACT_CONFIG.operatingHours.saturday}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="font-mono text-[10px] uppercase">Sunday</span>
                  <span className="font-black text-red-500">{CONTACT_CONFIG.operatingHours.sunday}</span>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Button */}
            <button
              onClick={() => window.open(generateGeneralInquiryUrl(), '_blank')}
              className="mt-8 w-full py-5 bg-green-500 text-white font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              <MessageCircle className="w-5 h-5" />
              Quick WhatsApp Contact
            </button>
          </div>

          <div className="bg-zinc-950 border border-white/5 p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl" />
            
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center h-full py-24 animate-fadeIn">
                <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-cyan-500" />
                </div>
                <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] mb-4">[ MESSAGE TRANSMITTED ]</div>
                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-4">
                  Success!
                </h3>
                <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest text-center">
                  Your message has been received.<br />We'll respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="text-cyan-500 font-mono text-[9px] tracking-[0.3em] mb-6">[ CONTACT FORM ]</div>
                
                <div className="grid grid-cols-2 gap-6">
                  <InputGroup 
                    label="Alias" 
                    placeholder="REBEL 01" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <InputGroup 
                    label="Identity" 
                    placeholder="NAME@EMAIL.COM" 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <InputGroup 
                  label="Subject" 
                  placeholder="UNIT INQUIRY" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Message Packet</label>
                  <textarea 
                    name="message"
                    rows={6}
                    placeholder="TRANSMIT YOUR MESSAGE..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-900 border border-white/5 p-4 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-zinc-700"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-white text-black font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'TRANSMITTING...' : (
                    <>
                      Transmit <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
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

function InputGroup({ label, placeholder, name, value, onChange, type = 'text', required = false }: { 
  label: string; 
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">{label}</label>
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-zinc-900 border border-white/5 p-4 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-zinc-700"
      />
    </div>
  );
}
