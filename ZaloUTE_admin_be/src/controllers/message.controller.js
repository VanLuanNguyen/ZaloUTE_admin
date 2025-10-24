const MessageService = require("../services/message.service");

class MessageController {
  // Lấy tất cả tin nhắn media (image, video, file)
  async getMediaMessages(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        conversationId,
        senderId,
        dateFrom,
        dateTo,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const filters = {
        conversationId,
        senderId,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder,
      };

      const result = await MessageService.getMediaMessages(
        parseInt(page),
        parseInt(limit),
        filters
      );

      res.status(200).json({
        success: true,
        message: "Media messages retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error retrieving media messages",
        error: error.message,
      });
    }
  }
}

module.exports = new MessageController();
