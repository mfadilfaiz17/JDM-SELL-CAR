/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BuyCar from './pages/BuyCar';
import Garage from './pages/Garage';
import SellCar from './pages/SellCar';
import Contact from './pages/Contact';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import CarModal from './components/CarModal';
import ProtectedRoute from './components/ProtectedRoute';
import { Car } from './constants';

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
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy_Protocols</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Digital_Terms</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">HQ_Contact</a>
            </div>
            
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
              &copy; 2026 ZORA_JDM. VERSION 3.1.4
            </p>
          </div>
        </footer>

        <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      </div>
    </Router>
  );
}

