const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// JWT Authentication middleware
const auth = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const jwtSecret = process.env.JWT_SECRET || 'admin_jwt_secret_key_2024_zaloute';
      const decoded = jwt.verify(token, jwtSecret);
      
      // Tìm admin từ database
      const admin = await Admin.findById(decoded.id);
      
      if (!admin || !admin.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token or admin not found.'
        });
      }

      // Gắn admin vào request object
      req.admin = admin;
      next();
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first.'
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = { auth, authorize };
