import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Menu, X, ChevronDown, LogOut, User, Heart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

interface NavbarProps {
  onSelectCar: (car: any) => void;
}

interface UserProfile {
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'both';
  isLoggedIn: boolean;
}

export default function Navbar({ onSelectCar }: NavbarProps) {
  const [searchVin, setSearchVin] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { favoriteCount } = useFavorites();
  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Racer',
    email: 'alex@zorajdm.com',
    role: 'both',
    isLoggedIn: false
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          name: parsedUser.name || 'User',
          email: parsedUser.email || '',
          role: parsedUser.role || 'buyer',
          isLoggedIn: true
        });
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);



  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(prev => ({
      ...prev,
      isLoggedIn: false
    }));
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVin.trim()) {
      navigate(`/buy?q=${encodeURIComponent(searchVin.trim())}`);
      setSearchVin('');
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Garage', path: '/garage' },
    { name: 'Buy Car', path: '/buy' },
    { name: 'Favorites', path: '/favorites' },
    { name: 'Sell Car', path: '/sell' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 md:py-6 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
      {/* Decorative Scanline for Nav */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse" />

      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2 group cursor-pointer relative z-40">
        <div className="w-8 h-8 bg-cyan-500 rounded-sm transform rotate-45 flex items-center justify-center transition-transform group-hover:rotate-135 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <div className="w-4 h-4 bg-black transform -rotate-45"></div>
        </div>
        <span className="text-2xl font-black italic tracking-tighter text-white uppercase">
          ZORA<span className="text-cyan-500 underline decoration-2 underline-offset-4">JDM</span>
        </span>
      </Link>

      {/* VIN Search - Hidden on small mobile */}
      <form onSubmit={handleSearch} className="hidden lg:flex items-center relative max-w-[200px] xl:max-w-xs w-full mx-8 group">
        <div className="absolute left-4 text-zinc-600 group-focus-within:text-cyan-500 transition-colors">
          <Search className="w-3.5 h-3.5" />
        </div>
        <input 
          type="text" 
          placeholder="CHASSIS ID SCNR"
          value={searchVin}
          onChange={(e) => setSearchVin(e.target.value)}
          className="w-full bg-zinc-950/30 border border-white/5 py-2.5 pl-11 pr-4 rounded-none font-mono text-[9px] text-white focus:outline-none focus:border-cyan-500/50 focus:bg-zinc-900/50 uppercase tracking-[0.2em] transition-all placeholder:text-zinc-800"
        />
        <div className="absolute bottom-0 left-0 h-px bg-cyan-500 transition-all duration-300 w-0 group-focus-within:w-full" />
      </form>

      {/* Main Menu - Desktop */}
      <div className="hidden xl:flex space-x-10 text-[9px] font-black uppercase tracking-[0.3em]">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path} 
            className="relative py-2 group overflow-hidden"
          >
            <span className={`transition-colors duration-300 ${
              location.pathname === link.path ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-white'
            }`}>
              {link.name}
            </span>
            {location.pathname === link.path && (
              <motion.div 
                layoutId="navIndicator"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
              />
            )}
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full opacity-50" />
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden lg:flex items-center gap-4 py-1 px-4 border border-zinc-800 rounded-sm bg-zinc-900/50">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">Active Render</span>
        </div>

        {user.isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 border border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all text-[10px] uppercase font-bold tracking-[0.2em] bg-white/5 rounded"
            >
              <User className="w-3 h-3" />
              <span className="hidden md:inline">{user.name}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-white/10 shadow-lg z-50"
                >
                  <div className="p-4 border-b border-white/5">
                    <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-1">Logged In As</p>
                    <p className="text-sm font-black text-white mb-2">{user.name}</p>
                    <p className="text-[8px] font-mono text-zinc-500 mb-3">{user.email}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-mono uppercase tracking-widest px-2 py-1 border rounded ${
                        user.role === 'buyer' ? 'border-blue-500/50 text-blue-500' :
                        user.role === 'seller' ? 'border-green-500/50 text-green-500' :
                        'border-purple-500/50 text-purple-500'
                      }`}>
                        {user.role === 'both' ? 'Buyer & Seller' : user.role.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-[9px] font-mono text-zinc-400 hover:text-cyan-400 hover:bg-white/5 transition-all uppercase tracking-[0.2em]"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/garage"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-[9px] font-mono text-zinc-400 hover:text-cyan-400 hover:bg-white/5 transition-all uppercase tracking-[0.2em]"
                    >
                      My Garage
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-[9px] font-mono text-zinc-400 hover:text-cyan-400 hover:bg-white/5 transition-all uppercase tracking-[0.2em]"
                    >
                      My Favorites
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-[9px] font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all uppercase tracking-[0.2em] flex items-center gap-2 border-t border-white/5 mt-2 pt-2"
                    >
                      <LogOut className="w-3 h-3" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button 
            onClick={() => {
              console.log('Sign In clicked, navigating to /login');
              navigate('/login');
            }}
            className="hidden sm:block px-6 py-2 border border-white/10 hover:border-cyan-400 hover:text-cyan-400 transition-all text-[10px] uppercase font-bold tracking-[0.2em] bg-white/5 whitespace-nowrap rounded"
          >
            Sign In
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl:hidden w-10 h-10 border border-white/10 flex items-center justify-center text-white bg-white/5 z-40 rounded"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#050505] z-30 p-12 pt-32 flex flex-col gap-8"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-black italic uppercase tracking-tighter text-zinc-500 hover:text-cyan-400 transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="text" 
                  placeholder="SEARCH CHASSIS ID"
                  value={searchVin}
                  onChange={(e) => setSearchVin(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 py-5 pl-12 pr-4 rounded-sm font-mono text-[10px] text-white uppercase tracking-widest"
                />
              </form>
              {user.isLoggedIn ? (
                <>
                  <div className="px-4 py-4 border border-white/10 bg-white/5">
                    <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Logged In As</p>
                    <p className="text-lg font-black text-white mb-2">{user.name}</p>
                    <span className={`text-[8px] font-mono uppercase tracking-widest px-2 py-1 border rounded inline-block ${
                      user.role === 'buyer' ? 'border-blue-500/50 text-blue-500' :
                      user.role === 'seller' ? 'border-green-500/50 text-green-500' :
                      'border-purple-500/50 text-purple-500'
                    }`}>
                      {user.role === 'both' ? 'Buyer & Seller' : user.role.toUpperCase()}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-5 bg-red-500 text-white font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-red-600 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    console.log('Mobile Sign In clicked, navigating to /login');
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-5 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] shadow-[0_0_20px_rgba(6,182,212,0.3)] rounded hover:bg-cyan-600 transition-all"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
