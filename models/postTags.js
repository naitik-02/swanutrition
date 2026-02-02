import mongoose from "mongoose";

const PostTagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PostTag ||
  mongoose.model("PostTag", PostTagSchema);
