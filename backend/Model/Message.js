import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
     isDeleted: {
      type: Boolean,
      default: false, // delete for everyone
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // delete for me
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);