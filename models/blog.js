import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    fields: [
      {
        type: mongoose.Schema.Types.Mixed,
        _id: true,
      },
    ],
  },
  { _id: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description:{
      type:String , required:true , unique:true ,  trim:true
    },

    design: {
      type: String,
      default: "v1",
      enum: ["v1", "v2"],
    },

    sections: {
      type: [sectionSchema],
      default: [],
    },

    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    metaKeywords: { type: [String], default: [] },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },

    featuredImage: {
      type: String,
      trim: true,
      default: "",
    },

    tags: [{ type: String, trim: true }],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    publishedAt: { type: Date, default: null },

    status: {
      type: String,
      default: "draft",
      enum: ["published", "draft", "trash"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost ||
  mongoose.model("BlogPost", blogSchema);
