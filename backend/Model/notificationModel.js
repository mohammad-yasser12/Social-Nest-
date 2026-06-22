import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    message: String,

    type: String,

    isRead: {
      type: Boolean,
      default: false,
    },

   expiresAt: {
  type: Date,
  default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
},
  },
  { timestamps: true }
);

export default mongoose.model(
  "Notification",
  notificationSchema
);