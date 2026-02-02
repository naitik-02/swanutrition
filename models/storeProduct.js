import mongoose from "mongoose";

const ProductSettingsSchema = new mongoose.Schema({
  reviews: {
    enableProductReviews: { type: Boolean, default: true },
    showVerifiedOwnerLabel: { type: Boolean, default: true },
    reviewsOnlyByVerifiedOwners: { type: Boolean, default: false }
  },
  ratings: {
    enableStarRating: { type: Boolean, default: true },
    requireStarRating: { type: Boolean, default: false }
  },
  measurementUnits: {
    weightUnit: {
      type: String,
      enum: ['kg', 'g', 'lbs', 'oz'],
      default: 'kg'
    },
    dimensionUnit: {
      type: String,
      enum: ['cm', 'm', 'mm', 'in', 'yd'],
      default: 'cm'
    }
  },
  inventory: {
    enableStockManagement: { type: Boolean, default: true },
    holdStockMinutes: { type: Number, default: 60 }, 
    allowBackorders: {
      type: String,
      enum: ['no', 'yes', 'notify'],
      default: 'no'
    },
    notifyLowStock: { type: Boolean, default: true },
    lowStockThreshold: { type: Number, default: 2 },
    outOfStockThreshold: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

export default mongoose.models.ProductSettings ||
  mongoose.model("ProductSettings", ProductSettingsSchema);
