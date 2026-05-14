/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CarModal from './components/CarModal';
import { Car } from './constants';

// Lazy load pages for code splitting
const Home = React.lazy(() => import('./pages/Home'));
const BuyCar = React.lazy(() => import('./pages/BuyCar'));
const Garage = React.lazy(() => import('./pages/Garage'));
const SellCar = React.lazy(() => import('./pages/SellCar'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));

// Simple loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 mx-auto mb-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      <p className="text-cyan-500 font-mono text-xs uppercase tracking-widest">Loading...</p>
    </div>
  </div>
);

export default function App() {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  return (
    <Router>
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
        {/* Background Grid Layer */}
        <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none"></div>
        <div className="fixed inset-0 bg-radial-at-t from-[#111] via-transparent to-transparent pointer-events-none"></div>

        <Navbar onSelectCar={setSelectedCar} />
        
        <main className="relative z-10">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home onSelectCar={setSelectedCar} />} />
              <Route path="/buy" element={<BuyCar onSelectCar={setSelectedCar} />} />
              <Route path="/favorites" element={<Favorites onSelectCar={setSelectedCar} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/garage" 
                element={
                  <ProtectedRoute>
                    <Garage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sell" 
                element={
                  <ProtectedRoute>
                    <SellCar />
                  </ProtectedRoute>
                } 
              />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </main>
        
        {/* Footer */}
        <footer className="px-6 md:px-12 py-16 border-t border-white/5 bg-zinc-950/80 backdrop-blur relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-sm transform rotate-45 flex items-center justify-center">
                <div className="w-4 h-4 bg-black transform -rotate-45"></div>
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-white uppercase">
                ZORA<span className="text-cyan-500">JDM</span>
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-500">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
            </div>
            
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
              &copy; 2026 ZORA JDM
            </p>
          </div>
        </footer>

        <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      </div>
    </Router>
  );
}

