// models/topCategory.js
import mongoose from "mongoose";

const topCategorySchema = new mongoose.Schema(
  {
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TopCategory =
  mongoose.models.TopCategory ||
  mongoose.model("TopCategory", topCategorySchema);

export default TopCategory;
