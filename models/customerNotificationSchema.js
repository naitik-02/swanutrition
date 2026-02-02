import mongoose from "mongoose";

const customerNotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "processingOrder", "completedOrder", "customerOnHoldOrder", "customerProcessingOrder",
      "customerCompletedOrder", "customerInvoice", "customerNote", "customerResetPassword",
      "customerNewAccount"
    ],
    required: true,
    unique: true
  },
  enabled: { type: Boolean, default: true },
  subject: String,
  heading: String,
  additionalContent: String
}, { timestamps: true });

export default mongoose.models.CustomerNotification || mongoose.model("CustomerNotification", customerNotificationSchema);
