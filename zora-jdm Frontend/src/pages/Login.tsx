/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use API client
      const data: any = await apiClient.auth.login(email, password);

      // Store token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to home
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Make sure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 md:px-12 py-24 bg-[#050505] min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="border border-white/5 bg-zinc-950/50 p-8 backdrop-blur">
          <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] mb-6">[ AUTH PROTOCOL ]</div>
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">
            Sign In
          </h1>
          <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.2em] mb-8">
            Access your garage and manage listings
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 border border-red-500/50 bg-red-500/10 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-zinc-900 border border-white/10 py-3 px-4 pl-12 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-white/10 py-3 px-4 pl-12 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Signing In...' : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-4">
              Don't have an account?
            </p>
            <Link
              to="/register"
              className="text-cyan-500 hover:text-cyan-400 font-black uppercase text-xs tracking-[0.2em] transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
