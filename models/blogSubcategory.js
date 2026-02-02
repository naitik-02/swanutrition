import mongoose from "mongoose";

const blogSubCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.BlogSubCategory ||
  mongoose.model("BlogSubCategory", blogSubCategorySchema);
