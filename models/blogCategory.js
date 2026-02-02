import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.models.BlogCategory ||
  mongoose.model("BlogCategory", blogCategorySchema);
