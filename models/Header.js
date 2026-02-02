const { default: mongoose, mongo } = require("mongoose");

const subMenuSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    slug: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  { _id: false }
);

const menuSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    slug: {
      type: String,
    },
    sub: {
      type: [subMenuSchema],
    },

    order: {
      type: Number,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    url: {
      type: String,
    },

    color: {
      type: String,
    },
  },
  { _id: false }
);

const headerSchema = new mongoose.Schema({
  logo: {
    type: String,
  },

  menus: {
    type: [menuSchema],
  },

  offers: {
    isActive: { type: Boolean, default: true },
    items: { type: [offerSchema], default: [] },
  },
});

export default mongoose.models.Header || mongoose.model("Header", headerSchema);
