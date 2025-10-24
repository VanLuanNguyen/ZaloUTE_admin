const express = require("express");
const MessageController = require("../controllers/message.controller");
const HiddenMessageController = require("../controllers/hiddenMessage.controller");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Middleware xác thực cho tất cả routes
router.use(auth);

// Route cho tin nhắn media
// GET /api/messages/media - Lấy tất cả tin nhắn media (image, video, file)
router.get("/media", MessageController.getMediaMessages);

// Routes cho quản lý tin nhắn ẩn
// POST /api/messages/:messageId/hide - Ẩn tin nhắn theo ID
router.post("/:messageId/hide", HiddenMessageController.hideMessage);

// GET /api/messages/hidden - Lấy tất cả tin nhắn đã ẩn
router.get("/hidden", HiddenMessageController.getAllHiddenMessages);

// GET /api/messages/hidden/stats - Lấy thống kê tin nhắn ẩn
router.get("/hidden/stats", HiddenMessageController.getHiddenMessageStats);

// GET /api/messages/hidden/:messageId - Lấy chi tiết tin nhắn ẩn theo ID
router.get("/hidden/:messageId", HiddenMessageController.getHiddenMessageById);

// POST /api/messages/:messageId/restore - Khôi phục tin nhắn đã ẩn
router.post("/:messageId/restore", HiddenMessageController.restoreMessage);

// DELETE /api/messages/:messageId/permanent - Xóa vĩnh viễn tin nhắn
router.delete(
  "/:messageId/permanent",
  HiddenMessageController.deleteMessagePermanently
);

module.exports = router;
