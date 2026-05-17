/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Upload, ChevronRight, X, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

interface FormData {
  brand: string;
  model: string;
  year: number;
  chassis: string;
  engine: string;
  transmission: 'Manual' | 'Automatic';
  price: number;
  condition: 'Excellent' | 'Good' | 'Fair';
  mileage: number;
  color: string;
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  description: string;
  images: File[];
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
}

const initialFormData: FormData = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  chassis: '',
  engine: '',
  transmission: 'Manual',
  price: 0,
  condition: 'Good',
  mileage: 0,
  color: '',
  fuelType: 'Petrol',
  description: '',
  images: [],
  sellerName: '',
  sellerEmail: '',
  sellerPhone: '',
};

export default function SellCar() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/raw'];
      const maxSize = 25 * 1024 * 1024; // 25MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length + formData.images.length > 10) {
      setErrors(prev => ({
        ...prev,
        images: 'Maximum 10 images allowed'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (formData.year < 1970 || formData.year > new Date().getFullYear()) {
      newErrors.year = 'Invalid year';
    }
    if (!formData.chassis.trim()) newErrors.chassis = 'Chassis/VIN is required';
    if (!formData.engine.trim()) newErrors.engine = 'Engine is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.mileage < 0) newErrors.mileage = 'Mileage cannot be negative';
    if (!formData.color.trim()) newErrors.color = 'Color is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    if (!formData.sellerName.trim()) newErrors.sellerName = 'Name is required';
    if (!formData.sellerEmail.trim()) newErrors.sellerEmail = 'Email is required';
    if (!formData.sellerPhone.trim()) newErrors.sellerPhone = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        setErrors(prev => ({
          ...prev,
          submit: 'You must be logged in to sell a car'
        }));
        setIsSubmitting(false);
        return;
      }

      // Upload images first
      const uploadedImageUrls: string[] = [];
      for (const imageFile of formData.images) {
        try {
          // Convert image to base64
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
          });

          // Upload to backend
          const uploadResult: any = await apiClient.upload.image(base64, imageFile.name);
          uploadedImageUrls.push(uploadResult.url);
        } catch (uploadError) {
          console.error('Failed to upload image:', uploadError);
          // Continue with other images even if one fails
        }
      }

      // Map frontend form data to backend format
      const carData = {
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        price: formData.price,
        mileage: formData.mileage,
        condition: formData.condition.toLowerCase() as 'excellent' | 'good' | 'fair',
        fuelType: formData.fuelType.toLowerCase() as 'petrol' | 'diesel' | 'hybrid' | 'electric',
        transmission: formData.transmission.toLowerCase() as 'manual' | 'automatic',
        color: formData.color,
        description: `${formData.engine} - ${formData.description}`,
        images: uploadedImageUrls,
        seller: user.id
      };

      // Submit to API
      await apiClient.cars.create(carData);

      // Show success message
      setSubmitSuccess(true);

      // Reset form
      setFormData(initialFormData);

      // Redirect to garage after 2 seconds
      setTimeout(() => {
        navigate('/garage');
      }, 2000);
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to submit listing. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="px-6 md:px-12 py-24 bg-[#050505] min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center border border-cyan-500/50 bg-zinc-950/50 p-12 backdrop-blur"
        >
          <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChevronRight className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4">
            Listing <span className="text-cyan-500">Submitted</span>
          </h2>
          <p className="text-zinc-400 font-mono text-[9px] uppercase tracking-[0.2em] mb-8">
            Your car has been successfully added to the marketplace
          </p>
          <p className="text-zinc-500 text-sm mb-8">
            Redirecting to your garage...
          </p>
          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
              className="h-full bg-cyan-500"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-16 bg-[#050505] min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] mb-4">[ DATA UPLOADING PROTOCOL ]</div>
        <h1 className="text-5xl md:text-6xl font-black italic text-white uppercase tracking-tighter mb-2 leading-none">
          List Your <span className="text-cyan-500">Specimen</span>
        </h1>
        <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.2em] mb-12">
          Complete the form below to add your car to the marketplace
        </p>

        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 border border-red-500/50 bg-red-500/10 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="text-red-400 text-sm">{errors.submit}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Car Identification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-white/5 bg-zinc-950/50 p-8 backdrop-blur"
          >
            <h2 className="text-xl font-black italic text-cyan-500 uppercase tracking-tighter mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-cyan-500" />
              STEP 01 // IDENTIFICATION
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Nissan, Toyota, Honda"
                  className={`w-full bg-zinc-900 border py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none transition-all ${
                    errors.brand ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'
                  }`}
                />
                {errors.brand && <p className="text-red-400 text-[8px] mt-1">{errors.brand}</p>}
              </div>

              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., Skyline GT-R, Supra"
                  className={`w-full bg-zinc-900 border py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none transition-all ${
                    errors.model ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'
                  }`}
                />
                {errors.model && <p className="text-red-400 text-[8px] mt-1">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Year *</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1970"
                  max={new Date().getFullYear()}
                  className={`w-full bg-zinc-900 border py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none transition-all ${
                    errors.year ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'
                  }`}
                />
                {errors.year && <p className="text-red-400 text-[8px] mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Chassis / VIN *</label>
                <input
                  type="text"
                  name="chassis"
                  value={formData.chassis}
                  onChange={handleInputChange}
                  placeholder="e.g., BNR34-400123"
                  className={`w-full bg-zinc-900 border py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none transition-all ${
                    errors.chassis ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'
                  }`}
                />
                {errors.chassis && <p className="text-red-400 text-[8px] mt-1">{errors.chassis}</p>}
              </div>

              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Engine *</label>
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleInputChange}
                  placeholder="e.g., RB26DETT 2.6L I6 Twin Turbo"
                  className={`w-full bg-zinc-900 border py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none transition-all ${
                    errors.engine ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'
                  }`}
                />
                {errors.engine && <p className="text-red-400 text-[8px] mt-1">{errors.engine}</p>}
              </div>

              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Transmission *</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Specifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-white/5 bg-zinc-950/50 p-8 backdrop-blur"
          >
            <h2 className="text-xl font-black italic text-cyan-500 uppercase tracking-tighter mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-cyan-500" />
              STEP 02 // SPECIFICATIONS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Condition *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Mileage (km) *</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full bg-zinc-900 border py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none transition-all ${
                    errors.mileage ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'
                  }`}
                />
                {errors.mileage && <p className="text-red-400 text-[8px] mt-1">{errors.mileage}</p>}
              </div>

              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Color *</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="e.g., Silver, Red, Black"
                  className={`w-full bg-zinc-900 border py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none transition-all ${
                    errors.color ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'
                  }`}
                />
                {errors.color && <p className="text-red-400 text-[8px] mt-1">{errors.color}</p>}
              </div>

              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Fuel Type *</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-900 border border-white/10 py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Pricing & Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-white/5 bg-zinc-950/50 p-8 backdrop-blur"
          >
            <h2 className="text-xl font-black italic text-cyan-500 uppercase tracking-tighter mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-cyan-500" />
              STEP 03 // PRICING & DETAILS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 font-black">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    className={`w-full bg-zinc-900 border py-3 px-4 pl-10 text-xs font-mono uppercase text-white focus:outline-none transition-all ${
                      errors.price ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'
                    }`}
                  />
                </div>
                {errors.price && <p className="text-red-400 text-[8px] mt-1">{errors.price}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your car's condition, modifications, history, etc."
                rows={5}
                className={`w-full bg-zinc-900 border py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none transition-all resize-none ${
                  errors.description ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'
                }`}
              />
              {errors.description && <p className="text-red-400 text-[8px] mt-1">{errors.description}</p>}
            </div>
          </motion.div>

          {/* Section 4: Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border border-white/5 bg-zinc-950/50 p-8 backdrop-blur"
          >
            <h2 className="text-xl font-black italic text-cyan-500 uppercase tracking-tighter mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-cyan-500" />
              STEP 04 // MEDIA UPLOAD
            </h2>

            <div className="mb-6">
              <label className="block border-2 border-dashed border-white/10 hover:border-cyan-500/50 transition-colors cursor-pointer bg-zinc-950/20 p-12 text-center group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="w-12 h-12 text-zinc-700 mb-4 group-hover:text-cyan-500 transition-colors mx-auto" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Upload High-Res Media</span>
                <p className="text-[9px] text-zinc-700 mt-2">JPG, PNG (MAX 25MB each, up to 10 images)</p>
              </label>
              {errors.images && <p className="text-red-400 text-[8px] mt-2">{errors.images}</p>}
            </div>

            {formData.images.length > 0 && (
              <div>
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-4">
                  {formData.images.length} / 10 IMAGES UPLOADED
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover border border-white/10 group-hover:border-cyan-500/50 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 p-1 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                      <p className="text-[7px] font-mono text-zinc-600 mt-1 truncate">{image.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Section 5: Seller Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border border-white/5 bg-zinc-950/50 p-8 backdrop-blur"
          >
            <h2 className="text-xl font-black italic text-cyan-500 uppercase tracking-tighter mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-cyan-500" />
              STEP 05 // SELLER INFORMATION
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Full Name *</label>
                <input
                  type="text"
                  name="sellerName"
                  value={formData.sellerName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className={`w-full bg-zinc-900 border py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none transition-all ${
                    errors.sellerName ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'
                  }`}
                />
                {errors.sellerName && <p className="text-red-400 text-[8px] mt-1">{errors.sellerName}</p>}
              </div>

              <div>
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Email *</label>
                <input
                  type="email"
                  name="sellerEmail"
                  value={formData.sellerEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={`w-full bg-zinc-900 border py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none transition-all ${
                    errors.sellerEmail ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'
                  }`}
                />
                {errors.sellerEmail && <p className="text-red-400 text-[8px] mt-1">{errors.sellerEmail}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="sellerPhone"
                  value={formData.sellerPhone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full bg-zinc-900 border py-3 px-4 text-xs font-mono uppercase text-white focus:outline-none transition-all ${
                    errors.sellerPhone ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'
                  }`}
                />
                {errors.sellerPhone && <p className="text-red-400 text-[8px] mt-1">{errors.sellerPhone}</p>}
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                  />
                  SUBMITTING...
                </>
              ) : (
                <>
                  Submit to Index <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setFormData(initialFormData)}
              className="px-8 py-4 border border-white/10 text-white font-black uppercase text-xs tracking-[0.3em] hover:border-cyan-500/50 hover:text-cyan-500 transition-all"
            >
              Reset
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
