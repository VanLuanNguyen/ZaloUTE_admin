const Message = require("../models/Message");
const HiddenMessage = require("../models/HiddenMessage");

class HiddenMessageService {
  // Ẩn tin nhắn theo ID
  async hideMessage(messageId, adminId, reason = "") {
    try {
      // Tìm tin nhắn cần ẩn
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error("Message not found");
      }

      // Kiểm tra tin nhắn đã bị ẩn chưa
      const existingHidden = await HiddenMessage.findOne({
        messageId,
        status: "hidden",
      });

      if (existingHidden) {
        throw new Error("Message is already hidden");
      }

      // Kiểm tra xem có record cũ với trạng thái restored không
      const restoredRecord = await HiddenMessage.findOne({
        messageId,
        status: "restored",
      });

      let hiddenMessage;
      if (restoredRecord) {
        // Nếu có record đã restored, cập nhật lại thành hidden
        // Lưu nội dung hiện tại (đã được khôi phục) làm originalContent mới
        restoredRecord.originalContent = message.content;
        restoredRecord.originalType = message.type;
        restoredRecord.status = "hidden";
        restoredRecord.hiddenBy = adminId;
        restoredRecord.reason = reason;
        restoredRecord.hiddenAt = new Date();
        hiddenMessage = await restoredRecord.save();
      } else {
        // Tạo record mới
        hiddenMessage = new HiddenMessage({
          messageId,
          originalContent: message.content,
          originalType: message.type,
          hiddenBy: adminId,
          reason,
          status: "hidden",
        });
        await hiddenMessage.save();
      }

      // Cập nhật tin nhắn gốc
      message.content = "[Nội dung tạm thời bị ẩn]";
      message.type = "text";
      await message.save();

      return {
        messageId: message._id,
        hiddenAt: hiddenMessage.hiddenAt,
        hiddenBy: adminId,
        reason: hiddenMessage.reason,
        originalContent: hiddenMessage.originalContent,
        originalType: hiddenMessage.originalType,
      };
    } catch (error) {
      throw error;
    }
  }

  // Lấy tất cả tin nhắn đã ẩn
  async getAllHiddenMessages(page = 1, limit = 10, filters = {}) {
    try {
      const {
        status = "hidden",
        hiddenBy,
        dateFrom,
        dateTo,
        sortBy = "hiddenAt",
        sortOrder = "desc",
      } = filters;

      const query = { status };

      // Filter theo admin đã ẩn
      if (hiddenBy) {
        query.hiddenBy = hiddenBy;
      }

      // Filter theo khoảng thời gian
      if (dateFrom || dateTo) {
        query.hiddenAt = {};
        if (dateFrom) query.hiddenAt.$gte = new Date(dateFrom);
        if (dateTo) query.hiddenAt.$lte = new Date(dateTo);
      }

      const skip = (page - 1) * limit;
      const sort = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      const hiddenMessages = await HiddenMessage.find(query)
        .populate("messageId", "conversation sender createdAt updatedAt")
        .populate("hiddenBy", "username email")
        .populate({
          path: "messageId",
          populate: [
            { path: "sender", select: "username email firstname lastname" },
            { path: "conversation", select: "name participants isGroup" },
          ],
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await HiddenMessage.countDocuments(query);

      return {
        hiddenMessages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalMessages: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
          limit,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Khôi phục tin nhắn đã ẩn
  async restoreMessage(messageId, adminId) {
    try {
      // Tìm tin nhắn trong bảng ẩn
      const hiddenMessage = await HiddenMessage.findOne({
        messageId,
        status: "hidden",
      });

      if (!hiddenMessage) {
        throw new Error("Hidden message not found or already processed");
      }

      // Tìm tin nhắn gốc
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error("Original message not found");
      }

      // Khôi phục nội dung gốc
      message.content = hiddenMessage.originalContent;
      message.type = hiddenMessage.originalType;
      await message.save();

      // Cập nhật trạng thái trong bảng ẩn
      hiddenMessage.status = "restored";
      await hiddenMessage.save();

      return {
        messageId: message._id,
        restoredAt: new Date(),
        restoredBy: adminId,
        originalContent: hiddenMessage.originalContent,
        originalType: hiddenMessage.originalType,
      };
    } catch (error) {
      throw error;
    }
  }

  // Xóa vĩnh viễn tin nhắn
  async deleteMessagePermanently(messageId, adminId) {
    try {
      // Tìm tin nhắn trong bảng ẩn
      const hiddenMessage = await HiddenMessage.findOne({
        messageId,
        status: "hidden",
      });

      if (!hiddenMessage) {
        throw new Error("Hidden message not found or already processed");
      }

      // Xóa tin nhắn gốc
      const message = await Message.findByIdAndDelete(messageId);
      if (!message) {
        throw new Error("Original message not found");
      }

      // Cập nhật trạng thái trong bảng ẩn
      hiddenMessage.status = "deleted";
      await hiddenMessage.save();

      return {
        messageId,
        deletedAt: new Date(),
        deletedBy: adminId,
        originalContent: hiddenMessage.originalContent,
        originalType: hiddenMessage.originalType,
      };
    } catch (error) {
      throw error;
    }
  }

  // Lấy thống kê tin nhắn ẩn
  async getHiddenMessageStats(filters = {}) {
    try {
      const { hiddenBy, dateFrom, dateTo } = filters;

      const baseQuery = {};

      if (hiddenBy) {
        baseQuery.hiddenBy = hiddenBy;
      }

      if (dateFrom || dateTo) {
        baseQuery.hiddenAt = {};
        if (dateFrom) baseQuery.hiddenAt.$gte = new Date(dateFrom);
        if (dateTo) baseQuery.hiddenAt.$lte = new Date(dateTo);
      }

      const totalHidden = await HiddenMessage.countDocuments({
        ...baseQuery,
        status: "hidden",
      });

      const totalRestored = await HiddenMessage.countDocuments({
        ...baseQuery,
        status: "restored",
      });

      const totalDeleted = await HiddenMessage.countDocuments({
        ...baseQuery,
        status: "deleted",
      });

      const totalAll = totalHidden + totalRestored + totalDeleted;

      return {
        totalAll,
        totalHidden,
        totalRestored,
        totalDeleted,
      };
    } catch (error) {
      throw error;
    }
  }

  // Lấy chi tiết tin nhắn ẩn theo ID
  async getHiddenMessageById(messageId) {
    try {
      const hiddenMessage = await HiddenMessage.findOne({ messageId })
        .populate("messageId", "conversation sender createdAt updatedAt")
        .populate("hiddenBy", "username email")
        .populate({
          path: "messageId",
          populate: [
            { path: "sender", select: "username email firstname lastname" },
            { path: "conversation", select: "name participants isGroup" },
          ],
        })
        .lean();

      if (!hiddenMessage) {
        throw new Error("Hidden message not found");
      }

      return hiddenMessage;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new HiddenMessageService();
