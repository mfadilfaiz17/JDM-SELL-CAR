/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Package, Lock, Edit, Trash2, Plus, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_CARS, Car } from '../constants';

interface UserListing extends Car {
  listingDate: string;
  views: number;
  isActive: boolean;
}

export default function Garage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);
  const [userListings, setUserListings] = useState<UserListing[]>([
    {
      ...ALL_CARS[0],
      listingDate: '2026-05-01',
      views: 245,
      isActive: true
    },
    {
      ...ALL_CARS[1],
      listingDate: '2026-04-28',
      views: 128,
      isActive: true
    },
    {
      ...ALL_CARS[2],
      listingDate: '2026-04-15',
      views: 89,
      isActive: false
    }
  ]);
  const [selectedListing, setSelectedListing] = useState<UserListing | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<UserListing>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserListings([]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="px-6 md:px-12 py-32 bg-[#050505] min-h-[80vh] flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
        <div className="relative z-10 animate-fadeIn">
          <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] mb-4">[ LOADING ]</div>
          <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="px-6 md:px-12 py-32 bg-[#050505] min-h-[80vh] flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

        <div className="relative z-10 max-w-md animate-fadeIn">
          <div className="w-24 h-24 mb-8 bg-zinc-900 border border-white/5 flex items-center justify-center relative mx-auto">
            <Package className="w-10 h-10 text-zinc-700" />
            <div className="absolute -top-2 -right-2">
              <Lock className="w-6 h-6 text-cyan-500" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black italic text-white uppercase tracking-tighter mb-4">
            Your <span className="text-cyan-500">Garage</span>
          </h1>
          
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest max-w-md mx-auto leading-relaxed mb-4">
            Access your personal inventory and manage your car listings
          </p>

          <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.2em] mb-12">
            Sign in to your account to continue
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-12 py-5 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.4em] hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Garage
            </button>

            <div className="text-center">
              <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.2em] mb-3">
                Don't have an account?
              </p>
              <button
                onClick={() => navigate('/register')}
                className="text-cyan-500 hover:text-cyan-400 font-black uppercase text-xs tracking-[0.2em] transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = (listing: UserListing) => {
    setSelectedListing(listing);
    setEditFormData(listing);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedListing) {
      setUserListings(prev =>
        prev.map(listing =>
          listing.id === selectedListing.id
            ? { ...listing, ...editFormData }
            : listing
        )
      );
      setIsEditModalOpen(false);
      setSelectedListing(null);
    }
  };

  const handleDelete = (id: string) => {
    setUserListings(prev => prev.filter(listing => listing.id !== id));
    setDeleteConfirm(null);
  };

  const handleToggleActive = (id: string) => {
    setUserListings(prev =>
      prev.map(listing =>
        listing.id === id
          ? { ...listing, isActive: !listing.isActive }
          : listing
      )
    );
  };

  const totalViews = userListings.reduce((sum, listing) => sum + listing.views, 0);
  const activeListing = userListings.filter(l => l.isActive).length;
  const inactiveListing = userListings.filter(l => !l.isActive).length;

  if (!isLoggedIn) {
    return (
      <div className="px-6 md:px-12 py-32 bg-[#050505] min-h-[80vh] flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

        <div className="relative z-10 animate-fadeIn">
          <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] mb-4">[ SECURE_STORAGE_ACCESS ]</div>
          <div className="w-24 h-24 mb-8 bg-zinc-900 border border-white/5 flex items-center justify-center relative mx-auto">
            <Package className="w-10 h-10 text-zinc-700" />
            <div className="absolute -top-2 -right-2">
              <Lock className="w-6 h-6 text-cyan-500" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter mb-4">
            Your <span className="text-cyan-500">Garage</span>
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest max-w-md mx-auto leading-relaxed mb-12">
            Storage protocols active. Sign in to synchronize your private collection with the digital mainframe.
          </p>

          <button
            onClick={handleLogin}
            className="px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.4em] hover:bg-cyan-500 transition-colors"
          >
            Login to Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-16 bg-[#050505] min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] mb-2">[ PERSONAL_INVENTORY ]</div>
              <h1 className="text-5xl md:text-6xl font-black italic text-white uppercase tracking-tighter">
                Your <span className="text-cyan-500">Garage</span>
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 border border-white/10 text-white font-black uppercase text-xs tracking-[0.2em] hover:border-red-500/50 hover:text-red-500 transition-all"
            >
              Logout
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-white/5 bg-zinc-950/50 p-4 backdrop-blur">
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Total Listings</p>
              <p className="text-3xl font-black text-cyan-500">{userListings.length}</p>
            </div>

            <div className="border border-white/5 bg-zinc-950/50 p-4 backdrop-blur">
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Active</p>
              <p className="text-3xl font-black text-green-500">{activeListing}</p>
            </div>

            <div className="border border-white/5 bg-zinc-950/50 p-4 backdrop-blur">
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Inactive</p>
              <p className="text-3xl font-black text-amber-500">{inactiveListing}</p>
            </div>

            <div className="border border-white/5 bg-zinc-950/50 p-4 backdrop-blur">
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Total Views</p>
              <p className="text-3xl font-black text-purple-500">{totalViews}</p>
            </div>
          </div>
        </div>

        {/* Add New Listing Button */}
        <button
          onClick={() => navigate('/sell')}
          className="mb-8 w-full md:w-auto px-8 py-4 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Listing
        </button>

        {/* Listings */}
        {userListings.length === 0 ? (
          <div className="py-24 text-center border border-white/5 bg-zinc-950/50 animate-fadeIn">
            <Package className="w-16 h-16 mx-auto text-zinc-800 mb-4" />
            <div className="text-zinc-600 font-mono text-[10px] tracking-[0.5em] mb-4">NO_LISTINGS_FOUND</div>
            <div className="text-2xl font-black italic text-zinc-800 uppercase mb-8">Your Garage is Empty</div>
            <button
              onClick={() => navigate('/sell')}
              className="px-8 py-3 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all"
            >
              Create Your First Listing
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {userListings.map((listing, index) => (
              <div
                key={listing.id}
                className="border border-white/5 bg-zinc-950/50 p-6 backdrop-blur hover:border-cyan-500/30 transition-all animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Image */}
                  <div className="md:col-span-1">
                    <div className="h-40 bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden relative group">
                      {listing.image ? (
                        <img
                          src={listing.image}
                          alt={listing.famousName}
                          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-zinc-700" />
                      )}
                      <div className={`absolute top-2 right-2 px-2 py-1 text-[7px] font-mono uppercase tracking-widest border ${
                        listing.isActive
                          ? 'border-green-500/50 text-green-500 bg-green-500/10'
                          : 'border-amber-500/50 text-amber-500 bg-amber-500/10'
                      }`}>
                        {listing.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-xl font-black italic text-white uppercase tracking-tighter mb-1">
                        {listing.famousName}
                      </h3>
                      <p className="text-[9px] text-zinc-600 uppercase font-mono mb-1">{listing.modelDetail}</p>
                      <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-[0.2em]">{listing.brand}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div>
                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.2em] block mb-1">Price</span>
                        <span className="text-lg font-black text-cyan-500">${listing.price}k</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.2em] block mb-1">Year</span>
                        <span className="text-lg font-black text-white">{listing.year}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.2em] block mb-1">Views</span>
                        <span className="text-lg font-black text-purple-500">{listing.views}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.2em] block mb-1">Listed</span>
                        <span className="text-lg font-black text-zinc-400">{listing.listingDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex flex-col gap-3">
                    <button
                      onClick={() => handleToggleActive(listing.id)}
                      className={`flex-1 py-3 border font-black uppercase text-[9px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                        listing.isActive
                          ? 'border-green-500/50 text-green-500 hover:bg-green-500/10'
                          : 'border-amber-500/50 text-amber-500 hover:bg-amber-500/10'
                      }`}
                    >
                      {listing.isActive ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          Activate
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleEdit(listing)}
                      className="flex-1 py-3 border border-cyan-500/50 text-cyan-500 font-black uppercase text-[9px] tracking-[0.2em] hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteConfirm(listing.id)}
                      className="flex-1 py-3 border border-red-500/50 text-red-500 font-black uppercase text-[9px] tracking-[0.2em] hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === listing.id && (
                  <div className="mt-4 pt-4 border-t border-red-500/30 bg-red-500/10 p-4 animate-fadeIn">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="text-red-400 text-sm">Are you sure you want to delete this listing?</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="flex-1 py-2 bg-red-500 text-white font-black uppercase text-[9px] tracking-[0.2em] hover:bg-red-600 transition-all"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 py-2 border border-white/10 text-white font-black uppercase text-[9px] tracking-[0.2em] hover:border-white/30 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedListing && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950 border border-white/5 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
          >
              <h2 className="text-2xl font-black italic text-cyan-500 uppercase tracking-tighter mb-6">
                Edit Listing
              </h2>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 font-black">$</span>
                    <input
                      type="number"
                      value={editFormData.price || 0}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      className="w-full bg-zinc-900 border border-white/10 py-3 px-4 pl-10 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Availability</label>
                  <select
                    value={editFormData.availability || 'Available'}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, availability: e.target.value as any }))}
                    className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Arriving Soon">Arriving Soon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Mileage (km)</label>
                  <input
                    type="number"
                    value={editFormData.capacity || 0}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-3 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 border border-white/10 text-white font-black uppercase text-xs tracking-[0.3em] hover:border-white/30 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
