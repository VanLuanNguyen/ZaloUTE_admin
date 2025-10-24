const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false, // Có thể null cho chat 1-1
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu hóa query
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastActivity: -1 });
conversationSchema.index({ isGroup: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
