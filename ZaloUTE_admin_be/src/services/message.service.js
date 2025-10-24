const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

class MessageService {
  // Lấy toàn bộ tin nhắn có type là image, video, hoặc file
  async getMediaMessages(page = 1, limit = 10, filters = {}) {
    try {
      const {
        conversationId,
        senderId,
        dateFrom,
        dateTo,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = filters;

      // Tạo query filter
      const query = {
        type: { $in: ["image", "video", "file"] },
      };

      // Filter theo conversation nếu có
      if (conversationId) {
        query.conversation = conversationId;
      }

      // Filter theo sender nếu có
      if (senderId) {
        query.sender = senderId;
      }

      // Filter theo khoảng thời gian
      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
      }

      // Tính pagination
      const skip = (page - 1) * limit;

      // Tạo sort object
      const sort = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Lấy messages với pagination và populate thông tin sender và conversation
      const messages = await Message.find(query)
        .populate("sender", "username email firstname lastname avatar")
        .populate("conversation", "name participants")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      // Đếm tổng số messages
      const total = await Message.countDocuments(query);

      // Tính thông tin pagination
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        messages,
        pagination: {
          currentPage: page,
          totalPages,
          totalMessages: total,
          hasNextPage,
          hasPrevPage,
          limit,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MessageService();
