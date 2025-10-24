const HiddenMessageService = require("../services/hiddenMessage.service");

class HiddenMessageController {
  // Ẩn tin nhắn theo ID
  async hideMessage(req, res) {
    try {
      const { messageId } = req.params;
      const { reason } = req.body;
      const adminId = req.admin.id;

      const result = await HiddenMessageService.hideMessage(
        messageId,
        adminId,
        reason
      );

      res.status(200).json({
        success: true,
        message: "Message hidden successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error hiding message",
        error: error.message,
      });
    }
  }

  // Lấy tất cả tin nhắn đã ẩn
  async getAllHiddenMessages(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status = "hidden",
        hiddenBy,
        dateFrom,
        dateTo,
        sortBy = "hiddenAt",
        sortOrder = "desc",
      } = req.query;

      const filters = {
        status,
        hiddenBy,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder,
      };

      const result = await HiddenMessageService.getAllHiddenMessages(
        parseInt(page),
        parseInt(limit),
        filters
      );

      res.status(200).json({
        success: true,
        message: "Hidden messages retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error retrieving hidden messages",
        error: error.message,
      });
    }
  }

  // Khôi phục tin nhắn đã ẩn
  async restoreMessage(req, res) {
    try {
      const { messageId } = req.params;
      const adminId = req.admin.id;

      const result = await HiddenMessageService.restoreMessage(
        messageId,
        adminId
      );

      res.status(200).json({
        success: true,
        message: "Message restored successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error restoring message",
        error: error.message,
      });
    }
  }

  // Xóa vĩnh viễn tin nhắn
  async deleteMessagePermanently(req, res) {
    try {
      const { messageId } = req.params;
      const adminId = req.admin.id;

      const result = await HiddenMessageService.deleteMessagePermanently(
        messageId,
        adminId
      );

      res.status(200).json({
        success: true,
        message: "Message deleted permanently",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error deleting message permanently",
        error: error.message,
      });
    }
  }

  // Lấy thống kê tin nhắn ẩn
  async getHiddenMessageStats(req, res) {
    try {
      const { hiddenBy, dateFrom, dateTo } = req.query;

      const filters = {
        hiddenBy,
        dateFrom,
        dateTo,
      };

      const stats = await HiddenMessageService.getHiddenMessageStats(filters);

      res.status(200).json({
        success: true,
        message: "Hidden message statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error retrieving hidden message statistics",
        error: error.message,
      });
    }
  }

  // Lấy chi tiết tin nhắn ẩn theo ID
  async getHiddenMessageById(req, res) {
    try {
      const { messageId } = req.params;

      const result = await HiddenMessageService.getHiddenMessageById(messageId);

      res.status(200).json({
        success: true,
        message: "Hidden message details retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error retrieving hidden message details",
        error: error.message,
      });
    }
  }
}

module.exports = new HiddenMessageController();
