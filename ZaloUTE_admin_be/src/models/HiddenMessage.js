const mongoose = require("mongoose");

const hiddenMessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
      unique: true,
    },
    originalContent: {
      type: String,
      required: true,
    },
    originalType: {
      type: String,
      enum: ["text", "image", "video", "file", "emoji", "sticker"],
      required: true,
    },
    hiddenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    hiddenAt: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["hidden", "restored", "deleted"],
      default: "hidden",
    },
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu hóa query
hiddenMessageSchema.index({ messageId: 1 });
hiddenMessageSchema.index({ hiddenBy: 1 });
hiddenMessageSchema.index({ status: 1 });
hiddenMessageSchema.index({ hiddenAt: -1 });

module.exports = mongoose.model("HiddenMessage", hiddenMessageSchema);
