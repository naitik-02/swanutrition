import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      required: true,
    },
    search_engine_visibility: {
      type: Boolean,
      default: false,
    },

    helpline: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, default: "" },
    helpCenterLink: { type: String, default: "/help" },
    logo: { type: String },
    store_status: {
      type: Boolean,
      default: true,
    },
    payment_method: {
      type: String,
      enum: ["COD", "ONLINE", "BANK"],
    },

    open_time: {
      type: Number,
      default: 9,
    },

    close_time: {
      type: Number,
      default: 8,
    },

    footerDescription1: { type: String, default: "" },
    footerDescription2: { type: String, default: "" },
    footerYear: { type: Number, default: new Date().getFullYear() },
    socials: [
      {
        platform: { type: String, required: true },
        link: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", settingSchema);
