import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    description: { type: String },
    user: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      role: String,
      email: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);
