/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Star, ThumbsUp, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { useReviews, Review } from '../hooks/useReviews';

interface ReviewsSectionProps {
  carId: string;
  carName: string;
}

export default function ReviewsSection({ carId, carName }: ReviewsSectionProps) {
  const { getCarReviews, getAverageRating, addReview, deleteReview, markHelpful } = useReviews();
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const carReviews = getCarReviews(carId);
  const averageRating = getAverageRating(carId);
  const currentUser = localStorage.getItem('user');
  const userName = currentUser ? JSON.parse(currentUser).name : 'Anonymous';

  const handleSubmitReview = () => {
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Review title is required');
      return;
    }

    if (!comment.trim()) {
      setError('Review comment is required');
      return;
    }

    try {
      addReview({
        carId,
        userId: 'user-' + Date.now(),
        userName,
        rating,
        title,
        comment,
        helpful: 0,
      });

      setSuccess('Review posted successfully!');
      setTitle('');
      setComment('');
      setRating(5);
      setIsAddingReview(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to post review');
    }
  };

  const renderStars = (count: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            className={`transition-all ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
            disabled={!interactive}
          >
            <Star
              className={`w-4 h-4 ${
                star <= count
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-zinc-700'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-zinc-950 border border-white/5 p-6">
        <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-6">
          Reviews & <span className="text-cyan-500">Ratings</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-black text-cyan-500 mb-2">{averageRating}</div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(parseFloat(averageRating as string)))}
            </div>
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
              Based on {carReviews.length} review{carReviews.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2 space-y-2">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = carReviews.filter(r => r.rating === stars).length;
              const percentage = carReviews.length > 0 ? (count / carReviews.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-[9px] font-mono text-zinc-600">{stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-zinc-900 border border-white/5">
                    <div
                      className="h-full bg-cyan-500 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-600 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Review Button */}
        {!isAddingReview && (
          <button
            onClick={() => setIsAddingReview(true)}
            className="w-full py-3 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Add Review Form */}
      <AnimatePresence>
        {isAddingReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-zinc-950 border border-white/5 p-6 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-black italic text-white uppercase tracking-tighter">
                Share Your Experience
              </h4>
              <button
                onClick={() => setIsAddingReview(false)}
                className="text-zinc-600 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 border border-red-500/50 bg-red-500/10 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 border border-green-500/50 bg-green-500/10 text-green-400 text-sm"
              >
                {success}
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-3">
                  Rating
                </label>
                <div className="flex gap-2">
                  {renderStars(rating, true, setRating)}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience..."
                  className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your detailed thoughts about this car..."
                  rows={4}
                  className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 py-3 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all"
                >
                  Post Review
                </button>
                <button
                  onClick={() => setIsAddingReview(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {carReviews.length === 0 ? (
          <div className="bg-zinc-950 border border-white/5 p-8 text-center">
            <div className="text-zinc-600 font-mono text-[10px] tracking-[0.5em] mb-2">NO_REVIEWS_YET</div>
            <div className="text-zinc-700 text-sm">Be the first to review this {carName}</div>
          </div>
        ) : (
          carReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-zinc-950 border border-white/5 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
                      {review.date}
                    </span>
                  </div>
                  <h4 className="text-lg font-black italic text-white uppercase tracking-tighter">
                    {review.title}
                  </h4>
                  <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mt-1">
                    By {review.userName}
                  </p>
                </div>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="text-zinc-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{review.comment}</p>

              <button
                onClick={() => markHelpful(review.id)}
                className="flex items-center gap-2 text-[9px] font-mono text-zinc-600 hover:text-cyan-500 transition-colors uppercase tracking-[0.2em]"
              >
                <ThumbsUp className="w-3 h-3" />
                Helpful ({review.helpful})
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
