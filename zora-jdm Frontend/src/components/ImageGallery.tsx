import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title?: string;
  className?: string;
}

export default function ImageGallery({ 
  images, 
  title,
  className = '' 
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900 border border-white/10 rounded ${className}`}>
        <div className="text-center p-8">
          <p className="text-zinc-500 text-sm">Tidak ada gambar</p>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedIndex];
  const hasMultiple = images.length > 1;

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Main Gallery */}
      <div className={`relative bg-zinc-900 border border-white/10 rounded overflow-hidden group ${className}`}>
        {/* Main Image */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedIndex}
              src={currentImage}
              alt={`${title} - Image ${selectedIndex + 1}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsFullscreen(true)}
              className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
            />
          </AnimatePresence>

          {/* Navigation Buttons */}
          {hasMultiple && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-cyan-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-cyan-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </>
          )}

          {/* Image Counter */}
          {hasMultiple && (
            <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded text-xs font-mono text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {hasMultiple && (
          <div className="p-3 bg-zinc-950 border-t border-white/5 overflow-x-auto">
            <div className="flex gap-2">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  whileHover={{ scale: 1.05 }}
                  className={`shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                    index === selectedIndex
                      ? 'border-cyan-500'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Fullscreen Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage}
                alt={`${title} - Fullscreen`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation in Fullscreen */}
              {hasMultiple && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={goToPrevious}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={goToNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>

                  {/* Counter in Fullscreen */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded text-sm font-mono text-white">
                    {selectedIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
