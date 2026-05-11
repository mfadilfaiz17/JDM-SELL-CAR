/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  role: 'buyer' | 'seller' | 'both';
  profileImage?: string;
  joinDate?: string;
  totalListings?: number;
  totalPurchases?: number;
  rating?: number;
  reviews?: number;
}

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const userProfile: UserData = {
          name: parsed.name || 'User',
          email: parsed.email || '',
          phone: parsed.phone || '',
          location: parsed.location || '',
          bio: parsed.bio || '',
          role: parsed.role || 'buyer',
          profileImage: parsed.profileImage || '',
          joinDate: parsed.joinDate || new Date().toLocaleDateString(),
          totalListings: parsed.totalListings || 0,
          totalPurchases: parsed.totalPurchases || 0,
          rating: parsed.rating || 0,
          reviews: parsed.reviews || 0,
        };
        setUser(userProfile);
        setFormData(userProfile);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveProfile = async () => {
    if (!formData) return;

    setError('');
    setSuccess('');

    try {
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(formData));
      setUser(formData);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      // In a real app, this would call the backend API
      // For now, just show success
      setSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    }
  };

  if (!user) {
    return (
      <div className="px-6 md:px-12 py-24 bg-[#050505] min-h-screen flex items-center justify-center">
        <div className="text-zinc-600 font-mono text-[10px] tracking-[0.5em]">LOADING_PROFILE...</div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-16 bg-[#050505] min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] mb-2">[ USER_PROFILE_SYSTEM ]</div>
          <h1 className="text-5xl md:text-6xl font-black italic text-white uppercase tracking-tighter mb-8">
            My <span className="text-cyan-500">Profile</span>
          </h1>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 border border-green-500/50 bg-green-500/10 text-green-400 text-sm"
          >
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 border border-red-500/50 bg-red-500/10 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950 border border-white/5 p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 bg-linear-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 rounded-lg flex items-center justify-center relative group">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <User className="w-16 h-16 text-zinc-600" />
                )}
                {isEditing && (
                  <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>
              <div className="text-center">
                <div className={`text-[8px] font-mono uppercase tracking-widest px-2 py-1 border rounded inline-block ${
                  user.role === 'buyer' ? 'border-blue-500/50 text-blue-500' :
                  user.role === 'seller' ? 'border-green-500/50 text-green-500' :
                  'border-purple-500/50 text-purple-500'
                }`}>
                  {user.role === 'both' ? 'Buyer & Seller' : user.role.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing && formData ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-sm font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-sm font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-sm font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-sm font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-3 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white transition-all"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(user);
                      }}
                      className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-1">{user.name}</h2>
                    <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.2em]">{user.email}</p>
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-3 text-zinc-400">
                      <Phone className="w-4 h-4" />
                      <span className="font-mono text-[9px]">{user.phone}</span>
                    </div>
                  )}

                  {user.location && (
                    <div className="flex items-center gap-3 text-zinc-400">
                      <MapPin className="w-4 h-4" />
                      <span className="font-mono text-[9px]">{user.location}</span>
                    </div>
                  )}

                  {user.bio && (
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-zinc-400 text-sm">{user.bio}</p>
                    </div>
                  )}

                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 py-3 px-6 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-[0.3em] flex items-center gap-2 hover:bg-white/10 hover:border-cyan-500/50 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/5">
            <div className="text-center">
              <div className="text-2xl font-black text-cyan-500 mb-1">{user.totalListings || 0}</div>
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Listings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-cyan-500 mb-1">{user.totalPurchases || 0}</div>
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Purchases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-cyan-500 mb-1">{user.rating || 0}</div>
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-cyan-500 mb-1">{user.reviews || 0}</div>
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Reviews</div>
            </div>
          </div>
        </motion.div>

        {/* Change Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-950 border border-white/5 p-8"
        >
          <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-6">
            Security <span className="text-cyan-500">Settings</span>
          </h3>

          {isChangingPassword ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-sm font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-sm font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-sm font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 py-3 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all"
                >
                  Change Password
                </button>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="py-3 px-6 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-white/10 hover:border-cyan-500/50 transition-all"
            >
              Change Password
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
