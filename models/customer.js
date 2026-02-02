import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true },
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);
