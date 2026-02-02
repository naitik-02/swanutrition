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

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
     design: {
    type: String,  
  },
    sections: [sectionSchema], 
   
    status: {
      type: String,
      default: "draft",
      enum: ["published", "draft", "trash"],
    },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: [String] },
    
  },
  { timestamps: true }
);

export default mongoose.models.Page || mongoose.model("Page", pageSchema);
