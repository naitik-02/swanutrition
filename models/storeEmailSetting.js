import mongoose from "mongoose";

const generalSchema = new mongoose.Schema({
  fromName: { type: String, default: "" },
  fromAddress: { type: String, default: "" },
  emailFooterText: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.EmailGeneralSettings || mongoose.model("EmailGeneralSettings", generalSchema);
