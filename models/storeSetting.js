import mongoose from "mongoose";

const StoreSettingsSchema = new mongoose.Schema({
  storeAddress: {
    addressLine1: { type: String },
    city: { type: String },
    postcode: { type: String },
    country: { type: String }, 
    state: { type: String }  
  },
  sellingCountries: {
    type: [String],  
    default: []
  },
  shippingEnabled: {
    type: Boolean,
    default: true
  },

  currency: {
    type: String,
    default: 'INR'
  },
  currencyPosition: {
    type: String,
    enum: ['left', 'right'],
    default: 'left'
  },
  numberOfDecimals: {
    type: Number,
    default: 2
  }
}, {
  timestamps: true
});

export default mongoose.models.StoreSettings ||
  mongoose.model("StoreSettings", StoreSettingsSchema);
