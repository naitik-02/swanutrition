import mongoose from "mongoose";

const emailSettingsSchema = new mongoose.Schema({
  fromName: String,
  fromAddress: String,
  emailFooterText: String
}, { timestamps: true });

export default mongoose.models.EmailSettings || mongoose.model("EmailSettings", emailSettingsSchema);
