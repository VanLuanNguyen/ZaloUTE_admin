const authService = require('../services/auth.service');

class AuthController {
  // POST /api/auth/login
  async login(req, res) {
    try {
      console.log('🔍 Login attempt:', req.body);
      const { username, password } = req.body;

      // Validation
      if (!username || !password) {
        console.log('❌ Missing username or password');
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      console.log('🔍 Calling authService.login...');
      const result = await authService.login(username, password);
      console.log('✅ Login successful');

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  // GET /api/auth/me (lấy thông tin admin hiện tại)
  async getCurrentAdmin(req, res) {
    try {
      const adminInfo = await authService.getCurrentAdmin(req.admin._id);

      res.status(200).json({
        success: true,
        message: 'Admin information retrieved successfully',
        data: adminInfo
      });
    } catch (error) {
      console.error('Get current admin error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get admin information'
      });
    }
  }

  // POST /api/auth/create-admin (tạo admin mới - chỉ super_admin)
  async createAdmin(req, res) {
    try {
      const { username, password, email, role } = req.body;

      // Validation
      if (!username || !password || !email) {
        return res.status(400).json({
          success: false,
          message: 'Username, password, and email are required'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      const newAdmin = await authService.createAdmin({
        username,
        password,
        email,
        role
      }, req.admin._id);

      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        data: newAdmin
      });
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create admin'
      });
    }
  }

  // POST /api/auth/logout (đăng xuất)
  async logout(req, res) {
    try {
      // Với JWT, logout chỉ cần xóa token ở client side
      // Server không cần làm gì thêm vì JWT là stateless
      
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }
}

module.exports = new AuthController();
