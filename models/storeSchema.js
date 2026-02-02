const StoreSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  name: String,
  address: String,
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: [Number] // [longitude, latitude]
  },
  categories: [String],
  image: String,

  createdAt: { type: Date, default: Date.now }
});
