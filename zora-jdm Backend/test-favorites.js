/**
 * Test script for Favorites API
 * 
 * This script tests the favorites endpoints to ensure they're working correctly.
 * 
 * Usage:
 * 1. Make sure backend server is running (npm run dev)
 * 2. Login to get a token
 * 3. Run: node test-favorites.js
 */

const API_URL = 'http://localhost:5001/api';

// You need to replace this with a real token from your login
// To get a token: Login via frontend or use the auth API
const TEST_TOKEN = 'YOUR_JWT_TOKEN_HERE';

// Test car ID - replace with a real car ID from your database
const TEST_CAR_ID = '507f1f77bcf86cd799439011';

async function testFavorites() {
  console.log('🧪 Testing Favorites API...\n');

  // Test 1: Health check
  console.log('1️⃣ Testing health endpoint...');
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✅ Health check:', data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: Get favorites (requires auth)
  console.log('\n2️⃣ Testing GET /favorites...');
  try {
    const response = await fetch(`${API_URL}/favorites`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401) {
      console.log('⚠️ Unauthorized - You need to set a valid JWT token in this script');
      console.log('   To get a token:');
      console.log('   1. Login via frontend (http://localhost:3000/login)');
      console.log('   2. Open browser console');
      console.log('   3. Run: localStorage.getItem("authToken")');
      console.log('   4. Copy the token and paste it in TEST_TOKEN variable above');
      return;
    }

    const data = await response.json();
    console.log('✅ Get favorites:', data);
  } catch (error) {
    console.error('❌ Get favorites failed:', error.message);
  }

  // Test 3: Add to favorites
  console.log('\n3️⃣ Testing POST /favorites/:carId...');
  try {
    const response = await fetch(`${API_URL}/favorites/${TEST_CAR_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('✅ Add to favorites:', data);
  } catch (error) {
    console.error('❌ Add to favorites failed:', error.message);
  }

  // Test 4: Remove from favorites
  console.log('\n4️⃣ Testing DELETE /favorites/:carId...');
  try {
    const response = await fetch(`${API_URL}/favorites/${TEST_CAR_ID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('✅ Remove from favorites:', data);
  } catch (error) {
    console.error('❌ Remove from favorites failed:', error.message);
  }

  console.log('\n✅ All tests completed!');
}

// Run tests
testFavorites().catch(console.error);
