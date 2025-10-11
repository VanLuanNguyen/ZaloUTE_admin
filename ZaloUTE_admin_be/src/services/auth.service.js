const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

class AuthService {
  // Đăng nhập admin
  async login(username, password) {
    try {
      // Tìm admin theo username
      const admin = await Admin.findByUsername(username);
      
      if (!admin) {
        throw new Error('Invalid username or password');
      }

      // Kiểm tra password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid username or password');
      }

      // Cập nhật last login
      await admin.updateLastLogin();

      // Tạo JWT token
      const jwtSecret = process.env.JWT_SECRET || 'admin_jwt_secret_key_2024_zaloute';
      const token = jwt.sign(
        { 
          id: admin._id,
          username: admin.username,
          role: admin.role
        },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      return {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Hash password
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // So sánh password
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Tạo admin mới (chỉ super_admin mới có quyền)
  async createAdmin(adminData, createdBy) {
    try {
      // Kiểm tra quyền
      const creator = await Admin.findById(createdBy);
      if (!creator || creator.role !== 'super_admin') {
        throw new Error('Insufficient permissions');
      }

      // Kiểm tra username đã tồn tại
      const existingAdmin = await Admin.findOne({ 
        username: adminData.username.toLowerCase() 
      });
      
      if (existingAdmin) {
        throw new Error('Username already exists');
      }

      // Kiểm tra email đã tồn tại
      const existingEmail = await Admin.findOne({ 
        email: adminData.email.toLowerCase() 
      });
      
      if (existingEmail) {
        throw new Error('Email already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(adminData.password);

      // Tạo admin mới
      const newAdmin = await Admin.create({
        username: adminData.username.toLowerCase(),
        password: hashedPassword,
        email: adminData.email.toLowerCase(),
        role: adminData.role || 'admin'
      });

      return {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt
      };
    } catch (error) {
      throw error;
    }
  }

  // Lấy thông tin admin hiện tại
  async getCurrentAdmin(adminId) {
    try {
      const admin = await Admin.findById(adminId);
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      return {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
