// import mongoose from "mongoose";

// const shopSchema = new mongoose.Schema(
//   {
//     shopkeeperId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", 
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//     location: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number],
//         required: true,
//       },
//     },
//     deliveryRadius: {
//       type: Number, 
//       default: 5000,
//     },
//     image: {
//       type: String, 
//     },
//     status: {
//       type: String,
//       enum: ["open", "closed"],
//       default: "open",
//     },
//   },
//   { timestamps: true }
// );


// shopSchema.index({ location: "2dsphere" });

// export default mongoose.models.Shop || mongoose.model("Shop", shopSchema);
