import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_review", "resolved", "rejected"],
      default: "pending",
    },
    sellerReply: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Complaint ||
  mongoose.model("Complaint", complaintSchema);
