import mongoose from "mongoose";

const storeVisibilitySchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ["coming-soon", "live"],
      default: "live",
    },
  },
  { timestamps: true }
);

export default mongoose.models.StoreVisibility ||
  mongoose.model("StoreVisibility", storeVisibilitySchema);
