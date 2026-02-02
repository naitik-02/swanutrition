// models/CartItem.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },


    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },


    price: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    }
  },

  
  { _id: false }
);

export default cartItemSchema;