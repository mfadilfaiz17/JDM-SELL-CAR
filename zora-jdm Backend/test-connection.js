// Test MongoDB Connection
// Run: node test-connection.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  console.log('🧪 Testing MongoDB Connection...\n');
  
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not found in .env file');
    process.exit(1);
  }
  
  console.log('📝 Connection String:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
  console.log('');
  
  try {
    console.log('⏳ Attempting to connect...');
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ SUCCESS! MongoDB Connected');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('');
    
    // Test creating a document
    console.log('🧪 Testing database write...');
    const TestModel = mongoose.model('Test', new mongoose.Schema({ test: String }));
    const doc = await TestModel.create({ test: 'Connection test successful' });
    console.log('✅ Write test successful');
    
    // Clean up
    await TestModel.deleteOne({ _id: doc._id });
    console.log('✅ Cleanup successful');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
    
    console.log('\n🎉 All tests passed! Your MongoDB connection is working.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ CONNECTION FAILED');
    console.error('Error:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting Steps:');
    console.error('');
    console.error('1. WHITELIST YOUR IP:');
    console.error('   → Go to: https://cloud.mongodb.com/');
    console.error('   → Network Access → Add IP Address');
    console.error('   → Add: 0.0.0.0/0 (Allow from anywhere)');
    console.error('');
    console.error('2. CHECK USERNAME & PASSWORD:');
    console.error('   → Database Access → Check user "faiz" exists');
    console.error('   → If password has special chars, URL encode them');
    console.error('');
    console.error('3. VERIFY CLUSTER NAME:');
    console.error('   → Check cluster name is "cluster0.n9a8nuf"');
    console.error('');
    console.error('4. GET NEW CONNECTION STRING:');
    console.error('   → Database → Connect → Connect your application');
    console.error('   → Copy the connection string');
    console.error('   → Replace <password> with your actual password');
    console.error('');
    console.error('5. ALTERNATIVE - USE LOCAL MONGODB:');
    console.error('   → Install MongoDB locally');
    console.error('   → Change MONGODB_URI to: mongodb://localhost:27017/zora-jdm');
    console.error('');
    
    process.exit(1);
  }
};

testConnection();
