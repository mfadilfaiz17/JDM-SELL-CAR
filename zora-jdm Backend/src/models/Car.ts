import mongoose, { Schema, Document } from 'mongoose';

export interface ICar extends Document {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'manual' | 'automatic';
  color: string;
  description: string;
  images: string[];
  seller: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const carSchema = new Schema<ICar>(
  {
    brand: {
      type: String,
      required: true,
      trim: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    mileage: {
      type: Number,
      required: true
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'hybrid', 'electric'],
      required: true
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic'],
      required: true
    },
    color: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    images: [{
      type: String
    }],
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICar>('Car', carSchema);
