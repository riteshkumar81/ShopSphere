require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Configuration - change these for your local admin account
const adminEmail = 'admin@shopsphere.com';
const adminPassword = 'Admin123!'; // Change this for your local testing
const adminName = 'ShopSphere Admin';

async function createAdminAccount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin account already exists:', existingAdmin.email);
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
      return;
    }

    // Create admin user - password will be hashed by User model's pre-save hook
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword, // Will be hashed automatically
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin account created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword); // Only shown for local testing
    console.log('Role:', adminUser.role);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
}

// Run the script
createAdminAccount();