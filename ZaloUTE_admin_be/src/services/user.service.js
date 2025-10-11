const User = require('../models/User');

class UserService {
  // Lấy danh sách users với pagination và search
  async getAllUsers(page = 1, limit = 10, search = '') {
    try {
      const query = {};
      
      // Tìm kiếm theo username, email, firstname, lastname, phone
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { username: searchRegex },
          { email: searchRegex },
          { firstname: searchRegex },
          { lastname: searchRegex },
          { phone: searchRegex }
        ];
      }

      // Tính pagination
      const skip = (page - 1) * limit;
      
      // Lấy users với pagination
      const users = await User.find(query)
        .select('-password -otp -otpExpiresAt') // Loại bỏ các field nhạy cảm
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Đếm tổng số users
      const total = await User.countDocuments(query);
      
      // Tính thông tin pagination
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          hasNextPage,
          hasPrevPage,
          limit
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Lấy thông tin chi tiết user theo ID
  async getUserById(userId) {
    try {
      const user = await User.findById(userId)
        .select('-password -otp -otpExpiresAt')
        .lean();

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new Error('Invalid user ID');
      }
      throw error;
    }
  }

  // Khóa/mở khóa user (toggle isActive)
  async toggleUserStatus(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Toggle isActive status
      user.isActive = !user.isActive;
      await user.save();

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      if (error.name === 'CastError') {
        throw new Error('Invalid user ID');
      }
      throw error;
    }
  }

  // Xóa user
  async deleteUser(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      await User.findByIdAndDelete(userId);

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        message: 'User deleted successfully'
      };
    } catch (error) {
      if (error.name === 'CastError') {
        throw new Error('Invalid user ID');
      }
      throw error;
    }
  }

  // Lấy thống kê users
  async getUserStats() {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });
      const inactiveUsers = await User.countDocuments({ isActive: false });
      
      // Users được tạo trong 30 ngày gần đây
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newUsersLast30Days = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });

      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        newUsersLast30Days
      };
    } catch (error) {
      throw error;
    }
  }

  // Tìm kiếm users nâng cao
  async searchUsers(filters = {}) {
    try {
      const {
        username,
        email,
        phone,
        isActive,
        dateFrom,
        dateTo,
        page = 1,
        limit = 10
      } = filters;

      const query = {};

      // Filter theo username
      if (username) {
        query.username = new RegExp(username, 'i');
      }

      // Filter theo email
      if (email) {
        query.email = new RegExp(email, 'i');
      }

      // Filter theo phone
      if (phone) {
        query.phone = new RegExp(phone, 'i');
      }

      // Filter theo trạng thái
      if (isActive !== undefined) {
        query.isActive = isActive;
      }

      // Filter theo ngày tạo
      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
      }

      const skip = (page - 1) * limit;
      
      const users = await User.find(query)
        .select('-password -otp -otpExpiresAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await User.countDocuments(query);

      return {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          limit
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();


