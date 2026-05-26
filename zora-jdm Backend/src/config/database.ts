import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI tidak terbaca di file .env! Pastikan file .env sudah benar.');
    }

    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 URI:', mongoUri.substring(0, 50) + '...');
    
    // Set connection options with timeout
    const options = {
      serverSelectionTimeoutMS: 10000, // Increased to 10 seconds for development
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
    };

    await mongoose.connect(mongoUri, options);
    
    console.log('✅ MongoDB Atlas Connected Successfully');
    console.log('📊 Database Name:', mongoose.connection.name);
    console.log('🔗 Connection State:', mongoose.connection.readyState); // 1 = connected
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ MongoDB connection error:', errorMessage);
    console.log('\n⚠️ Troubleshooting tips:');
    console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('2. Verify username and password are correct');
    console.log('3. Ensure cluster name is correct');
    console.log('4. Check if network allows MongoDB connections');
    console.log('5. Try using a local MongoDB instance instead');
    console.log('6. Ensure MONGODB_URI format is correct in .env\n');
    
    // Don't throw error, let the app continue without database
    // This allows testing with mock data if needed
    return false;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('MongoDB disconnection error:', errorMessage);
  }
};