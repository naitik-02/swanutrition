import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
      slug:{
      type:String,
      required:true,
      trim:true
    },
    image: {
      type: String,
      
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description:{
      type:String, 
      default:""
    }
  },
  {
    timestamps: true,
  }
);

const Subcategory =
  mongoose.models.Subcategory || mongoose.model("Subcategory", subcategorySchema);

export default Subcategory;
