require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkAdminAccount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB');

    // Find the admin user including password
    const adminUser = await User.findOne({ email: 'admin@shopsphere.com' }).select('+password');

    if (!adminUser) {
      console.log('Admin user not found in database');
      await mongoose.disconnect();
      return;
    }

    // Diagnostic output
    console.log('Admin user found:');
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);

    // Check if password exists
    if (!adminUser.password) {
      console.log('WARNING: No password stored for this user');
      await mongoose.disconnect();
      return;
    }

    // Check if password appears to be a bcrypt hash
    const isBcryptHash = /^\$2[ayb]\$/.test(adminUser.password);
    console.log('Password hash exists:', !!adminUser.password);
    console.log('Password appears to be a bcrypt hash:', isBcryptHash);

    // Test password comparison
    try {
      const passwordMatches = await adminUser.comparePassword('Admin123!');
      console.log('comparePassword("Admin123!") result:', passwordMatches);
    } catch (error) {
      console.log('Error testing password comparison:', error.message);
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error checking admin account:', error);
    process.exit(1);
  }
}

// Run the diagnostic script
checkAdminAccount();