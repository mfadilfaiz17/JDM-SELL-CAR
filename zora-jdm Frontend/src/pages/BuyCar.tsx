/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ALL_CARS, Car } from '../constants';
import { Search, BarChart2, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ComparisonModal from '../components/ComparisonModal';
import { useFavorites } from '../hooks/useFavorites';
import { usePagination } from '../hooks/usePagination';
import { generateWhatsAppUrl } from '../config/contact';
import { useCars } from '../hooks/useCars';

interface InventoryProps {
  onSelectCar: (car: Car) => void;
}

export default function BuyCar({ onSelectCar }: InventoryProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'Modified' | 'Standard'>('ALL');
  const [compareList, setCompareList] = useState<Car[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedModel, setSelectedModel] = useState<string>('ALL');
  const [selectedCondition, setSelectedCondition] = useState<string>('ALL');
  const [selectedFuelType, setSelectedFuelType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('name');
  const [minYear, setMinYear] = useState<number>(1970);
  const [maxYear, setMaxYear] = useState<number>(2025);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [showFilters, setShowFilters] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Fetch cars from API with fallback to constants
  const { cars: apiCars, loading, error } = useCars();
  const allCars = apiCars.length > 0 ? apiCars : ALL_CARS;

  // Filter cars based on all criteria
  const filteredCars = allCars.filter(car => {
    const matchesSearch = 
      car.famousName.toLowerCase().includes(filter.toLowerCase()) || 
      car.modelDetail.toLowerCase().includes(filter.toLowerCase()) || 
      car.brand.toLowerCase().includes(filter.toLowerCase()) ||
      car.chassis.toLowerCase().includes(filter.toLowerCase());
    
    const matchesCategory = activeCategory === 'ALL' || car.category === activeCategory;
    const matchesBrand = selectedBrand === 'ALL' || car.brand === selectedBrand;
    const matchesModel = selectedModel === 'ALL' || car.modelDetail === selectedModel;
    const matchesCondition = selectedCondition === 'ALL' || car.availability === selectedCondition;
    const matchesFuelType = selectedFuelType === 'ALL' || car.engine.toLowerCase().includes(selectedFuelType.toLowerCase());
    const matchesYear = car.year >= minYear && car.year <= maxYear;
    const matchesPrice = car.price >= minPrice && car.price <= maxPrice;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesModel && matchesCondition && matchesFuelType && matchesYear && matchesPrice;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'year-new':
        return b.year - a.year;
      case 'year-old':
        return a.year - b.year;
      case 'name':
      default:
        return a.famousName.localeCompare(b.famousName);
    }
  });

  // Pagination hook
  const pagination = usePagination(filteredCars, { itemsPerPage: 12 });

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== filter) {
      setFilter(q);
    }
  }, [searchParams]);

  const handleFilterChange = (val: string) => {
    setFilter(val);
    if (val.trim()) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      searchParams.delete('q');
      setSearchParams(searchParams, { replace: true });
    }
  };

  // Get unique brands for filter dropdown
  const uniqueBrands = Array.from(new Set(allCars.map(car => car.brand))).sort();
  
  // Get unique models for selected brand
  const uniqueModels = selectedBrand === 'ALL' 
    ? Array.from(new Set(allCars.map(car => car.modelDetail))).sort()
    : Array.from(new Set(allCars.filter(car => car.brand === selectedBrand).map(car => car.modelDetail))).sort();

  // Get unique conditions (based on availability)
  const conditions = ['ALL', 'Available', 'Reserved', 'Sold'];
  
  // Get unique fuel types (from engine data)
  const fuelTypes = ['ALL', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];

  const modifiedCars = pagination.currentItems.filter((c: Car) => c.category === 'Modified');
  const standardCars = pagination.currentItems.filter((c: Car) => c.category === 'Standard');

  const toggleCompare = (e: React.MouseEvent, car: Car) => {
    e.stopPropagation();
    if (compareList.find(c => c.id === car.id)) {
      setCompareList(compareList.filter(c => c.id !== car.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, car]);
    }
  };

  const formatIDR = (price: number) => {
    // price is in thousands (k), convert to actual USD then to IDR
    const idr = price * 1000 * 16250; // 1 USD = Rp 16,250
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(idr);
  };

  const renderCarGrid = (cars: Car[]) => {
    // Show empty state
    if (cars.length === 0) {
      return (
        <div className="col-span-full py-24 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-zinc-900 border border-white/5 flex items-center justify-center">
            <Search className="w-8 h-8 text-zinc-700" />
          </div>
          <div className="text-zinc-600 font-mono text-[10px] tracking-[0.5em] mb-4">NO RESULTS FOUND</div>
          <div className="text-2xl font-black italic text-zinc-800 uppercase mb-8">No Cars Match Your Criteria</div>
          <button
            onClick={() => {
              setFilter('');
              setSelectedBrand('ALL');
              setSelectedModel('ALL');
              setSelectedCondition('ALL');
              setSelectedFuelType('ALL');
              setActiveCategory('ALL');
            }}
            className="px-8 py-3 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all"
          >
            Clear All Filters
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cars.map((car, index) => (
        <div
          key={car.id}
          onClick={() => onSelectCar(car)}
          className="group cursor-pointer relative hover:-translate-y-2 transition-transform duration-300"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/2 transition-colors duration-300 rounded-none pointer-events-none" />
          
          <div className="bg-zinc-950 border border-white/5 p-6 relative z-10 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden h-full flex flex-col">
            {/* Card Decoration */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/0 group-hover:border-cyan-500/30 transition-all" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-white/0 group-hover:border-cyan-500/30 transition-all" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-1">
                <div className="text-[8px] font-mono text-zinc-800 tracking-tighter">DATA REF 0{index + 1}</div>
                <div className={`text-[7px] font-mono px-1 w-fit border ${
                  car.category === 'Modified' ? 'border-purple-500/50 text-purple-500/70' : 'border-zinc-700 text-zinc-600'
                }`}>
                  {car.category.toUpperCase()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(car.id);
                  }}
                  className="text-zinc-600 hover:text-red-500 transition-colors"
                >
                  <Heart 
                    className="w-4 h-4" 
                    fill={isFavorite(car.id) ? 'currentColor' : 'none'}
                  />
                </button>
                <div className={`text-[8px] font-mono px-1.5 py-0.5 border ${
                  car.availability === 'Available' ? 'border-cyan-500/50 text-cyan-500/70' : 
                  car.availability === 'Reserved' ? 'border-amber-500/50 text-amber-500/70' : 
                  'border-zinc-700 text-zinc-600'
                }`}>
                  {car.availability.toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="h-48 mb-6 flex items-center justify-center p-2 relative overflow-hidden">
              {/* Image Hologram Effect */}
              <div className="absolute inset-0 bg-linear-to-t from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 transition-all duration-300" />
                  {car.image ? (
                    <img
                      src={car.image}
                      alt={car.famousName}
                      loading="lazy"
                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 relative z-10"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border border-white/5 bg-white/5">
                      <span className="text-[10px] font-mono text-zinc-800 uppercase tracking-widest">No Image Data</span>
                    </div>
                  )}
            </div>

            <div className="grow">
              <h3 className="text-xl font-black italic uppercase leading-none text-white tracking-tighter mb-1 group-hover:text-cyan-400 transition-colors">{car.famousName}</h3>
              <p className="text-[9px] text-zinc-600 uppercase font-mono mb-1 leading-tight">{car.modelDetail}</p>
              <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-[0.2em] mb-4">{car.brand}</p>

              {/* Primary Info (Visible Always) */}
              <div className="mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl font-black italic text-white group-hover:scale-105 transition-transform origin-left">${car.price}k</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => toggleCompare(e, car)}
                      className={`px-2 py-1 border text-[7px] font-mono transition-all duration-300 ${
                        compareList.find(c => c.id === car.id)
                          ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                          : 'border-white/10 text-zinc-600 hover:border-cyan-500/30 hover:text-cyan-500'
                      }`}
                    >
                      {compareList.find(c => c.id === car.id) ? '[ COMPARE ON ]' : '[ ADD TO CMP ]'}
                    </button>
                    <div className="text-[9px] font-mono text-zinc-500 group-hover:text-cyan-500 transition-colors">
                      UNIT://{car.year}
                    </div>
                  </div>
                </div>
                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                  Est. {formatIDR(car.price)}
                </div>
              </div>

              {/* Hover Reveal Details */}
              <div className="max-h-0 group-hover:max-h-[500px] opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-300">
                <div className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                    <div className="space-y-1">
                      <span className="block text-[7px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Powertrain</span>
                      <span className="block text-[9px] font-black text-cyan-500 italic uppercase truncate">{car.engine}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[7px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Efficiency</span>
                      <span className="block text-[9px] font-mono text-zinc-300 uppercase">{car.efficiency || 'HIGH PERF'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 p-2 border border-white/5 hover:border-cyan-500/30 transition-colors">
                      <span className="block text-[6px] font-mono text-zinc-600 uppercase mb-1 text-center">Gearbox</span>
                      <span className="block text-[8px] font-black text-white text-center uppercase tracking-tighter">
                        {car.transmission === 'Automatic' ? 'Auto' : 'Manual'}
                      </span>
                    </div>
                    <div className="bg-white/5 p-2 border border-white/5 hover:border-cyan-500/30 transition-colors">
                      <span className="block text-[6px] font-mono text-zinc-600 uppercase mb-1 text-center">Seats</span>
                      <span className="block text-[8px] font-black text-white text-center uppercase tracking-tighter">
                        {car.capacity || 2} UNIT
                      </span>
                    </div>
                    <div className="bg-white/5 p-2 border border-white/5 hover:border-cyan-500/30 transition-colors">
                      <span className="block text-[6px] font-mono text-zinc-600 uppercase mb-1 text-center">Chassis</span>
                      <span className="block text-[8px] font-black text-white text-center uppercase tracking-tighter truncate">
                        {car.chassis.split('-')[0] || 'STK'}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onSelectCar(car)}
                    className="w-full py-3 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300"
                  >
                    Details
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const whatsappUrl = generateWhatsAppUrl(car.famousName, car.modelDetail, car.price);
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="w-full py-3 bg-white/10 border border-cyan-500/50 text-cyan-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cyan-500/20 transition-all duration-300"
                  >
                    Contact Seller
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    );
  };

  return (
    <div className="px-6 md:px-12 py-16 bg-[#050505] min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
      
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em]">LOADING INVENTORY...</div>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="relative z-10 mb-8 p-4 border border-red-500/50 bg-red-500/10 text-red-400 text-sm">
          <div className="font-mono text-[10px] tracking-[0.3em] mb-2">[ API ERROR ]</div>
          {error}
          <div className="mt-2 text-[9px] text-red-500/70">Showing cached data...</div>
        </div>
      )}
      
      <div className="relative z-10 mb-12">
        <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] mb-2">[ MARKET BROKER ACCESS ]</div>
        <h1 className="text-5xl md:text-6xl font-black italic text-white uppercase tracking-tighter mb-8">
          Inventory <span className="text-cyan-500">System</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between bg-zinc-950/50 p-6 border border-white/5 backdrop-blur-md">
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" />
            <input 
              type="text"
              placeholder="SEARCH BY MODEL BRAND CHASSIS..."
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 py-5 pl-14 pr-6 text-xs font-mono uppercase tracking-[0.2em] text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-800"
            />
          </div>

          <div className="flex gap-2 p-1 bg-black/50 border border-white/10">
            {(['ALL', 'Modified', 'Standard'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-cyan-500/50 transition-all flex items-center gap-2"
          >
            <BarChart2 className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-zinc-950/50 border border-white/5 p-6 backdrop-blur-md mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 animate-fadeIn">

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel('ALL');
                }}
                className="w-full bg-zinc-950 border border-white/10 py-2 px-3 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              >
                <option value="ALL">All Brands</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Model Filter */}
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 py-2 px-3 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              >
                <option value="ALL">All Models</option>
                {uniqueModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 py-2 px-3 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type Filter */}
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Fuel Type</label>
              <select
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 py-2 px-3 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              >
                {fuelTypes.map(fuel => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 py-2 px-3 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="year-new">Year (Newest)</option>
                <option value="year-old">Year (Oldest)</option>
              </select>
            </div>

            {/* Year Range Filter */}
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Year: {minYear} - {maxYear}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1970"
                  max="2025"
                  value={minYear}
                  onChange={(e) => setMinYear(Math.min(parseInt(e.target.value) || 1970, maxYear))}
                  className="flex-1 bg-zinc-950 border border-white/10 py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  placeholder="Min"
                />
                <input
                  type="number"
                  min="1970"
                  max="2025"
                  value={maxYear}
                  onChange={(e) => setMaxYear(Math.max(parseInt(e.target.value) || 2025, minYear))}
                  className="flex-1 bg-zinc-950 border border-white/10 py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Price: ${minPrice}k - ${maxPrice}k</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="2000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.min(parseInt(e.target.value) || 0, maxPrice))}
                  className="flex-1 bg-zinc-950 border border-white/10 py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  placeholder="Min"
                />
                <input
                  type="number"
                  min="0"
                  max="2000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(parseInt(e.target.value) || 2000, minPrice))}
                  className="flex-1 bg-zinc-950 border border-white/10 py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedBrand('ALL');
                  setSelectedModel('ALL');
                  setSelectedCondition('ALL');
                  setSelectedFuelType('ALL');
                  setSortBy('name');
                  setMinYear(1970);
                  setMaxYear(2025);
                  setMinPrice(0);
                  setMaxPrice(2000);
                  setFilter('');
                }}
                className="w-full py-2 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-cyan-500/50 transition-all"
              >
                Reset All
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-24">
        {(activeCategory === 'ALL' || activeCategory === 'Modified') && modifiedCars.length > 0 && (
          <div>
            <h2 className="text-2xl font-black italic text-purple-500 uppercase tracking-tighter mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500/30" />
              MODIFIED SPECS
              <span className="grow h-px bg-zinc-900" />
            </h2>
            {renderCarGrid(modifiedCars as Car[])}
          </div>
        )}

        {(activeCategory === 'ALL' || activeCategory === 'Standard') && standardCars.length > 0 && (
          <div>
            <h2 className="text-2xl font-black italic text-zinc-500 uppercase tracking-tighter mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-zinc-500/30" />
              STANDARD SPECS
              <span className="grow h-px bg-zinc-900" />
            </h2>
            {renderCarGrid(standardCars as Car[])}
          </div>
        )}

        {filteredCars.length === 0 && (
          <div className="py-24 text-center border border-white/5 bg-zinc-950/50">
            <div className="text-zinc-600 font-mono text-[10px] tracking-[0.5em] mb-4">SEARCH RESULT: NULL</div>
            <div className="text-2xl font-black italic text-zinc-800 uppercase">No Units Found Matching Parameters</div>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-12 border-t border-white/5 mt-12">
            <button
              onClick={() => pagination.prevPage()}
              disabled={!pagination.hasPrevPage}
              className="p-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => pagination.goToPage(page)}
                  className={`w-10 h-10 text-[10px] font-black uppercase tracking-widest transition-all ${
                    pagination.currentPage === page
                      ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-cyan-500/50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => pagination.nextPage()}
              disabled={!pagination.hasNextPage}
              className="p-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="ml-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Page {pagination.currentPage} of {pagination.totalPages} | {pagination.totalItems} Total Units
            </div>
          </div>
        )}
      </div>

      {/* Floating Comparison Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-cyan-500/30 p-4 md:px-12 flex items-center justify-between shadow-[0_-20px_50px_rgba(0,0,0,0.8)] animate-slideUp">

          <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0">
            <div className="text-cyan-500 font-mono text-[10px] tracking-widest uppercase hidden md:block">
              COMPARE QUEUE [{compareList.length}/3]
            </div>
            <div className="flex gap-4">
              {compareList.map(car => (
                <div key={car.id} className="relative group flex items-center gap-3 bg-white/5 border border-white/10 p-2 pr-4 min-w-[150px]">
                  <div className="w-12 h-8 shrink-0">
                    <img
                      src={car.image || ''}
                      alt={car.famousName}
                      loading="lazy"
                      className="w-full h-full object-contain mix-blend-screen"
                    />
                  </div>
                  <div className="grow">
                    <div className="text-[9px] font-black italic uppercase leading-none truncate w-24 text-white">{car.famousName}</div>
                  </div>
                  <button 
                    onClick={(e) => toggleCompare(e, car)}
                    className="text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {compareList.length < 3 && (
                <div className="hidden sm:flex border border-zinc-800 border-dashed p-2 min-w-[150px] items-center justify-center text-zinc-700 font-mono text-[8px] uppercase tracking-widest">
                  Slot Empty ID
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCompareList([])}
              className="text-[9px] font-mono text-zinc-500 hover:text-white uppercase tracking-widest px-4 hidden sm:block"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-8 py-3 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              Initialize Comparison
            </button>
          </div>
        </div>
      )}

      <ComparisonModal 
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        cars={compareList}
      />
    </div>
  );
}
