import mongoose from "mongoose";

const adminNotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["newOrder", "canceledOrder", "failedOrder", "refundedOrder"],
    required: true,
    unique: true
  },
  enabled: { type: Boolean, default: true },
  recipientAddress: String,
  subject: String,
  heading: String,
  additionalContent: String
}, { timestamps: true });

export default mongoose.models.AdminNotification || mongoose.model("AdminNotification", adminNotificationSchema);
