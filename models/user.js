import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "customer"],
      default: "customer",
    },

    permissions: {
      type: [String],
      default: [],
    },

    password: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
