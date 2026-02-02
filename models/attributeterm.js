import mongoose from "mongoose";

const attributeTermSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    attribute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attribute",
      required: true,
    },
    colorCode: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

attributeTermSchema.index({ name: 1, attribute: 1 }, { unique: true });

const AttributeTerm = mongoose.models.AttributeTerm || mongoose.model("AttributeTerm", attributeTermSchema);

export default AttributeTerm;