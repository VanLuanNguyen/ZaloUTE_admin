const userService = require('../services/user.service');

class UserController {
  // GET /api/users - Lấy danh sách users với pagination và search
  async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      // Validate pagination parameters
      if (page < 1) {
        return res.status(400).json({
          success: false,
          message: 'Page must be greater than 0'
        });
      }

      if (limit < 1 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: 'Limit must be between 1 and 100'
        });
      }

      const result = await userService.getAllUsers(page, limit, search);

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get users'
      });
    }
  }

  // GET /api/users/:id - Lấy thông tin chi tiết user
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      console.error('Get user by ID error:', error);
      
      if (error.message === 'User not found' || error.message === 'Invalid user ID') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get user'
      });
    }
  }

  // PATCH /api/users/:id/toggle-status - Khóa/mở khóa user
  async toggleUserStatus(req, res) {
    try {
      const { id } = req.params;

      const result = await userService.toggleUserStatus(id);

      res.status(200).json({
        success: true,
        message: `User ${result.isActive ? 'activated' : 'deactivated'} successfully`,
        data: result
      });
    } catch (error) {
      console.error('Toggle user status error:', error);
      
      if (error.message === 'User not found' || error.message === 'Invalid user ID') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to toggle user status'
      });
    }
  }

  // DELETE /api/users/:id - Xóa user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const result = await userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: result
      });
    } catch (error) {
      console.error('Delete user error:', error);
      
      if (error.message === 'User not found' || error.message === 'Invalid user ID') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete user'
      });
    }
  }

  // GET /api/users/stats - Lấy thống kê users
  async getUserStats(req, res) {
    try {
      const stats = await userService.getUserStats();

      res.status(200).json({
        success: true,
        message: 'User statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get user statistics'
      });
    }
  }

  // GET /api/users/search - Tìm kiếm users nâng cao
  async searchUsers(req, res) {
    try {
      const filters = {
        username: req.query.username,
        email: req.query.email,
        phone: req.query.phone,
        isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const result = await userService.searchUsers(filters);

      res.status(200).json({
        success: true,
        message: 'Users search completed successfully',
        data: result.users,
        pagination: result.pagination,
        filters: filters
      });
    } catch (error) {
      console.error('Search users error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search users'
      });
    }
  }
}

module.exports = new UserController();


