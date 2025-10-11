const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // MongoDB URI với authentication (tương thích với Docker setup)
    const mongoUri = process.env.MONGO_URI || 'mongodb://root:example@localhost:27017/zaloute?authSource=admin';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    
    // Tạo admin mặc định nếu chưa có
    console.log('🔍 Starting createDefaultAdmin...');
    await createDefaultAdmin();
    console.log('✅ createDefaultAdmin completed');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    console.log('🔍 Checking for default admin...');
    const Admin = require('../models/Admin');
    const bcrypt = require('bcryptjs');
    
    const existingAdmin = await Admin.findOne({ 
      username: process.env.DEFAULT_ADMIN_USERNAME || 'admin'
    });
    
    console.log('🔍 Existing admin found:', !!existingAdmin);
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'admin123', 12);
      
      await Admin.create({
        username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
        password: hashedPassword,
        email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@zaloute.com',
        role: 'super_admin'
      });
      
      console.log('✅ Default admin account created');
      console.log(`Username: ${process.env.DEFAULT_ADMIN_USERNAME || 'admin'}`);
      console.log(`Password: ${process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'}`);
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};

module.exports = connectDB;
