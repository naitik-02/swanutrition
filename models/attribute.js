import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["color", "radio", "image", "button", "select"],
      default: "select",
    },
    sortOrder: {
      type: String,
      enum: ["name", "custom"],
      default: "name",
    },
  },
  {
    timestamps: true,
  }
);

const Attribute = mongoose.models.Attribute || mongoose.model("Attribute", attributeSchema);

export default Attribute;