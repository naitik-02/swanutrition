import mongoose from "mongoose";

const heroCategorySliderSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    title: {
      type: String,

      trim: true,
    },

    url: {
      type: String,
      trim: true,
    },

    description: {
      type: String,

      trim: true,
    },

    backgroundImage: {
      type: String,
      required: true,
      trim: true,
    },

    discount: {
      type: String,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.HeroCategorySlider ||
  mongoose.model("HeroCategorySlider", heroCategorySliderSchema);
