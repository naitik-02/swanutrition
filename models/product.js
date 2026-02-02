import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    units: [
      {
        unit: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        finalPrice: { type: Number, required: true },
      },
    ],

    shortDescription: {
      type: String,
    },

    views: { type: Number, default: 0 },

    stock: {
      type: Number,
      default: 0,
    },

    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewLaunch: { type: Boolean, default: false },
    isSuperSaver: { type: Boolean, default: false },

    totalSold: { type: Number, default: 0 },

    status: {
      type: String,
      default: "active",
      enum: ["active", "deactive"],
    },

    returnPolicy: {
      returnable: { type: Boolean, default: false },
      notes: { type: String, default: "No Return Policy" },
    },

    description: {
      type: String,
      default: "",
    },
    benefit: {
      type: String,
      default: "",
    },
    ingredient: {
      type: String,
      default: "",
    },
    usage: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
