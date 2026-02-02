import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    logo: { type: String },

    store_status: {
      type: String,
      enum:["open" , "close"],
      default: "open",
    },

    open_time: {
      type: Number,
      default: 9,
    },

    close_time: {
      type: Number,
      default: 8,
    },

    free_delivery_threshold: {
      type: Number,
      default: 500,
    },

    platform_fee: {
      type: Number,
      default: 5,
    },

    distance_slabs: [
      {
        min_km: { type: Number },
        max_km: { type: Number },
        price: { type: Number },
      },
    ],

    default_delivery_charge: {
      type: Number,
      default: 40,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", settingSchema);
