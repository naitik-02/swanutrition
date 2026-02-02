import mongoose from "mongoose";

const FooterMenuSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);


const MenuListSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    items: { type: [FooterMenuSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);


const SocialSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);


const paragraphSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    value: { type: String },
  },
  { _id: false }
);

const FooterContentSchema = new mongoose.Schema(
  {
    menus: {
      type: [MenuListSchema],
      default: [],
    },

    logo: {
      type: String,
    },

    socials: { type: [SocialSchema], default: [] },

    isActive: { type: Boolean, default: true },

    info: { type: [paragraphSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.FooterContent ||
  mongoose.model("FooterContent", FooterContentSchema);
